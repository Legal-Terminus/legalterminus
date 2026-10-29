import type { CellValue, ImportCell, MatterRef, WsColumn, WsRecord } from '../api/worksheets';

/* #210 / #217 — display, search and filter rules for the worksheet grid. */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** `2026-10-29` → `29 Oct 2026`; anything else unchanged (imported text stays readable). */
export function formatDate(v: CellValue): string {
  if (typeof v !== 'string' || !DATE_RE.test(v)) return v == null ? '' : String(v);
  return new Date(`${v}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** What a cell shows — also what search, filters and the Excel download use. */
export function displayValue(col: WsColumn, record: WsRecord, matters: Record<string, MatterRef>): string {
  const v = record.values[col.key];
  if (v == null || v === '') return '';
  if (col.type === 'date' || col.type === 'computed') return formatDate(v);
  if (col.type === 'number') return typeof v === 'number' ? inr.format(v) : String(v);
  if (col.type === 'matter') return matters[String(v)]?.label ?? String(v);
  return String(v);
}

/** The value sorting uses: dates sort as ISO, numbers as numbers, text case-insensitively. */
export function sortValue(col: WsColumn, record: WsRecord, matters: Record<string, MatterRef>): string | number {
  const v = record.values[col.key];
  if (v == null || v === '') return '';
  if (col.type === 'number' && typeof v === 'number') return v;
  if ((col.type === 'date' || col.type === 'computed') && typeof v === 'string' && DATE_RE.test(v)) return v;
  return displayValue(col, record, matters).toLowerCase();
}

/** Ctrl+F-style: case-insensitive "contains", on what the cell shows. */
export const matchesQuery = (text: string, q: string) => !!q && text.toLowerCase().includes(q.toLowerCase());

/** Split text around every occurrence of q, for highlighting. */
export function splitMatches(text: string, q: string): { text: string; hit: boolean }[] {
  if (!q) return [{ text, hit: false }];
  const out: { text: string; hit: boolean }[] = [];
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const at = lower.indexOf(needle, i);
    if (at < 0) { out.push({ text: text.slice(i), hit: false }); break; }
    if (at > i) out.push({ text: text.slice(i, at), hit: false });
    out.push({ text: text.slice(at, at + needle.length), hit: true });
    i = at + needle.length;
  }
  return out;
}

/* ── Column filters ─────────────────────────────────────────────────────── */

/** Text/select columns filter by ticked values; dates and numbers by a range. */
export type ColumnFilter =
  | { kind: 'values'; values: string[] }
  | { kind: 'range'; min?: string; max?: string };

export const BLANK = '(Blank)';

export const isRangeColumn = (col: WsColumn) => col.type === 'date' || col.type === 'computed' || col.type === 'number';

export function passesFilter(col: WsColumn, record: WsRecord, matters: Record<string, MatterRef>, f: ColumnFilter): boolean {
  if (f.kind === 'values') {
    if (!f.values.length) return true;
    const shown = displayValue(col, record, matters);
    return f.values.includes(shown === '' ? BLANK : shown);
  }
  const v = record.values[col.key];
  if (col.type === 'number') {
    const n = typeof v === 'number' ? v : Number.NaN;
    if (Number.isNaN(n)) return false;
    if (f.min !== undefined && f.min !== '' && n < Number(f.min)) return false;
    if (f.max !== undefined && f.max !== '' && n > Number(f.max)) return false;
    return true;
  }
  if (typeof v !== 'string' || !DATE_RE.test(v)) return false;
  if (f.min && v < f.min) return false;
  if (f.max && v > f.max) return false;
  return true;
}

/* ── Excel upload: reading the file in the browser ──────────────────────── */

export const IMPORT_BATCH = 200;
export const MAX_IMPORT_ROWS = 5000;

export interface ParsedSheet { headerRow: number; headers: ImportCell[]; rows: ImportCell[][] }

const nonEmpty = (row: ImportCell[]) => row.filter((c) => c != null && String(c).trim() !== '').length;

/**
 * The header row is the first of the first ten rows with at least two filled
 * cells (firms often put a title above the table). Rows below it are data;
 * fully empty rows are kept so the row numbers in warnings match Excel's.
 */
export function splitHeader(aoa: ImportCell[][]): ParsedSheet | null {
  const idx = aoa.slice(0, 10).findIndex((r) => nonEmpty(r ?? []) >= 2);
  if (idx < 0) return null;
  const headers = aoa[idx];
  const rows = aoa.slice(idx + 1).map((r) => headers.map((_, i) => normaliseCell(r?.[i])));
  // Trailing empty rows are dropped; inner ones stay for numbering.
  while (rows.length && nonEmpty(rows[rows.length - 1]) === 0) rows.pop();
  return { headerRow: idx + 1, headers, rows };
}

function normaliseCell(c: unknown): ImportCell {
  if (c == null) return null;
  if (typeof c === 'string' || typeof c === 'number' || typeof c === 'boolean') return c;
  if (c instanceof Date) return c.toISOString().slice(0, 10);
  return String(c);
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
