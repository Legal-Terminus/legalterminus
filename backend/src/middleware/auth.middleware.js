import admin from "firebase-admin";

/**
 * Middleware: verify Firebase ID token from Authorization: Bearer <token> header.
 * Attaches decoded token claims to req.user (includes uid, email, role custom claim).
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
    req.user = decoded; // { uid, email, role, ... }
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
