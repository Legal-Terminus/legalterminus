import { z } from 'zod';
import { email, phone, CONTACT_DESIGNATIONS } from './user.schema.js';

/**
 * LT #205 — PUT /api/client-database/:clientUid.
 *
 * The nine fields of a Client Database record. Every field is optional (a save
 * may send only what changed) and every field but the client name may be an
 * empty string, which clears it. Unknown fields are rejected (`.strict()`), so
 * nothing else on the client can be written through this route.
 */

/** Text with any HTML tags removed, trimmed and length-capped. */
const plain = (max) => z.string().max(max * 2)
  .transform((s) => s.replace(/<[^>]*>/g, '').trim())
  .pipe(z.string().max(max));

const orEmpty = (schema) => z.union([schema, z.literal('')]);

/** One or more addresses separated by commas, each a valid email. */
const emailList = z.string().trim().max(1000)
  .transform((s) => s.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean))
  .pipe(z.array(email).max(10))
  .transform((list) => list.join(', '));

/** A calendar date, YYYY-MM-DD, that actually exists. */
const dateOnly = z.string().trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date in the form YYYY-MM-DD')
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, 'Not a real date');

export const clientDatabaseUpdateSchema = z.object({
  clientName: plain(200).pipe(z.string().min(1, 'Client name is required')).optional(),
  contactPerson: plain(200).optional(),
  contactDesignation: orEmpty(z.enum(CONTACT_DESIGNATIONS)).optional(),
  phone: orEmpty(phone).optional(),
  altPhone: orEmpty(phone).optional(),
  email: orEmpty(email).optional(),
  altEmail: emailList.optional(),
  address: plain(500).optional(),
  clientSince: orEmpty(dateOnly).optional(),
}).strict();

/** GET /api/client-database — page + optional free-text search. */
export const clientDatabaseListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(128).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();
