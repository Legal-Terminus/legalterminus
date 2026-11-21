import { z } from 'zod';
import { stripTags } from '../utils/sanitize.js';

/**
 * #222 — additional payment requests on a matter (government fees and the like).
 *
 * The page sends the fee LINES only. There is deliberately no `total` field:
 * the server adds the lines up itself, and `.strict()` refuses a request that
 * carries a total (or anything else) of its own, so a tampered page cannot ask
 * the client for a figure that is not the sum of what it lists.
 */

/** Plain text: tags stripped, whitespace trimmed. Fee names land in emails. */
const text = (max) => z.string().transform((s) => stripTags(s).trim()).pipe(z.string().max(max));

/** Rupees, positive, at most two decimals (paise), at most ₹1 crore a line. */
const rupees = z.number().finite().positive().max(10_000_000)
  .refine((n) => Math.abs(Math.round(n * 100) - n * 100) < 1e-6, 'Use at most two decimal places');

export const MAX_FEE_LINES = 20;

export const feeLineSchema = z.object({
  name: text(120).pipe(z.string().min(1, 'Each fee needs a name')),
  description: text(500).optional(),
  amount: rupees,
}).strict();

/** POST /api/tasks/:taskId/payment-requests — staff raise and send a request. */
export const paymentRequestCreateSchema = z.object({
  lines: z.array(feeLineSchema).min(1, 'Add at least one fee').max(MAX_FEE_LINES),
  note: text(1000).optional(),
}).strict();

/** POST /api/tasks/:taskId/payment-requests/:requestId/cancel — admin, manager. */
export const paymentRequestCancelSchema = z.object({
  reason: text(300).optional(),
}).strict();

/**
 * POST /api/tasks/:taskId/payment-requests/:requestId/record — admin, manager:
 * the client paid the request some other way (bank transfer, cash). The amount
 * is the request's own total; only how and when it was paid is sent.
 */
export const paymentRequestRecordSchema = z.object({
  mode: z.string().trim().min(1).max(60),
  paidAt: z.string().trim().max(40).optional(),
  reference: text(200).optional(),
}).strict();

/**
 * POST /api/tasks/:taskId/payment-requests/:requestId/pay — the CLIENT starts
 * paying the request online. Takes nothing: the amount is the request's.
 */
export const paymentRequestPaySchema = z.object({}).strict();
