import { apiFetch } from './client';

/* #196/#197 — the Reporting module: section access, the DM/Cold Calling sheets
 * and the consolidated Reporting sheet. */

export type SectionKey = 'leads' | 'dm_cost' | 'dm_income' | 'cold_calling' | 'reporting';
export type AccessLevel = 'view' | 'edit' | null;
export interface SectionDef { key: SectionKey; label: string; editable: boolean }

export const getMyReportingAccess = () =>
  apiFetch<{ sections: SectionDef[]; levels: Record<SectionKey, AccessLevel> }>('/api/marketing/access/me');

export interface AccessTable {
  sections: SectionDef[];
  grants: Record<SectionKey, Record<string, 'view' | 'edit'>>;
  staff: { uid: string; name: string; role: string }[];
}
export const getReportingAccess = () => apiFetch<AccessTable>('/api/marketing/access');
export const putReportingAccess = (sections: AccessTable['grants']) =>
  apiFetch<{ grants: AccessTable['grants'] }>('/api/marketing/access', { method: 'PUT', body: JSON.stringify({ sections }) });

export type SheetKey = 'dm_cost' | 'dm_income' | 'cold_calling';
export interface SheetColumn { key: string; label: string; kind: 'money' | 'count'; hidden?: boolean }
export interface SheetGroup { key: string; label: string; totalLabel: string; columns: SheetColumn[] }
export interface SheetDef { key: SheetKey; label: string; grandTotalLabel: string; groups: SheetGroup[] }
export type DayValues = Record<string, Record<string, number>>;
export interface Totals { groupTotals: Record<string, number>; groupCounts: Record<string, number>; total: number; count: number }
export interface SheetView {
  sheet: SheetDef;
  month: string;
  rows: ({ date: string; values: DayValues } & Totals)[];
  monthTotal: { values: DayValues } & Totals;
  cumulative: { from: string; to: string; values: DayValues } & Totals;
  canEdit: boolean;
}

export const getSheet = (sheet: SheetKey, month: string) =>
  apiFetch<SheetView>(`/api/marketing/sheets/${sheet}?month=${month}`);
export const putSheetDay = (sheet: SheetKey, date: string, values: DayValues) =>
  apiFetch<{ date: string; values: DayValues } & Totals>(
    `/api/marketing/sheets/${sheet}/days/${date}`, { method: 'PUT', body: JSON.stringify({ values }) });
export const putSheetColumns = (sheet: SheetKey, groups: Record<string, { columns: SheetColumn[] }>) =>
  apiFetch<SheetDef>(`/api/marketing/sheets/${sheet}/columns`, { method: 'PUT', body: JSON.stringify({ groups }) });

export interface ReportingRow {
  month: string;
  spentGoogle: number; spentFb: number; spentBoth: number;
  incomeGoogle: number; incomeFb: number; incomeBoth: number;
  clientsGoogle: number; clientsFb: number; clientsTotal: number;
  cac: number | null; revenueToCost: number | null;
  coldCallingIncome: number; coldCallingClients: number; convertedLeads: number;
}
export const getReporting = (from: string, to: string) =>
  apiFetch<{ from: string; to: string; rows: ReportingRow[]; totals: ReportingRow }>(
    `/api/marketing/reporting?from=${from}&to=${to}`);
