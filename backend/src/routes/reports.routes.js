import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { clientGroupFeesQuerySchema, teamPerformanceQuerySchema, teamActivityQuerySchema } from '../schemas/report.schema.js';
import { getTeamPerformanceReport, getTeamPerformanceActivity } from '../controllers/teamPerformance.controller.js';
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
  getStorageReport,
  getMyServices,
  getFirmWorkbook,
  getClientGroupFees,
} from '../controllers/reports.controller.js';

const router = Router();

router.use(verifyToken);

// #84: the client-facing report — a client sees only their OWN services/payments.
// Declared before the admin/manager gate so clients can reach it.
router.get('/my-services', requireRole('client', 'admin', 'manager'), getMyServices);

// The full-firm export is admin-only — every matter, client, document record
// and payment — so it is guarded ABOVE the manager-level reports below.
router.get('/workbook', requireRole('admin'), getFirmWorkbook);

// All other report endpoints are internal — admin and manager only.
// #206: works and fees per group / client — the firm's income by client, so
// admin-only like the workbook, and declared above the manager gate.
router.get('/client-group-fees', requireRole('admin'), validate(clientGroupFeesQuerySchema, 'query'), getClientGroupFees);

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
// LT #216: the Employee Performance report and its activity feed.
router.get('/team-performance', validate(teamPerformanceQuerySchema, 'query'), getTeamPerformanceReport);
router.get('/team-performance/activity', validate(teamActivityQuerySchema, 'query'), getTeamPerformanceActivity);
router.get('/storage', getStorageReport);

export default router;
