import { z } from 'zod';

/**
 * #313 — invoices on a matter's Payments tab. Only the upload request carries a
 * body; confirm, download and delete are addressed by path alone.
 */

// POST /api/tasks/:taskId/invoices/signed-upload-url
export const invoiceUploadUrlSchema = z.object({
  fileName: z.string().trim().min(1).max(200),
  // Invoices are PDF only; the type is pinned into the signed URL as well.
  contentType: z.literal('application/pdf', { error: 'Only PDF invoices can be uploaded.' }),
  // Replace an existing invoice: it is removed once the new one is confirmed.
  replaces: z.string().regex(/^[a-f0-9]{32}$/, 'Invalid invoice id').optional(),
}).strict();

// POST /api/tasks/:taskId/invoices/:invoiceId/confirm
export const invoiceConfirmSchema = z.object({
  uploaded: z.boolean().optional(),
}).strict();
