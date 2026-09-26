import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.middleware.js';
import { accountLinkRequestSchema } from '../schemas/account.schema.js';
import { requestPasswordReset, requestSignInLink } from '../controllers/accountLinks.controller.js';

/**
 * /api/public/account — the sign-in page's "forgot password" and "email me a
 * sign-in link" requests (#203). Unauthenticated by necessity: the person
 * cannot sign in, which is the whole point.
 *
 * Defended in depth:
 *   - a per-IP rate limit (below),
 *   - a Zod schema that `.strip()`s everything but `email`,
 *   - a fixed target — the link goes only to the address asked about,
 *   - a uniform answer — 202 { success: true } for a real account, an unknown
 *     address, a deactivated one or a rate-limited caller alike, so the
 *     endpoint cannot be used to discover who has an account.
 */

const router = Router();

const isE2E = String(process.env.EMAIL_DISABLED ?? '').toLowerCase() === 'true'
  || process.env.NODE_ENV === 'test';

/**
 * 5 requests per IP per 15 minutes, both endpoints together. Enough for a
 * mistyped address and a retry; too few to mail-bomb anyone. Per-instance
 * counters, as with the leads limiter.
 */
const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isE2E ? 1000 : 5,
  standardHeaders: false,
  legacyHeaders: false,
  // Same answer as success — see above.
  handler: (_req, res) => res.status(202).json({ success: true }),
});

router.post('/password-reset', requestLimiter, validate(accountLinkRequestSchema), requestPasswordReset);
router.post('/sign-in-link', requestLimiter, validate(accountLinkRequestSchema), requestSignInLink);

export default router;
