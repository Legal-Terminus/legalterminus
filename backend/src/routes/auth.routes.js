import express from "express";
import admin from "firebase-admin";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createDoc, getDoc, updateDoc } from "../config/firestore.js";

const router = express.Router();

const VALID_ROLES = ["admin", "manager", "team_member", "client"];

/**
 * GET /api/auth/firebase-config
 * Returns Firebase configuration for client-side initialization
 * Public endpoint (no authentication required)
 */
router.get("/firebase-config", (req, res) => {
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    // Validate that all required config values exist
    const requiredFields = [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
    ];

    const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);

    if (missingFields.length > 0) {
      return res.status(500).json({
        success: false,
        error: "Missing Firebase configuration",
        missingFields,
      });
    }

    res.json({
      success: true,
      config: firebaseConfig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/register
 * Called after Firebase Auth account creation (client-side).
 * Creates the Firestore users/{uid} document with role = "client" by default.
 * Auth: Bearer <firebase_id_token>
 * Body: { fullName, email?, mobile?, businessName?, state? }
 */
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { fullName, mobile, businessName, state } = req.body;

    const existing = await getDoc("users", uid);
    if (existing) {
      return res.status(200).json({ success: true, user: existing, created: false });
    }

    const now = new Date().toISOString();
    const userData = {
      uid,
      email: email || "",
      fullName: String(fullName || "").slice(0, 200),
      mobile: String(mobile || "").replace(/[^0-9+\-() ]/g, "").slice(0, 20),
      businessName: String(businessName || "").slice(0, 200),
      state: String(state || "").slice(0, 100),
      role: "client",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    await createDoc("users", uid, userData);
    await admin.auth().setCustomUserClaims(uid, { role: "client" });

    res.status(201).json({ success: true, user: userData, created: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Returns the Firestore profile for the authenticated user.
 * Auth: Bearer <firebase_id_token>
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await getDoc("users", uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User profile not found. Call POST /api/auth/register first.",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/auth/set-role
 * Admin-only: update a user's role and sync the Firebase custom claim.
 * Auth: Bearer <firebase_id_token> with role = admin
 * Body: { targetUid, role }
 */
router.patch("/set-role", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden: admin only" });
    }

    const { targetUid, role } = req.body;
    if (!targetUid || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `role must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    await updateDoc("users", targetUid, { role, updatedAt: new Date().toISOString() });
    await admin.auth().setCustomUserClaims(targetUid, { role });

    res.json({ success: true, targetUid, role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/admin/create-user
 * Admin-only: create a team member or client account server-side with a set role.
 * Auth: Bearer <firebase_id_token> with role = admin
 * Body: { email, fullName, role, mobile?, designation?, dateOfJoining? }
 */
router.post("/admin/create-user", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden: admin only" });
    }

    const { email, fullName, role, mobile, designation, dateOfJoining } = req.body;

    if (!email || !fullName || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "email, fullName and a valid role are required",
      });
    }

    // Create Firebase Auth account; user sets own password via the reset link
    const tempPassword = Math.random().toString(36).slice(-10) + "Aa1!";
    const authUser = await admin.auth().createUser({
      email: String(email).slice(0, 254),
      password: tempPassword,
      displayName: String(fullName).slice(0, 200),
    });

    await admin.auth().setCustomUserClaims(authUser.uid, { role });

    const now = new Date().toISOString();
    const userData = {
      uid: authUser.uid,
      email: authUser.email,
      fullName: String(fullName).slice(0, 200),
      mobile: String(mobile || "").replace(/[^0-9+\-() ]/g, "").slice(0, 20),
      designation: String(designation || "").slice(0, 100),
      dateOfJoining: dateOfJoining || now,
      role,
      status: "active",
      createdAt: now,
      updatedAt: now,
      createdBy: req.user.uid,
    };

    await createDoc("users", authUser.uid, userData);

    const resetLink = await admin.auth().generatePasswordResetLink(authUser.email);

    res.status(201).json({ success: true, user: userData, resetLink });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
