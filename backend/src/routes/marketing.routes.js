import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireSection } from '../services/reportingAccess.service.js';
import {
  dayValuesSchema, sheetColumnsSchema, accessSchema, monthQuerySchema, rangeQuerySchema,
} from '../schemas/marketing.schema.js';
import {
  getMyAccess, getAccess, putAccess, getSheet, putDay, deleteDay, putColumns, getReporting,
} from '../controllers/marketing.controller.js';

/**
 * #196/#197 — the Reporting module. Staff only at the door; each section is
 * then gated by the admin's grant table (requireSection), so a team member sees
 * exactly the sections an admin gave them — edit, view, or nothing.
 */
const router = Router();
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

// The caller's own levels (drives what the page offers).
router.get('/access/me', getMyAccess);
// The grant table itself — admin only.
router.get('/access', requireRole('admin'), getAccess);
router.put('/access', requireRole('admin'), validate(accessSchema), putAccess);

// A sheet's section key IS its sheet key (dm_cost, dm_income, cold_calling).
const sheetGuard = (need) => (req, res, next) => requireSection(req.params.sheet, need)(req, res, next);
router.get('/sheets/:sheet', validate(monthQuerySchema, 'query'), sheetGuard('view'), getSheet);
router.put('/sheets/:sheet/days/:date', validate(dayValuesSchema), sheetGuard('edit'), putDay);
router.delete('/sheets/:sheet/days/:date', sheetGuard('edit'), deleteDay);
router.put('/sheets/:sheet/columns', requireRole('admin'), validate(sheetColumnsSchema), putColumns);

router.get('/reporting', validate(rangeQuerySchema, 'query'), requireSection('reporting', 'view'), getReporting);

export default router;
