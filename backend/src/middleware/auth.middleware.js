import admin from "firebase-admin";
import { getDb } from "../config/firebase.js";
import { logger } from "../config/logger.js";

/**
 * Short-lived cache for the Firestore role fallback (uid → { role, expires }).
 * The custom claim is the primary source; this only covers the window where a
 * freshly-set claim hasn't propagated to the token yet. Caching avoids a
 * per-request Firestore read for those users. TTL is intentionally short so a
 * role change takes effect quickly.
 */
const ROLE_CACHE_TTL_MS = 60 * 1000;
const roleCache = new Map();

const getCachedRole = (uid) => {
  const hit = roleCache.get(uid);
  if (hit && hit.expires > Date.now()) return hit.role;
  roleCache.delete(uid);
  return undefined;
};

const setCachedRole = (uid, role) => {
  roleCache.set(uid, { role, expires: Date.now() + ROLE_CACHE_TTL_MS });
};

/**
 * Middleware: verify Firebase ID token from Authorization: Bearer <token> header.
 * Attaches decoded token claims to req.user (includes uid, email, role).
 *
 * Role resolution: prefer the custom claim on the verified token; if it's absent
 * (common in this project because role is the source-of-truth in Firestore
 * /users/{uid} for dev, and the claim may not yet be set on a fresh login),
 * fall back to reading the role from the user's Firestore doc. Both sources are
 * server-side/authoritative — the client cannot influence either, so this stays
 * secure while keeping role enforcement consistent app-wide.
 *
 * Call initializeFirebase() before using this middleware.
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized: missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // { uid, email, role?, ... }

    // Fall back to Firestore role if the token has no role claim. Cached briefly
    // so this costs at most one read per uid per TTL window, not one per request.
    if (!req.user.role && decoded.uid) {
      const cached = getCachedRole(decoded.uid);
      if (cached) {
        req.user.role = cached;
      } else {
        try {
          const doc = await getDb().collection("users").doc(decoded.uid).get();
          if (doc.exists) {
            const role = doc.data()?.role;
            req.user.role = role;
            if (role) setCachedRole(decoded.uid, role);
          }
        } catch (e) {
          logger.warn({ err: e }, `[verifyToken] Could not read Firestore role for ${decoded.uid}:`);
        }
      }
    }

    next();
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized: invalid or expired token" });
  }
};

/**
 * Middleware factory: require a specific role or array of roles.
 * Usage: requireRole("admin") or requireRole(["admin","manager"])
 * Must be used AFTER verifyToken.
 */
export const requireRole = (...allowedRoles) => {
  const roles = allowedRoles.flat();
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const userRole = req.user.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ success: false, error: "Forbidden: insufficient role" });
    }
    next();
  };
};
