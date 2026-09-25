import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import {
  listWebhooks, createWebhook, setWebhookEnabled, deleteWebhook, listWebhookDeliveries,
} from '../controllers/webhooks.controller.js';

/**
 * E21-S04 — outbound webhooks.
 *
 * ADMIN ONLY. A subscription streams matter, payment and document events to an
 * arbitrary URL, so registering one is a data-egress decision — guarded on the
 * ROUTE, before any handler logic.
 */
const router = Router();

router.use(verifyToken);
const adminOnly = requireRole('admin');

router.get('/', adminOnly, listWebhooks);
router.post('/', adminOnly, createWebhook);
router.patch('/:id', adminOnly, setWebhookEnabled);
router.delete('/:id', adminOnly, deleteWebhook);
router.get('/:id/deliveries', adminOnly, listWebhookDeliveries);

export default router;
