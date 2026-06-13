import { db } from '../config/firebase.js';
import { VALID_ROLES, isValidRole, canAssignRole } from '../config/roles.js';
import { logger } from "../config/logger.js";
import {
  upsertUser,
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
    // limit/cursor validated+coerced by paginationSchema; role is a free filter.
    const { role, limit, cursor } = req.query;

    const roleFilter = role && isValidRole(role) ? role : null;
    let query = db.collection(COLLECTION);
    let data;
    let nextCursor;

    if (roleFilter) {
      // Filtering by role + orderBy('createdAt') would need a composite index
      // (role ASC, createdAt DESC). To avoid that dependency we filter in
      // Firestore and sort the result in memory. Fine at current scale; if the
      // filtered set grows large, add the composite index and order server-side.
      const snapshot = await query.where('role', '==', roleFilter).get();
      data = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
      // In-memory paging over the sorted set (cursor = last uid of prev page).
      if (cursor) {
        const idx = data.findIndex((u) => u.uid === cursor);
        if (idx >= 0) data = data.slice(idx + 1);
      }
      const hasMore = data.length > limit;
      data = data.slice(0, limit);
      nextCursor = hasMore && data.length ? data[data.length - 1].uid : null;
    } else {
      // No role filter: order + paginate in Firestore (single-field index only).
      // NOTE: orderBy('createdAt') silently DROPS docs lacking the field — every
      // user doc is guaranteed `createdAt` by the upsertUser write path + the
      // backfill-user-createdat.js migration. If a legacy doc ever lacks it,
      // run that backfill rather than removing the orderBy.
      query = query.orderBy('createdAt', 'desc').limit(limit);
      if (cursor) {
        const cursorDoc = await db.collection(COLLECTION).doc(cursor).get();
        if (cursorDoc.exists) query = query.startAfter(cursorDoc);
      }
      const snapshot = await query.get();
      data = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      nextCursor = snapshot.docs.length === limit
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;
    }

    res.status(200).json({ data, nextCursor });
  } catch (error) {
    logger.error({ err: error }, 'Error listing users:');
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= USER COUNTS ================= */
// GET /api/portal/users/counts → { all, admin, manager, team_member, client }
// Uses Firestore count() aggregation: one cheap query per group, no doc reads,
// accurate at any scale (powers the role tabs without fetching all users).
export const getUserCounts = async (req, res) => {
  try {
    const base = db.collection(COLLECTION);
    const groups = ['all', ...VALID_ROLES];

    const results = await Promise.all(
      groups.map((g) => {
        const q = g === 'all' ? base : base.where('role', '==', g);
        return q.count().get().then((snap) => [g, snap.data().count]);
      })
    );

    res.status(200).json(Object.fromEntries(results));
  } catch (error) {
    logger.error({ err: error }, 'Error counting users:');
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
    logger.error({ err: error }, 'Error fetching user:');
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= CREATE / UPSERT USER ================= */
// POST /api/portal/users  — body includes role + all profile fields
export const createUser = async (req, res) => {
  try {
    const adminUid = req.user?.uid || 'admin';
    // Body shape, required fields, role enum, and formats are guaranteed by
    // createUserSchema (validate middleware). Only authorization remains here.
    const {
      name, email, phone, role,
      designation, joiningDate, fathersName, dateOfBirth, address,
      organisation, businessName, gstNumber, panNumber, aadhaarNumber, state, emailIds,
    } = req.body;

    // Privilege guard: a manager cannot create admin/manager accounts (escalation).
    if (!canAssignRole(req.user?.role, role)) {
      return res.status(403).json({ message: `You are not allowed to assign the role '${role}'.` });
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
    logger.error({ err: error }, 'Error creating user:');
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

    // Sync the Firebase custom claim only when a role was actually (and
    // legitimately) written. `role` itself is already persisted in `updates`.
    if (writableRole) {
      const { admin } = await import('../config/firebase.js');
      try {
        await admin.auth().setCustomUserClaims(uid, { role: writableRole });
      } catch (e) {
        logger.warn({ err: e }, `[updateUser] Could not set claims for ${uid}:`);
      }
    }

    res.status(200).json({ uid, message: 'User updated successfully', roleChanged: !!role && role !== current.role });
  } catch (error) {
    logger.error({ err: error }, 'Error updating user:');
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

    // Guard: refuse to delete a user who still has tasks (as client or assignee).
    // Deleting would orphan task history / leave dangling refs. The admin must
    // reassign or close those tasks first. (count() = cheap aggregation, no reads.)
    const [asClient, asAssignee] = await Promise.all([
      db.collection('tasks').where('clientUid', '==', uid).count().get(),
      db.collection('tasks').where('assignedTo', '==', uid).count().get(),
    ]);
    const taskCount = asClient.data().count + asAssignee.data().count;
    if (taskCount > 0) {
      return res.status(409).json({
        message: `This user has ${taskCount} associated task(s). Reassign or close them before deleting.`,
        taskCount,
      });
    }

    // No tasks → safe to delete the user, their Auth account, and the
    // payments subcollection (handled inside deleteUser).
    const result = await deleteUser(uid);
    res.status(200).json({ message: 'User deleted successfully', ...result });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting user:');
    res.status(500).json({ message: "Internal server error" });
  }
};
