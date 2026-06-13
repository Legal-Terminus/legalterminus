import crypto from 'crypto';
import { db, admin } from '../config/firebase.js';
import { logger } from "../config/logger.js";

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

// Cryptographically-strong throwaway password for server-created accounts. The
// user never sees or uses this — they set their own via the password-reset flow —
// so it only needs to be unguessable, not memorable.
const generateTempPassword = () => crypto.randomBytes(24).toString('base64url');

/**
 * Unified User UPSERT Service
 * Handles creation and updates for all user types (team_member, client, admin, manager)
 * Supports multiple authentication methods (email, Google)
 * Implements account merging on email conflict
 */

/**
 * UPSERT a user (create or update)
 * 
 * Flow:
 * 1. Check if email exists in Firebase Auth
 * 2. Check if email exists in Firestore (for Google-only users)
 * 3. If exists → UPDATE (merge auth providers, preserve/update role)
 * 4. If new → CREATE Firebase account + Firestore document
 * 5. Set custom claims with role
 * 6. Optionally send password reset email
 * 
 * @param {string} email - User email
 * @param {string} role - User role (team_member, client, admin, manager)
 * @param {object} profileData - Profile data { name, phone, address, ... }
 * @param {object} options - { sendEmail: true, authProvider: 'email|google', createdBy: uid }
 * @returns {object} { uid, email, role, isUpdate, scenario, message }
 */
/**
 * Normalize name/phone aliases to canonical fields. The `users` collection has
 * historically been written with either `name`/`fullName` and `phone`/`mobile`
 * depending on the entry path (self-signup vs portal form). This makes `name`
 * and `phone` canonical while mirroring the legacy aliases so any older reader
 * still works. Applied on EVERY upsert so no new inconsistency is created.
 */
export const normalizeUserProfile = (profile = {}) => {
  const out = { ...profile };
  const name = (out.name ?? out.fullName ?? '').toString().trim();
  const phone = (out.phone ?? out.mobile ?? '').toString().trim();
  if (name) { out.name = name; out.fullName = name; }
  if (phone) { out.phone = phone; out.mobile = phone; }
  return out;
};

export const upsertUser = async (email, role, profileData, options = {}) => {
  const {
    sendEmail = true,
    authProvider = 'email',
    createdBy = 'admin',
  } = options;

  // Canonicalise name/phone before any Firestore write.
  profileData = normalizeUserProfile(profileData);

  try {
    const now = new Date().toISOString();
    let userRecord = null;
    let existingFirestoreUser = null;

    // ===== 1. Check Firebase Auth by email =====
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      logger.info(`[UPSERT] Firebase Auth found for ${email}`);
    } catch (authError) {
      // User doesn't exist in Firebase Auth
      logger.info(`[UPSERT] No Firebase Auth for ${email}, checking Firestore...`);
    }

    // ===== 2. Check Firestore by email (for users who signed in via Google only) =====
    if (!userRecord) {
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        existingFirestoreUser = { uid: doc.id, ...doc.data() };
        userRecord = { uid: doc.id }; // Placeholder for update logic
        logger.info(`[UPSERT] Firestore user found for ${email}`);
      }
    } else if (userRecord) {
      // Fetch existing Firestore doc if Firebase user exists
      try {
        const doc = await db.collection('users').doc(userRecord.uid).get();
        if (doc.exists) {
          existingFirestoreUser = { uid: userRecord.uid, ...doc.data() };
        }
      } catch (e) {
        logger.info(`[UPSERT] No Firestore doc yet for Firebase user ${email}`);
      }
    }

    // ===== 3. USER EXISTS → UPDATE (MERGE) =====
    if (userRecord) {
      const uid = userRecord.uid || existingFirestoreUser?.uid;
      logger.info(`[UPSERT] User exists (${uid}). Merging: role=${role}, provider=${authProvider}`);

      // Derive existing providers from Firestore doc if available; otherwise
      // inspect the Firebase Auth record's providerData so we don't incorrectly
      // seed ['email'] for a user who only ever signed in via Google.
      const existingAuthProviders =
        existingFirestoreUser?.authProviders ||
        (userRecord.providerData?.map((p) => p.providerId === 'password' ? 'email' : p.providerId.replace('.com', '')) ?? []);
      const updatedAuthProviders = Array.from(
        new Set([...existingAuthProviders, authProvider])
      );

      // Determine signInMethod
      const signInMethod =
        updatedAuthProviders.length > 1
          ? 'both'
          : updatedAuthProviders[0];

      // Build Firestore update — include createdAt only when no Firestore doc existed yet
      const updates = {
        ...profileData, // name, phone, address, designation, etc.
        email,
        role, // `role` is the single source of truth (legacy `type` mirror removed)
        status: 'active',
        updatedAt: now,
        updatedBy: createdBy,
        ...(!existingFirestoreUser && { createdAt: now, createdBy }),

        // Auth tracking
        authProviders: updatedAuthProviders,
        signInMethod,
      };

      await db.collection('users').doc(uid).set(clean(updates), { merge: true });

      // Set custom claims — may fail if the UID has no Firebase Auth account yet
      // (e.g. Google-only user whose Auth record hasn't been resolved). Non-fatal:
      // claims will be set correctly on their next login.
      try {
        await admin.auth().setCustomUserClaims(uid, { role });
      } catch (claimsErr) {
        logger.warn({ err: claimsErr }, `[UPSERT] Could not set claims for ${uid} (no Auth record yet):`);
      }

      // Send password reset email only if:
      // - sendEmail is true
      // - AND email auth is new to this user
      // - AND email provider was just added
      if (
        sendEmail &&
        authProvider === 'email' &&
        !existingAuthProviders.includes('email')
      ) {
        try {
          await admin.auth().generatePasswordResetLink(email);
          logger.info(`[EMAIL] Password reset link generated for ${email} (delivery not yet implemented)`);
          // TODO: send via SendGrid.
        } catch (e) {
          logger.warn({ err: e }, `[EMAIL] Could not generate password reset for ${email}:`);
        }
      }

      return {
        uid,
        email,
        name: profileData.name,
        role,
        isUpdate: true,
        scenario: existingFirestoreUser ? 'merge_existing' : 'create_from_auth',
        message:
          role !== existingFirestoreUser?.role
            ? `Role updated to ${role}. Changes will take effect on next login.`
            : `Profile updated. Auth provider ${authProvider} linked.`,
      };
    }

    // ===== 4. NEW USER → CREATE =====
    logger.info(`[CREATE] New user: ${email}, role=${role}, provider=${authProvider}`);

    // Create Firebase Auth account
    const newUserRecord = await admin.auth().createUser({
      email,
      password: generateTempPassword(), // throwaway — user sets their own via reset email
    });

    const newUid = newUserRecord.uid;

    // Create Firestore document
    const firestoreData = {
      uid: newUid,
      email,
      ...profileData, // name, phone, address, designation, etc.
      role, // single source of truth (legacy `type` mirror removed)
      status: 'active',

      // Authentication tracking
      authProviders: [authProvider],
      signInMethod: authProvider,

      // Audit
      createdAt: now,
      updatedAt: now,
      createdBy,
    };

    await db.collection('users').doc(newUid).set(clean(firestoreData));

    // Set custom claims
    await admin.auth().setCustomUserClaims(newUid, { role });

    // Generate a password-reset link so the new user can set their own password.
    // NOTE: email delivery (SendGrid) is not yet wired up, so the link is only
    // generated/logged — it is NOT emailed to the user. Do not claim otherwise.
    let resetEmailSent = false;
    if (sendEmail && authProvider === 'email') {
      try {
        await admin.auth().generatePasswordResetLink(email);
        logger.info(`[EMAIL] Password reset link generated for ${email} (delivery not yet implemented)`);
        // TODO: send via SendGrid, then set resetEmailSent = true on success.
      } catch (e) {
        logger.warn({ err: e }, `[EMAIL] Could not generate password reset for ${email}:`);
      }
    }

    return {
      uid: newUid,
      email,
      name: profileData.name,
      role,
      isUpdate: false,
      scenario: 'new_user',
      resetEmailSent,
      message: resetEmailSent
        ? `${role} created. Password reset email sent.`
        : `${role} created. Ask them to use "Forgot password" to set their password.`,
    };
  } catch (error) {
    logger.error({ err: error }, '[UPSERT] Error:');
    throw error;
  }
};

/**
 * Validate required profile fields
 * @param {object} data - Profile data to validate
 * @param {array} requiredFields - Required field names
 * @returns {object} { valid: boolean, missing: array }
 */
export const validateProfileData = (data, requiredFields = []) => {
  const missing = requiredFields.filter(
    (field) => !data[field] || data[field].toString().trim() === ''
  );
  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Check if email is already in use
 * @param {string} email - Email to check
 * @returns {boolean} true if email exists, false otherwise
 */
export const emailExists = async (email) => {
  try {
    await admin.auth().getUserByEmail(email);
    return true;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Also check Firestore
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      return !snapshot.empty;
    }
    throw error;
  }
};

/**
 * Get user by UID
 * @param {string} uid - User UID
 * @returns {object} User document
 */
export const getUserByUid = async (uid) => {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() };
  } catch (error) {
    logger.error({ err: error }, `[getUserByUid] Error fetching ${uid}:`);
    throw error;
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {object} User document
 */
export const getUserByEmail = async (email) => {
  try {
    const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() };
  } catch (error) {
    logger.error({ err: error }, `[getUserByEmail] Error fetching ${email}:`);
    throw error;
  }
};

/**
 * Update user role and custom claims
 * @param {string} uid - User UID
 * @param {string} newRole - New role
 * @returns {object} Updated user
 */
export const updateUserRole = async (uid, newRole) => {
  try {
    const now = new Date().toISOString();

    // Update Firestore
    await db.collection('users').doc(uid).update({
      role: newRole,
      updatedAt: now,
    });

    // Update custom claims
    await admin.auth().setCustomUserClaims(uid, { role: newRole });

    logger.info(`[updateUserRole] ${uid} → ${newRole}`);

    return { uid, role: newRole, updated: true };
  } catch (error) {
    logger.error({ err: error }, `[updateUserRole] Error for ${uid}:`);
    throw error;
  }
};

/**
 * Delete user (both Firebase Auth and Firestore)
 * @param {string} uid - User UID
 * @returns {object} { deleted: true }
 */
export const deleteUser = async (uid) => {
  try {
    // Delete Firebase Auth account
    await admin.auth().deleteUser(uid);

    // Delete Firestore document
    await db.collection('users').doc(uid).delete();

    logger.info(`[deleteUser] User ${uid} deleted`);
    return { deleted: true };
  } catch (error) {
    logger.error({ err: error }, `[deleteUser] Error for ${uid}:`);
    throw error;
  }
};
