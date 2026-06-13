import { db } from '../config/firebase.js';
import { VALID_ROLES, isValidRole, canAssignRole } from '../config/roles.js';
import {
  upsertUser,
  validateProfileData,
  getUserByUid,
  deleteUser,
  normalizeUserProfile,
} from '../services/userService.js';

/**
 * Unified user-management controller (BMAD architecture §3.5).
 *
 * Single API surface for ALL user types — admin, manager, team_member, client.
 * All users live in the `users` collection; `role` is just a field. Replaces the
 * legacy split `/api/clients` + `/api/team-members` endpoints and the redundant
 * `clients` collection.
 */

const COLLECTION = 'users';

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

/* ================= LIST USERS ================= */
// GET /api/portal/users?role=client|team_member|manager|admin  (role optional)
export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = db.collection(COLLECTION);
    if (role && isValidRole(role)) {
      query = query.where('role', '==', role);
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    // Sort by createdAt desc in memory (avoids composite index need for the
    // optional role filter; revisit under the indexing TD task).
    users.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET SINGLE USER ================= */
// GET /api/portal/users/:uid
export const getUser = async (req, res) => {
  try {
    const user = await getUserByUid(req.params.uid);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= CREATE / UPSERT USER ================= */
// POST /api/portal/users  — body includes role + all profile fields
export const createUser = async (req, res) => {
  try {
    const adminUid = req.user?.uid || 'admin';
    const {
      name, email, phone, role,
      // team-member fields
      designation, joiningDate, fathersName, dateOfBirth, address,
      // client fields
      organisation, businessName, gstNumber, panNumber, aadhaarNumber, state, emailIds,
    } = req.body;

    if (!isValidRole(role)) {
      return res.status(400).json({ message: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }

    // Privilege guard: a manager cannot create admin/manager accounts (escalation).
    if (!canAssignRole(req.user?.role, role)) {
      return res.status(403).json({ message: `You are not allowed to assign the role '${role}'.` });
    }

    // Required fields depend on role.
    const required = role === 'client'
      ? ['name', 'email', 'phone']
      : ['name', 'email', 'phone', 'designation', 'role'];
    const validation = validateProfileData(req.body, required);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Missing required fields', missing: validation.missing });
    }

    // Build role-appropriate profile (clean() strips undefined for the other role's fields).
    const profileData = clean({
      name, email, phone,
      designation, joiningDate, fathersName, dateOfBirth, address,
      organisation, businessName, gstNumber, panNumber, aadhaarNumber, state,
      emailIds: role === 'client'
        ? (emailIds && emailIds.length > 0 ? emailIds : [email])
        : undefined,
    });

    const result = await upsertUser(email, role, profileData, {
      sendEmail: true,
      authProvider: 'email',
      createdBy: adminUid,
    });

    res.status(result.isUpdate ? 200 : 201).json({
      uid: result.uid,
      email: result.email,
      name: result.name,
      role: result.role,
      isUpdate: result.isUpdate,
      scenario: result.scenario,
      message: result.message,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= UPDATE USER ================= */
// PATCH /api/portal/users/:uid
export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const adminUid = req.user?.uid || 'admin';

    const current = await getUserByUid(uid);
    if (!current) return res.status(404).json({ message: 'User not found' });

    const {
      name, phone, role,
      designation, joiningDate, fathersName, dateOfBirth, address,
      organisation, businessName, gstNumber, panNumber, aadhaarNumber, state, emailIds,
    } = req.body;

    // Role is a privileged field: only admin may write it (BMAD E09-S03).
    // For any non-admin caller we drop `role` from the update entirely — it can
    // never be persisted from a non-admin request, regardless of what was sent.
    const roleChangeRequested = !!role && role !== current.role;
    if (roleChangeRequested && !canAssignRole(req.user?.role, role)) {
      return res.status(403).json({ message: `You are not allowed to assign the role '${role}'.` });
    }
    // Role is privileged: only persist it when the caller may assign it.
    const writableRole = roleChangeRequested && canAssignRole(req.user?.role, role) ? role : undefined;

    const updates = clean({
      // Canonicalise name/phone (mirrors fullName/mobile) so edits never reintroduce drift.
      ...normalizeUserProfile({ name, phone }),
      role: writableRole,
      designation, joiningDate, fathersName, dateOfBirth, address,
      organisation, businessName, gstNumber, panNumber, aadhaarNumber, state,
      emailIds: emailIds && emailIds.length > 0 ? emailIds : undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid,
    });

    await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });

    // Sync custom claims + type only when a role was actually (and legitimately) written.
    if (writableRole) {
      await db.collection(COLLECTION).doc(uid).set({ type: writableRole }, { merge: true });
      const { admin } = await import('../config/firebase.js');
      try {
        await admin.auth().setCustomUserClaims(uid, { role: writableRole });
      } catch (e) {
        console.warn(`[updateUser] Could not set claims for ${uid}:`, e.message);
      }
    }

    res.status(200).json({ uid, message: 'User updated successfully', roleChanged: !!role && role !== current.role });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= DELETE USER ================= */
// DELETE /api/portal/users/:uid  (admin only — enforced at route)
export const removeUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await getUserByUid(uid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await deleteUser(uid);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
