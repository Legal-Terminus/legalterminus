import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { paginationSchema } from '../schemas/common.schema.js';
import { COUPON_MANAGER_ROLES } from '../config/roles.js';
import {
  couponStatusSchema, createCouponSchema, redemptionQuerySchema, updateCouponSchema,
} from '../schemas/coupon.schema.js';
import {
  getCouponByCode, getCoupons, getRedemptions, patchCoupon, postCoupon, putCoupon, removeCoupon,
} from '../controllers/coupons.controller.js';

/**
 * /api/coupons — coupon codes and the Coupon & Discount report (#256, #257, #260).
 * Every route: signed in, and admin or manager (COUPON_MANAGER_ROLES).
 *
 *   GET    /                 the coupons, newest first, a page at a time
 *   GET    /redemptions      the report (?from&to as IST dates; ?format=csv)
 *   GET    /:code            one coupon
 *   POST   /                 create
 *   PUT    /:code            change its terms (the code never changes)
 *   PATCH  /:code            switch it on or off
 *   DELETE /:code            only a code nobody has used
 *
 * A customer never reaches these: they apply a code through POST /api/orders/quote.
 */
const router = Router();
router.use(verifyToken, requireRole(...COUPON_MANAGER_ROLES));

router.get('/', validate(paginationSchema, 'query'), getCoupons);
// MUST precede '/:code' so "redemptions" is not read as a code.
router.get('/redemptions', validate(redemptionQuerySchema, 'query'), getRedemptions);
router.get('/:code', getCouponByCode);
router.post('/', validate(createCouponSchema), postCoupon);
router.put('/:code', validate(updateCouponSchema), putCoupon);
router.patch('/:code', validate(couponStatusSchema), patchCoupon);
router.delete('/:code', removeCoupon);

export default router;
