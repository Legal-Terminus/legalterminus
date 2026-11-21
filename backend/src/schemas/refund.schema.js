import { z } from 'zod';
import { stripTags as stripMarkup } from '../utils/sanitize.js';

/**
 * #240 — the refund log. `.strict()` throughout: the PAYMENT amount and the
 * client are read from the matter or order on the server, so a request that
 * sends `paymentAmount`, `clientUid` or `clientName` is refused, not ignored.
 */
const stripTags = (s) => stripMarkup(s).trim();

export const refundStatusSchema = z.enum(['initiated', 'processing', 'credited', 'failed']);

const reason = z.string().trim().max(500).transform(stripTags)
  .refine((s) => s.length > 0, 'Enter the reason for the refund.');
const transactionId = z.string().trim().max(100).transform(stripTags);
/** A calendar date (YYYY-MM-DD), or a full ISO timestamp. */
const initiatedAt = z.string().trim().max(40)
  .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/, 'Enter the date the refund was initiated.')
  .refine((s) => !Number.isNaN(new Date(s).getTime()), 'Enter a valid date.');

/** POST /api/tasks/:taskId/refunds and POST /api/orders/:orderId/refunds */
export const refundCreateSchema = z.object({
  reason,
  refundAmount: z.number().positive('The refund amount must be more than zero.').max(1e9),
  initiatedAt,
  transactionId: transactionId.optional(),
  status: refundStatusSchema.default('initiated'),
}).strict();

/** PATCH …/refunds/:refundId — the status, set by hand, and the transaction id. */
export const refundUpdateSchema = z.object({
  status: refundStatusSchema.optional(),
  transactionId: transactionId.optional(),
}).strict().refine((b) => b.status !== undefined || b.transactionId !== undefined, {
  message: 'Nothing to change.',
});
