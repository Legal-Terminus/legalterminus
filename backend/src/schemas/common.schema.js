import { z } from "zod";

/**
 * Pagination query schema (limit + opaque cursor).
 *
 * - `limit`: 1..100, default 25 (coerced from the query string).
 * - `cursor`: optional opaque token — the doc id to start AFTER (from the
 *   previous page's `nextCursor`).
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(1500).optional(),
}).passthrough(); // allow other query params (e.g. role, status filters) through
