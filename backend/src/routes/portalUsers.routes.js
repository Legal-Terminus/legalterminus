import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  removeUser,
} from '../controllers/portalUsers.controller.js';

const router = Router();

// All user-management routes require authentication (BMAD architecture §3.5).
router.use(verifyToken);

// Read + create + edit: admin and manager.
router.get('/',        requireRole('admin', 'manager'), listUsers);
router.get('/:uid',    requireRole('admin', 'manager'), getUser);
router.post('/',       requireRole('admin', 'manager'), createUser);
router.patch('/:uid',  requireRole('admin', 'manager'), updateUser);

// Delete: admin only (manager cannot delete — BMAD E09-S01/S02).
router.delete('/:uid', requireRole('admin'), removeUser);

export default router;
