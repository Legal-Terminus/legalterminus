import { z } from 'zod';

/* #196/#197 — Reporting module input validation. */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const isoMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');
const amount = z.number().min(0).max(1e10);

// One day's entries: { [group]: { [column]: number } }. Keys are validated
// against the sheet's columns in the controller.
export const dayValuesSchema = z.object({
  values: z.record(z.string().max(40), z.record(z.string().max(40), amount)),
}).strict();

export const sheetColumnsSchema = z.object({
  groups: z.record(z.string().max(20), z.object({
    columns: z.array(z.object({
      key: z.string().max(40).optional(),
      label: z.string().max(40),
      kind: z.enum(['money', 'count']).optional(),
      hidden: z.boolean().optional(),
    }).strict()).min(1).max(40),
  }).strict()),
}).strict();

export const accessSchema = z.object({
  sections: z.record(z.string().max(20), z.record(z.string().max(128), z.enum(['view', 'edit']))),
}).strict();

export const monthQuerySchema = z.object({ month: isoMonth.optional() }).strip();
export const rangeQuerySchema = z.object({ from: isoMonth.optional(), to: isoMonth.optional() }).strip();
export { isoDate };
