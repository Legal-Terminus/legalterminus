import { z } from 'zod';

/**
 * E29-S08 — body of POST /api/auth/me/deletion-request. Only an optional reason;
 * `.strict()` refuses anything else, so the request can never name another account
 * (the account is the verified token's, always).
 */
export const deletionRequestSchema = z.object({
  reason: z.string().trim().max(500).optional(),
}).strict();
