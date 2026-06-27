import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import {
  getAllTasks,
  getCompletedTasks,
  getPendingTasks,
  getSlaReport,
  getPaymentOverrides,
  getProfessionalMapping,
  getUnassignedTasks,
  getMasterSheet,
} from '../controllers/reports.controller.js';

const router = Router();

// All report endpoints require auth; accessible by admin and manager
router.use(verifyToken, requireRole('admin', 'manager'));

router.get('/all-tasks',    getAllTasks);
router.get('/completed',    getCompletedTasks);
router.get('/pending',      getPendingTasks);
router.get('/sla',          getSlaReport);
router.get('/payment-overrides', getPaymentOverrides);
router.get('/professional-mapping', getProfessionalMapping);
router.get('/unassigned', getUnassignedTasks);
router.get('/master-sheet', getMasterSheet);

export default router;
