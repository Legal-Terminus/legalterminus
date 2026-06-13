import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import {
  getContactLeadsReport,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leads.controller.js';

const router = Router();

// All lead-management routes require auth and an internal staff role.
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

router.get('/', getContactLeadsReport);   // list (enriched)
router.post('/', createLead);             // add a lead manually
router.patch('/:id', updateLead);         // update status / notes / fields
router.delete('/:id', deleteLead);        // delete a lead

export default router;
