import express from "express";
import admin from "firebase-admin";
import { verifyToken, requireRole } from "../middleware/auth.middleware.js";
import { getDb } from "../config/firebase.js";
import { VALID_ROLES, canAssignRole } from "../config/roles.js";
import {
  upsertUser,
  getUserByEmail,
  updateUserRole,
} from "../services/userService.js";

const router = express.Router();

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
 * Handles user registration/sync for all scenarios:
 * 1. New self-signup (Google/Email) → Create as 'client'
 * 2. Admin creates user → Preserve admin-assigned role
 * 3. Admin + Google merge → Link accounts, preserve admin role
 * 
 * Auth: Bearer <firebase_id_token>
 * Body: { fullName, mobile, businessName, state, provider: 'google' | 'email' }
 */
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { uid, email, photoURL } = req.user;
    const { fullName, mobile, businessName, state, provider = 'email' } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email required' });
    }

    // Check if user exists with this email (admin-created scenario)
    const existingUser = await getUserByEmail(email);

    // Determine role:
    // - If exists in our system: use their existing role
    // - If new: default to 'client'
    const role = existingUser?.role || 'client';

    // Prepare profile data
    const profileData = {
      name: String(fullName || '').slice(0, 200),
      fullName: String(fullName || '').slice(0, 200),
      email,
      mobile: String(mobile || '').replace(/[^0-9+\-() ]/g, '').slice(0, 20),
      businessName: String(businessName || '').slice(0, 200),
      state: String(state || '').slice(0, 100),
      ...(photoURL && provider === 'google' && { profilePictureUrl: photoURL }),
    };

    // Call unified upsertUser service
    const result = await upsertUser(
      email,
      role,
      profileData,
      {
        sendEmail: false, // Don't send email on login
        authProvider: provider,
        createdBy: 'auth_register',
      }
    );

    res.status(result.isUpdate ? 200 : 201).json({
      success: true,
      user: {
        uid: result.uid,
        email: result.email,
        name: result.name,
        role: result.role,
      },
      created: !result.isUpdate,
      scenario: result.scenario,
      isUpdate: result.isUpdate,
      message: result.message,
    });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
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
    const db = getDb();

    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "User profile not found. Call POST /api/auth/register first.",
      });
    }

    res.json({ success: true, user: { uid, ...doc.data() } });
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
router.patch("/set-role", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { targetUid, role } = req.body;
    if (!targetUid || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `role must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    // Privilege guard: caller may only assign roles permitted for their own role.
    if (!canAssignRole(req.user.role, role)) {
      return res.status(403).json({
        success: false,
        error: `You are not allowed to assign the role '${role}'.`,
      });
    }

    // Use unified service to update role
    const result = await updateUserRole(targetUid, role);

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/admin/create-user
 * Admin-only: create a user account server-side with a set role.
 * Now uses unified upsertUser service for consistency.
 * Auth: Bearer <firebase_id_token> with role = admin
 * Body: { email, fullName, role, mobile?, designation?, dateOfJoining? }
 */
router.post("/admin/create-user", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { email, fullName, role, mobile, designation, dateOfJoining } = req.body;

    if (!email || !fullName || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "email, fullName and a valid role are required",
      });
    }

    // Privilege guard: caller may only assign roles permitted for their own role.
    if (!canAssignRole(req.user.role, role)) {
      return res.status(403).json({
        success: false,
        error: `You are not allowed to assign the role '${role}'.`,
      });
    }

    const now = new Date().toISOString();

    // Use unified upsertUser service
    const result = await upsertUser(
      email,
      role,
      {
        name: String(fullName).slice(0, 200),
        fullName: String(fullName).slice(0, 200),
        email,
        mobile: String(mobile || "").replace(/[^0-9+\-() ]/g, "").slice(0, 20),
        designation: String(designation || "").slice(0, 100),
        dateOfJoining: dateOfJoining || now,
      },
      {
        sendEmail: true,
        authProvider: 'email',
        createdBy: req.user.uid,
      }
    );

    res.status(result.isUpdate ? 200 : 201).json({
      success: true,
      user: {
        uid: result.uid,
        email: result.email,
        name: result.name,
        role: result.role,
      },
      isUpdate: result.isUpdate,
      scenario: result.scenario,
      message: result.message,
    });
  } catch (error) {
    console.error('[ADMIN_CREATE_USER_ERROR]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
