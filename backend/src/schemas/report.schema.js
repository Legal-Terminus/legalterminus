import { z } from 'zod';

/**
 * GET /api/reports/client-group-fees (LT #206). Every filter is optional; an
 * absent financial year means the current one.
 */
export const clientGroupFeesQuerySchema = z.object({
  fy: z.string().trim().regex(/^\d{4}-\d{2}$/, 'Financial year must look like 2026-27').optional(),
  group: z.string().trim().max(200).optional(),
  clientUid: z.string().trim().max(128).optional(),
  serviceKey: z.string().trim().max(100).optional(),
}).strip();
