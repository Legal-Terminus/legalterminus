import { z } from 'zod';
import { MAX_ORDER_ITEMS } from '../services/orderItems.js';

const id = z.string().trim().min(1).max(100);

/**
 * POST /api/orders — what the customer is buying. Deliberately no
 * amount: the server looks the price up (E24-S01). `.strict()` so an `amount`
 * sent by an old or tampered page is refused, not silently ignored.
 */
/**
 * #221: the answer to a product's question ("prior-user") — an id, never a
 * surcharge. Whether it is required, and whether it exists, is the catalogue's
 * call (`findPlan`), answered with a 400 in words.
 */
const optionId = z.string().trim().min(1).max(60).optional();

/** #244: one line of a cart — a plan, never a price. #221: and its answer, if asked. */
const orderItem = z.object({ productKey: id, planId: id, optionId }).strict();

/**
 * #256: a coupon code, as typed. Only its length is checked here: a code that
 * is badly formed is answered like any unknown code ("not valid"), by the
 * service, rather than with a validation error.
 */
const couponCode = z.string().trim().max(40).optional();

/** Either ONE plan or a cart — never both, never neither. */
const onePlanOrCart = (v, ctx) => {
  const single = v.productKey !== undefined || v.planId !== undefined || v.optionId !== undefined;
  if (v.items && single) {
    ctx.addIssue({ code: 'custom', message: 'Send either one plan or a list of items, not both.', path: ['items'] });
  } else if (!v.items && !(v.productKey && v.planId)) {
    ctx.addIssue({ code: 'custom', message: 'Choose a plan to buy.', path: v.productKey ? ['planId'] : ['productKey'] });
  }
  if (v.items && new Set(v.items.map((i) => i.productKey)).size !== v.items.length) {
    ctx.addIssue({ code: 'custom', message: 'Each service can be in an order only once.', path: ['items'] });
  }
};

/**
 * Either ONE plan (`productKey` + `planId`, as before) or a cart (`items`, 1 to
 * MAX_ORDER_ITEMS lines, one per service) — never both, never neither. #256:
 * optionally one coupon code. Still no amount: `.strict()` refuses one.
 */
export const createOrderSchema = z.object({
  productKey: id.optional(),
  planId: id.optional(),
  optionId,
  items: z.array(orderItem).min(1).max(MAX_ORDER_ITEMS).optional(),
  couponCode,
  customer: z.object({
    name: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(20).regex(/^[0-9+\-() ]*$/, 'Invalid phone number').optional(),
    businessName: z.string().trim().max(200).optional(),
    state: z.string().trim().max(100).optional(),
  }).strict().optional(),
  // Honoured only by the simulated gateway (test environments).
  simulate: z.enum(['gateway_down']).optional(),
}).strict().superRefine(onePlanOrCart);

/**
 * POST /api/orders/quote (#256) — what the checkout would charge, with a
 * coupon code if one is given. The same plans as an order; no amount.
 */
export const quoteOrderSchema = z.object({
  productKey: id.optional(),
  planId: id.optional(),
  optionId,
  items: z.array(orderItem).min(1).max(MAX_ORDER_ITEMS).optional(),
  couponCode,
}).strict().superRefine(onePlanOrCart);

/**
 * POST /api/tasks/:taskId/pay-now (#220) — pay what is due on a matter. Takes
 * NOTHING: the matter comes from the URL and the amount from the matter, so an
 * `amount` sent by a tampered page is refused.
 */
export const matterPayNowSchema = z.object({}).strict();

/** POST /api/orders/:orderId/verify — the signed result from the checkout. */
export const verifyOrderSchema = z.object({
  gatewayPaymentId: id,
  signature: z.string().trim().min(1).max(256),
}).strict();

/** POST /api/orders/:orderId/failed */
export const failOrderSchema = z.object({
  reason: z.string().trim().max(300).optional(),
}).strict();

/** POST /api/orders/:orderId/simulate — test environments only. */
export const simulateSchema = z.object({
  outcome: z.enum([
    'success',            // pays; returns the signed result for the browser to send to /verify
    'failure',            // declined; returns a reason for the browser to send to /failed
    'success_webhook',    // pays; the gateway tells us by webhook (the customer closed the tab)
    'duplicate_webhook',  // pays; the webhook arrives twice
    'amount_mismatch',    // pays a different amount; told by webhook
    'bad_signature',      // returns a result whose signature does not verify
    'paid_silently',      // pays at the gateway; nothing reaches us (for reconcile)
    'failed_webhook',     // declined; told by webhook
    'discard',            // removes the test order itself, so a test run leaves nothing behind
    'refund',             // refunds a paid order; told by webhook
  ]),
}).strict();
