import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { verifyEmailTransport } from '../services/emailService.js';

const router = Router();

/**
 * Admin-only diagnostics for the DEPLOYED environment.
 *
 * GET /api/health/email — verifies the Gmail SMTP connection + App-Password auth
 * (nodemailer transporter.verify) WITHOUT sending an email, and reports the
 * resolved From address. Lets an admin confirm email works on QA/prod without
 * triggering a real user action or reading logs. Returns 200 when verified, 503
 * when email is unconfigured or verification fails (so it can gate a smoke check).
 */
router.get('/email', verifyToken, requireRole('admin'), async (req, res) => {
  const result = await verifyEmailTransport();
  const ok = result.enabled && result.verified;
  res.status(ok ? 200 : 503).json({ ok, ...result });
});

export default router;
