import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireSection } from '../services/reportingAccess.service.js';
import { leadCreateSchema, leadUpdateSchema } from '../schemas/content.schema.js';
import {
  getContactLeadsReport,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToClient,
} from '../controllers/leads.controller.js';

const router = Router();

// All lead-management routes require auth and an internal staff role, then
// #196: the admin's grant for the Leads section — edit, view, or nothing.
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

router.get('/', requireSection('leads', 'view'), getContactLeadsReport);                       // list (enriched)
router.post('/', requireSection('leads', 'edit'), validate(leadCreateSchema), createLead);     // add a lead manually
router.patch('/:id', requireSection('leads', 'edit'), validate(leadUpdateSchema), updateLead); // update fields
// Convert to a client account — creates/links a user, so admin/manager only,
// and only one who may edit leads.
router.post('/:id/convert', requireRole('admin', 'manager'), requireSection('leads', 'edit'), convertLeadToClient);
router.delete('/:id', requireSection('leads', 'edit'), deleteLead);                            // delete a lead

export default router;
