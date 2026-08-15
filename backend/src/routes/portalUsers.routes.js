import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserSchema, updateUserSchema, reassignWorkSchema, clientLoginSchema } from '../schemas/user.schema.js';
import { paginationSchema } from '../schemas/common.schema.js';
import {
  listUsers,
  getUserCounts,
  getUser,
  createUser,
  updateUser,
  removeUser,
  reassignUserWork,
  listClientLogins,
  addClientLogin,
  removeClientLogin,
} from '../controllers/portalUsers.controller.js';

const router = Router();

// All user-management routes require authentication (BMAD architecture §3.5).
router.use(verifyToken);

// Read + create + edit: admin and manager.
// NOTE: /counts must be registered before /:uid so it isn't captured as a uid.
router.get('/',        requireRole('admin', 'manager'), validate(paginationSchema, 'query'), listUsers);
router.get('/counts',  requireRole('admin', 'manager'), getUserCounts);
router.get('/:uid',    requireRole('admin', 'manager'), getUser);
router.post('/',       requireRole('admin', 'manager'), validate(createUserSchema), createUser);
router.patch('/:uid',  requireRole('admin', 'manager'), validate(updateUserSchema), updateUser);

// Bulk reassign a user's work to another (E09-S04) — admin only.
router.post('/:uid/reassign', requireRole('admin'), validate(reassignWorkSchema), reassignUserWork);

// Delete: admin only (manager cannot delete — BMAD E09-S01/S02).
router.delete('/:uid', requireRole('admin'), removeUser);

// #166 — additional LOGINS for a client organisation. Each is a real Auth account
// with its own password and audit trail, linked to the primary client so it sees
// exactly the same matters. Admin/manager manage them; admin alone revokes.
router.get('/:uid/logins',            requireRole('admin', 'manager'), listClientLogins);
router.post('/:uid/logins',           requireRole('admin', 'manager'), validate(clientLoginSchema), addClientLogin);
router.delete('/:uid/logins/:loginUid', requireRole('admin'), removeClientLogin);

export default router;
