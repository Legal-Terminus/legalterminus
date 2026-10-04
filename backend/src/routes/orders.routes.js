import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { paginationSchema } from '../schemas/common.schema.js';
import {
  createOrderSchema, failOrderSchema, simulateSchema, verifyOrderSchema,
} from '../schemas/order.schema.js';
import {
  getOrderById, getOrders, getPaymentConfig, postFailed, postOrder, postReconcile,
  postRetryMatter, postSimulate, postVerify, postWebhook,
} from '../controllers/orders.controller.js';

/**
 * /api/orders — website orders and their payment (E24-S02 … S05).
 *
 *   GET  /config                  public   is online payment on?
 *   POST /webhook                 public   the gateway's signed message (signature = its authentication)
 *   POST /                        signed in   start an order — the server sets the amount
 *   GET  /:orderId                owner or staff
 *   POST /:orderId/verify         owner    the signed result from the checkout
 *   POST /:orderId/failed         owner    cancelled or declined
 *   POST /:orderId/simulate       owner    TEST ENVIRONMENTS ONLY (404 elsewhere)
 *   GET  /                        admin, manager   every order
 *   POST /:orderId/retry-matter   admin, manager
 *   POST /:orderId/reconcile      admin, manager
 *
 * Mounted OUTSIDE /api/payment on purpose: that prefix carries a 20-per-15-min
 * limit meant for sign-in style endpoints, which a result page polling its
 * order would exhaust.
 */
const router = Router();

const isE2E = String(process.env.EMAIL_DISABLED ?? '').toLowerCase() === 'true' || process.env.NODE_ENV === 'test';

/** Starting an order creates one at the gateway — keep a script from minting thousands. */
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isE2E ? 100_000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.get('/config', getPaymentConfig);
router.post('/webhook', postWebhook);

router.use(verifyToken);
router.post('/', createLimiter, validate(createOrderSchema), postOrder);
router.get('/', requireRole('admin', 'manager'), validate(paginationSchema, 'query'), getOrders);
router.get('/:orderId', getOrderById);
router.post('/:orderId/verify', validate(verifyOrderSchema), postVerify);
router.post('/:orderId/failed', validate(failOrderSchema), postFailed);
router.post('/:orderId/simulate', validate(simulateSchema), postSimulate);
router.post('/:orderId/retry-matter', requireRole('admin', 'manager'), postRetryMatter);
router.post('/:orderId/reconcile', requireRole('admin', 'manager'), postReconcile);

export default router;
