import { getIdToken } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { apiFetch } from './client';

/* #210 Trademark Reports / #217 Worksheets — one engine, one API. */

export type ModuleKey = 'trademark' | 'company' | 'gst_return';
export type FieldType = 'text' | 'longtext' | 'date' | 'number' | 'select' | 'computed' | 'image' | 'matter';
export type CellValue = string | number | null;

export interface WsColumn {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  hidden: boolean;
  builtIn: boolean;
  aliases: string[];
  /** #279: a secret cell (GST Pswd) — never in a list response; revealed on demand. */
  secret?: boolean;
}

export interface WsSheet {
  key: string;
  label: string;
  module: ModuleKey;
  book: string;
  columns: WsColumn[];
  recordKey: string[];
  recordKeyLabel: string;
  linkedServices: string[];
  memberships: { key: string; label: string }[];
  reminder: { field: string; milestones: number[] } | null;
  /** #280 / #279: the sheet starts with the firm's "Sl. No." (the row number). */
  serial: boolean;
  /** #279: rows also come from matters (the GST Return Filing sheet). */
  source: { kind: string } | null;
  /** #279: 'monthly' | 'quarterly' on the GST Return Filing sheets — drives the Return Period filter. */
  frequency?: 'monthly' | 'quarterly' | null;
}

export interface WsModule {
  module: { key: ModuleKey; label: string };
  sheets: WsSheet[];
  canEdit: boolean;
  canManageColumns: boolean;
  canDelete: boolean;
}

export interface WsRecord {
  id: string;
  sheets: string[];
  values: Record<string, CellValue>;
  images: Record<string, { v: string }>;
  /** #279: which secret cells hold a value (never the value itself). */
  secretsSet?: Record<string, boolean>;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MatterRef { label: string; status: string | null }

export interface WsPage {
  data: WsRecord[];
  matters: Record<string, MatterRef>;
  nextCursor: string | null;
}

const base = '/api/worksheets';
const sheetPath = (sheet: string) => `${base}/sheets/${encodeURIComponent(sheet)}`;

export const getWorksheetModule = (module: ModuleKey) => apiFetch<WsModule>(`${base}/modules/${module}`);

export const listWorksheetRecords = (sheet: string, cursor?: string | null, limit = 500) =>
  apiFetch<WsPage>(`${sheetPath(sheet)}/records?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);

export const createWorksheetRecord = (sheet: string, values: Record<string, CellValue>, sheets?: string[]) =>
  apiFetch<WsRecord>(`${sheetPath(sheet)}/records`, { method: 'POST', body: JSON.stringify({ values, ...(sheets ? { sheets } : {}) }) });

export const updateWorksheetRecord = (sheet: string, id: string, body: { values?: Record<string, CellValue>; sheets?: string[] }) =>
  apiFetch<WsRecord & { matters: Record<string, MatterRef> }>(`${sheetPath(sheet)}/records/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteWorksheetRecord = (sheet: string, id: string) =>
  apiFetch<{ id: string; deleted: true }>(`${sheetPath(sheet)}/records/${id}`, { method: 'DELETE' });

export interface ColumnEdit { key?: string; label: string; type?: FieldType; options?: string[]; hidden?: boolean }
export const putWorksheetColumns = (sheet: string, columns: ColumnEdit[], linkedServices?: string[]) =>
  apiFetch<WsSheet>(`${sheetPath(sheet)}/columns`, { method: 'PUT', body: JSON.stringify({ columns, ...(linkedServices ? { linkedServices } : {}) }) });

/** #280 / #279: replace one dropdown column's options (admin, manager, team member). */
export const putWorksheetOptions = (sheet: string, field: string, options: string[]) =>
  apiFetch<WsSheet>(`${sheetPath(sheet)}/options/${encodeURIComponent(field)}`, { method: 'PUT', body: JSON.stringify({ options }) });

export interface ImportColumn { index: number; header: string; key: string | null; label?: string; status: string; notShown?: boolean }
export interface ImportReport {
  columns: ImportColumn[];
  unknownColumns: string[];
  ignoredColumns: { header: string; reason: string }[];
  summary: { newRows: number; updatedRows: number; unchangedRows: number; keylessRows: number; duplicatesInFile: number; emptyRows: number };
  newKeys: string[];
  updatedKeys: string[];
  warnings: { row: number; column: string; message: string }[];
  applied: boolean;
}
export type ImportCell = string | number | boolean | null;
export const importWorksheetBatch = (sheet: string, body: { headers: ImportCell[]; rows: ImportCell[][]; startRow: number; apply: boolean }) =>
  apiFetch<ImportReport>(`${sheetPath(sheet)}/import`, { method: 'POST', body: JSON.stringify(body) });

export const searchWorksheetMatters = (sheet: string, q: string) =>
  apiFetch<{ data: { id: string; label: string; status: string | null }[]; linkedServices: string[] }>(
    `${sheetPath(sheet)}/matters?q=${encodeURIComponent(q)}`);

async function authHeader(): Promise<Record<string, string>> {
  return auth.currentUser ? { Authorization: `Bearer ${await getIdToken(auth.currentUser)}` } : {};
}
const apiBase = () => import.meta.env.VITE_API_BASE_URL ?? '';
const imagePath = (sheet: string, id: string, field: string) => `${sheetPath(sheet)}/records/${id}/images/${field}`;

/** Logos stream through the backend with the session's token — never a public or signed URL. */
export async function fetchWorksheetImage(sheet: string, id: string, field: string): Promise<Blob> {
  const res = await fetch(`${apiBase()}${imagePath(sheet, id, field)}`, { headers: await authHeader() });
  if (!res.ok) throw new Error('Could not load the image');
  return res.blob();
}

export async function uploadWorksheetImage(sheet: string, id: string, field: string, file: File): Promise<{ v: string }> {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<{ v: string }>(imagePath(sheet, id, field), { method: 'POST', body: form });
}

export const deleteWorksheetImage = (sheet: string, id: string, field: string) =>
  apiFetch<{ deleted: true }>(imagePath(sheet, id, field), { method: 'DELETE' });

/** #279: one row's secret (GST portal password), for staff; every call is audited server-side. */
export const revealWorksheetSecret = (sheet: string, id: string, field: string, purpose: 'view' | 'copy' | 'login') =>
  apiFetch<{ value: string; userId: string | null; loginUrl: string }>(
    `${sheetPath(sheet)}/records/${encodeURIComponent(id)}/secrets/${encodeURIComponent(field)}/reveal`,
    { method: 'POST', body: JSON.stringify({ purpose }) },
  );

