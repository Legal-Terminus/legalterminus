import { z } from 'zod';

const id = z.string().trim().min(1).max(100);

/**
 * POST /api/orders — what the customer is buying. Deliberately no
 * amount: the server looks the price up (E24-S01). `.strict()` so an `amount`
 * sent by an old or tampered page is refused, not silently ignored.
 */
export const createOrderSchema = z.object({
  productKey: id,
  planId: id,
  customer: z.object({
    name: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(20).regex(/^[0-9+\-() ]*$/, 'Invalid phone number').optional(),
    businessName: z.string().trim().max(200).optional(),
    state: z.string().trim().max(100).optional(),
  }).strict().optional(),
  // Honoured only by the simulated gateway (test environments).
  simulate: z.enum(['gateway_down']).optional(),
}).strict();

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
