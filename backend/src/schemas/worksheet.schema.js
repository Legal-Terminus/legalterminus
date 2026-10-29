import { z } from 'zod';

/* #210 / #217 — worksheet input validation. Shapes only: which columns exist
 * and what each may hold is checked against the sheet's definition in the
 * controller (worksheetEngine.cleanRecordValues), because columns are editable. */

const fieldKey = z.string().regex(/^[a-z0-9_]{1,40}$/, 'Invalid column');
const sheetKey = z.string().regex(/^[a-z0-9_]{1,40}$/, 'Invalid worksheet');
const cell = z.union([z.string().max(5000), z.number().finite(), z.null()]);

export const recordCreateSchema = z.object({
  values: z.record(fieldKey, cell).default({}),
  sheets: z.array(sheetKey).max(20).optional(),
}).strict();

export const recordPatchSchema = z.object({
  values: z.record(fieldKey, cell).optional(),
  sheets: z.array(sheetKey).min(1, 'A record must stay in at least one report').max(20).optional(),
}).strict();

export const columnsSchema = z.object({
  columns: z.array(z.object({
    key: fieldKey.optional(),
    label: z.string().max(80),
    type: z.enum(['text', 'longtext', 'date', 'number', 'select', 'image']).optional(),
    options: z.array(z.string().max(60)).max(40).optional(),
    hidden: z.boolean().optional(),
  }).strict()).min(1).max(80),
  linkedServices: z.array(z.string().max(80)).max(30).optional(),
}).strict();

// One batch of an Excel upload, parsed in the browser. Batches keep a request
// well inside the API's 1 MB body limit; the Portal sends the file in order.
const importCell = z.union([z.string().max(5000), z.number().finite(), z.boolean(), z.null()]);
export const importSchema = z.object({
  headers: z.array(z.union([z.string().max(300), z.number(), z.null()])).min(1).max(120),
  rows: z.array(z.array(importCell).max(120)).max(200),
  startRow: z.number().int().min(1).max(100000).default(2),
  apply: z.boolean().default(false),
}).strict();

export const recordListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(200),
  cursor: z.string().trim().min(1).max(500).optional(),
}).strip();

export const matterQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
}).strip();
