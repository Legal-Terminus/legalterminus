import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updatePricingSchema } from '../schemas/pricing.schema.js';
import { getPricing, getPublicPricing, putPricing } from '../controllers/pricing.controller.js';

/**
 * Prices (E24-S01).
 *
 *   GET /api/public/pricing        public — the website's prices
 *   GET /api/pricing               admin, manager — the full catalogue
 *   PUT /api/pricing/:productKey   admin — change a product's prices
 *
 * The public route is a READ of information already printed on the website, so
 * it carries no token. It sits under the global rate limit, takes no input and
 * writes nothing.
 */
export const publicPricingRouter = Router();
publicPricingRouter.get('/', getPublicPricing);

const router = Router();
router.use(verifyToken);
router.get('/', requireRole('admin', 'manager'), getPricing);
router.put('/:productKey', requireRole('admin'), validate(updatePricingSchema), putPricing);
export default router;
