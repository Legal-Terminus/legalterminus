import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { getEmailTemplatesSettings, putEmailTemplatesSettings } from '../controllers/settings.controller.js';
import { getStatutoryCalendar, putStatutoryOverride } from '../controllers/statutoryCalendar.controller.js';

const router = Router();

// Admin-only app settings. Email templates edited from Settings → Email Templates.
router.get('/email-templates', verifyToken, requireRole('admin'), getEmailTemplatesSettings);
router.put('/email-templates', verifyToken, requireRole('admin'), putEmailTemplatesSettings);

// The statutory calendar. READING is open to any staff member — the compliance
// calendar is a view of the firm's year and everyone benefits from it. EDITING
// is admin-only, because one edit moves every deadline anchored to that key,
// which is the feature's value and also its risk.
router.get('/statutory-calendar', verifyToken,
  requireRole('admin', 'manager', 'team_member'), getStatutoryCalendar);
router.put('/statutory-calendar/:key', verifyToken, requireRole('admin'), putStatutoryOverride);

export default router;
