import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { listApiTokens, createApiToken, revokeApiToken } from '../controllers/apiTokens.controller.js';

/**
 * E21-S01 — API key management.
 *
 * ADMIN ONLY. A key can read (and, with write scopes, create) firm data without
 * a human present, so minting one is the most privileged thing in this product
 * short of changing roles. The guard is on the ROUTE, before any handler logic.
 *
 * These are ordinary session routes protected by a Firebase ID token — an API
 * key can never manage API keys.
 */
const router = Router();

router.use(verifyToken);
const adminOnly = requireRole('admin');

router.get('/', adminOnly, listApiTokens);
router.post('/', adminOnly, createApiToken);
router.delete('/:tokenId', adminOnly, revokeApiToken);

export default router;
