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
  getRevenueAnalytics,
  getTeamPerformance,
  getStorageReport,
  getMyServices,
} from '../controllers/reports.controller.js';

const router = Router();

router.use(verifyToken);

// #84: the client-facing report — a client sees only their OWN services/payments.
// Declared before the admin/manager gate so clients can reach it.
router.get('/my-services', requireRole('client', 'admin', 'manager'), getMyServices);

// All other report endpoints are internal — admin and manager only.
router.use(requireRole('admin', 'manager'));

router.get('/all-tasks',    getAllTasks);
router.get('/completed',    getCompletedTasks);
router.get('/pending',      getPendingTasks);
router.get('/sla',          getSlaReport);
router.get('/payment-overrides', getPaymentOverrides);
router.get('/professional-mapping', getProfessionalMapping);
router.get('/unassigned', getUnassignedTasks);
router.get('/master-sheet', getMasterSheet);
router.get('/revenue', getRevenueAnalytics);
router.get('/team-performance', getTeamPerformance);
router.get('/storage', getStorageReport);

export default router;
