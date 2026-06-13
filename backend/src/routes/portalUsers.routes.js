import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import { paginationSchema } from '../schemas/common.schema.js';
import {
  listUsers,
  getUserCounts,
  getUser,
  createUser,
  updateUser,
  removeUser,
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

// Delete: admin only (manager cannot delete — BMAD E09-S01/S02).
router.delete('/:uid', requireRole('admin'), removeUser);

export default router;
