import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { listClients, getClient } from '../controllers/clients.controller.js';
import { listClientTags, addClientTag, renameClientTag, deleteClientTag } from '../controllers/clientTags.controller.js';

/**
 * E-19 — Client 360 (client monitoring).
 *
 * Admin + manager only: monitoring the client book is a management function, and
 * the guard lives on the ROUTE so an unauthorized request never reaches handler
 * logic. Read-only by design — every mutation the Client 360 offers belongs to a
 * matter and is performed there.
 */
const router = Router();

router.use(verifyToken);

const manage = requireRole('admin', 'manager');

// The managed tag list. MUST precede '/:uid' so 'tags' is not captured as a
// client id — Express matches in declaration order.
router.get('/tags', manage, listClientTags);
router.post('/tags', manage, addClientTag);
router.patch('/tags/:tag', manage, renameClientTag);
router.delete('/tags/:tag', manage, deleteClientTag);

router.get('/', manage, listClients);
router.get('/:uid', manage, getClient);

export default router;
