import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { getEmailTemplatesSettings, putEmailTemplatesSettings } from '../controllers/settings.controller.js';

const router = Router();

// Admin-only app settings. Email templates edited from Settings → Email Templates.
router.get('/email-templates', verifyToken, requireRole('admin'), getEmailTemplatesSettings);
router.put('/email-templates', verifyToken, requireRole('admin'), putEmailTemplatesSettings);

export default router;
