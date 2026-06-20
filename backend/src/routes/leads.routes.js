import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { leadCreateSchema, leadUpdateSchema } from '../schemas/content.schema.js';
import {
  getContactLeadsReport,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToClient,
} from '../controllers/leads.controller.js';

const router = Router();

// All lead-management routes require auth and an internal staff role.
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

router.get('/', getContactLeadsReport);                       // list (enriched)
router.post('/', validate(leadCreateSchema), createLead);     // add a lead manually
router.patch('/:id', validate(leadUpdateSchema), updateLead); // update status / notes / fields
// Convert to a client account — creates/links a user, so admin/manager only.
router.post('/:id/convert', requireRole('admin', 'manager'), convertLeadToClient);
router.delete('/:id', deleteLead);                            // delete a lead

export default router;
