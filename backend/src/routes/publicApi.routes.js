import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyApiToken, requireScope } from '../middleware/apiToken.middleware.js';
import {
  listMatters, getMatter, listMatterDocuments, listClients,
} from '../controllers/publicApi.controller.js';
import { createMatterViaApi, createClientViaApi } from '../controllers/publicApiWrite.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema } from '../schemas/task.schema.js';

/**
 * E21-S02/S03 — the public API, versioned from day one.
 *
 * `/api/v1` accepts ONLY API keys; every other route accepts only Firebase ID
 * tokens. The separation is STRUCTURAL rather than a branch inside the shared
 * auth middleware, so a bug in one cannot let a credential cross into the
 * other — and a key-holder, who has no role and no seat, can never reach a
 * session route.
 *
 * Reads shipped before writes, and the write scopes are separate: a leaked
 * read-only key — the common case for an integration — cannot change anything.
 */
const router = Router();

// The same kill-switch the rest of the server uses: real limits in production,
// effectively unlimited under e2e so a test run is not throttled.
const isE2E = String(process.env.EMAIL_DISABLED ?? '').toLowerCase() === 'true'
  || String(process.env.E2E ?? '').toLowerCase() === 'true';

const tokenRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: isE2E ? 100_000 : 120,
  standardHeaders: true,
  legacyHeaders: false,
  // Keyed by the TOKEN, not the IP: one noisy integration must not throttle
  // another, and a key cannot dodge its limit by moving hosts.
  keyGenerator: (req) => `token:${req.user?.tokenId ?? req.ip}`,
  handler: (req, res) => {
    res.status(429).json({
      error: 'rate_limited',
      message: 'This API key has exceeded 120 requests per minute. Retry shortly.',
    });
  },
});

// Auth FIRST, so the rate limit can key on the token.
router.use(verifyApiToken);
router.use(tokenRateLimit);

router.get('/matters', requireScope('read:matters'), listMatters);
router.get('/matters/:id', requireScope('read:matters'), getMatter);
router.get('/matters/:id/documents', requireScope('read:documents_meta'), listMatterDocuments);
router.get('/clients', requireScope('read:clients'), listClients);

// Writes. The matter body is validated by the SAME schema the UI uses, so an
// API-created matter cannot take a shape the product would refuse.
router.post('/matters', requireScope('write:matters'), validate(taskCreateSchema), createMatterViaApi);
router.post('/clients', requireScope('write:clients'), createClientViaApi);

export default router;
