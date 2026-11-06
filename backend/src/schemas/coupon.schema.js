import { z } from 'zod';
import {
  CODE_PATTERN, DISCOUNT_TYPES, SCOPES, VALIDITIES,
} from '../services/coupons.js';

/**
 * Coupons (#256, #257, #260). Staff-only writes, so `.strict()`: a field this
 * schema does not name is refused.
 */
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.');
// Tags out, then any angle bracket left over: one pass alone lets a nested
// "<scr<script>ipt>" leave "<script>" behind (CodeQL js/incomplete-multi-character-sanitization).
const stripTags = (s) => s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');

/** The terms of a coupon — everything staff can set, except its code. */
const terms = {
  description: z.string().trim().max(200).transform(stripTags).optional(),
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: z.number().int('Enter a whole number.').positive('Enter a discount above 0.'),
  scope: z.enum(SCOPES),
  productKeys: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  minAmount: z.number().int('Enter the minimum in whole rupees.').positive('Enter a minimum above 0.').optional(),
  validity: z.enum(VALIDITIES),
  startDate: day.optional(),
  endDate: day.optional(),
  active: z.boolean().optional(),
};

const checkTerms = (v, ctx) => {
  if (v.discountType === 'percent' && v.discountValue > 100) {
    ctx.addIssue({ code: 'custom', message: 'A percentage discount can be at most 100%.', path: ['discountValue'] });
  }
  if (v.scope === 'services' && !(v.productKeys?.length)) {
    ctx.addIssue({ code: 'custom', message: 'Choose at least one service this code applies to.', path: ['productKeys'] });
  }
  if (v.scope === 'min_amount' && !v.minAmount) {
    ctx.addIssue({ code: 'custom', message: 'Enter the minimum order amount.', path: ['minAmount'] });
  }
  if (v.validity === 'period') {
    if (!v.startDate) ctx.addIssue({ code: 'custom', message: 'Choose the first day the code can be used.', path: ['startDate'] });
    if (!v.endDate) ctx.addIssue({ code: 'custom', message: 'Choose the last day the code can be used.', path: ['endDate'] });
    if (v.startDate && v.endDate && v.endDate < v.startDate) {
      ctx.addIssue({ code: 'custom', message: 'The last day cannot be before the first day.', path: ['endDate'] });
    }
  }
};

/** POST /api/coupons */
export const createCouponSchema = z.object({
  code: z.string().trim().toUpperCase()
    .regex(CODE_PATTERN, 'Use 3 to 30 letters, numbers or hyphens.'),
  ...terms,
}).strict().superRefine(checkTerms);

/** PUT /api/coupons/:code — the code itself never changes. */
export const updateCouponSchema = z.object(terms).strict().superRefine(checkTerms);

/** PATCH /api/coupons/:code — switch on or off. */
export const couponStatusSchema = z.object({ active: z.boolean() }).strict();

/** GET /api/coupons/redemptions — the report's filters. */
export const redemptionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(200).optional(),
  from: day.optional(),
  to: day.optional(),
  format: z.enum(['csv']).optional(),
}).strict();
