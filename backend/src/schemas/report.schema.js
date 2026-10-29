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

/* ── LT #216: Employee Performance ─────────────────────────────────────────── */

const isoInstant = z.string().trim().max(40)
  .refine((s) => Number.isFinite(Date.parse(s)), 'Must be a date and time');
// A blank picker value means "the whole team", not an invalid id.
const optionalUid = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().trim().max(128).regex(/^[A-Za-z0-9_-]+$/, 'Invalid team member').optional(),
);

/** GET /api/reports/team-performance — no range means today. */
export const teamPerformanceQuerySchema = z.object({
  from: isoInstant.optional(),
  to: isoInstant.optional(),
  uid: optionalUid,
  // Minutes EAST of UTC (IST = 330): where a "day" starts for the trend buckets.
  tz: z.coerce.number().int().min(-840).max(840).default(0),
  granularity: z.enum(['auto', 'day', 'week', 'month']).default('auto'),
}).strip();

/** GET /api/reports/team-performance/activity — one page of the activity feed. */
export const teamActivityQuerySchema = z.object({
  from: isoInstant,
  to: isoInstant,
  uid: optionalUid,
  // The last event of the previous page, by document path.
  cursor: z.string().trim().max(400)
    .regex(/^[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/events\/[A-Za-z0-9_-]+$/, 'Invalid cursor').optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
}).strip();
