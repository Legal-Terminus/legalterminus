import type { LeadOutcome } from '../lib/leadFields';
import { apiFetch } from './client';
import { auth } from '../lib/firebase';
import { getIdToken } from 'firebase/auth';
import { shareBlobNative } from '../lib/native';
import type { Task, PaymentStatus } from '../types/task';

// ─── Shared filter shape ────────────────────────────────────────────────────
export interface ReportFilters {
  status?: string;
  serviceType?: string;
  teamMember?: string;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

/** The names in ReportFilters — the query-string keys a report page reads (#208). */
export const REPORT_FILTER_KEYS = ['status', 'serviceType', 'teamMember', 'paymentStatus', 'startDate', 'endDate'] as const;

function buildQuery(filters: ReportFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// ─── All Tasks report ───────────────────────────────────────────────────────
export const getAllTasksReport = (filters: ReportFilters = {}) =>
  apiFetch<Task[]>(`/api/reports/all-tasks${buildQuery(filters)}`);

// ─── Completed Tasks report ─────────────────────────────────────────────────
export const getCompletedTasksReport = (filters: ReportFilters = {}) =>
  apiFetch<Task[]>(`/api/reports/completed${buildQuery(filters)}`);

// ─── Pending Tasks report ───────────────────────────────────────────────────
export interface PendingTask extends Task {
  pendingReason: 'approval' | 'payment' | 'document' | 'client_action' | 'government';
}

export const getPendingTasksReport = (filters: ReportFilters = {}) =>
  apiFetch<PendingTask[]>(`/api/reports/pending${buildQuery(filters)}`);

// ─── SLA / Delay report (E13-S04) ─────────────────────────────────────────────
export interface SlaBreach {
  taskId: string;
  clientName: string;
  /** #152: the matter's organisation — a client can have several. */
  organisation: string;
  serviceType: string;
  serviceName: string;
  stepNumber: number;
  stepTitle: string;
  phaseId: string | null;
  phaseName: string;
  assigneeUid: string | null;
  assigneeName: string | null;
  /** E20-S02: who the step is waiting on — a client's lateness is not the firm's. */
  owner: 'team' | 'client' | 'govt';
  dueAt: string;
  startedAt: string | null;
  severity: 'overdue' | 'at_risk';
  daysOverdue: number;
  daysLeft: number;
  isUrgent: boolean;
}

export interface OnTimeRate {
  key: string;
  label: string;
  onTime: number;
  total: number;
  rate: number | null; // % on-time, null when no completed-with-due steps yet
}

export interface SlaReport {
  atRiskDays: number;
  breaches: SlaBreach[];
  summary: { overdue: number; atRisk: number };
  onTimeByService: OnTimeRate[];
  onTimeByPhase: OnTimeRate[];
}

export interface SlaFilters {
  serviceType?: string;
  assignee?: string;
  atRiskDays?: number;
}
export const SLA_FILTER_KEYS = ['serviceType', 'assignee', 'atRiskDays'] as const;

export const getSlaReport = (filters: SlaFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.serviceType) params.set('serviceType', filters.serviceType);
  if (filters.assignee) params.set('assignee', filters.assignee);
  if (filters.atRiskDays != null) params.set('atRiskDays', String(filters.atRiskDays));
  const qs = params.toString();
  return apiFetch<SlaReport>(`/api/reports/sla${qs ? `?${qs}` : ''}`);
};

// ─── Payment Overrides report (#58) ───────────────────────────────────────────
export interface PaymentOverrideRow {
  taskId: string;
  clientName: string;
  serviceName: string;
  status: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountDue: number;
  overrideReason: 'created_no_payment' | 'gate_override' | 'created_no_payment+gate_override';
  updatedAt: string;
}

export const getPaymentOverridesReport = () =>
  apiFetch<PaymentOverrideRow[]>('/api/reports/payment-overrides');

// ─── Professional / Group mapping report (#62) ────────────────────────────────
export interface MappingGroup {
  name: string;
  count: number;
  clients: { uid: string; name: string }[];
}
export interface ProfessionalMappingReport {
  totalClients: number;
  byProfessional: MappingGroup[];
  byGroup: MappingGroup[];
}
export const getProfessionalMappingReport = () =>
  apiFetch<ProfessionalMappingReport>('/api/reports/professional-mapping');

// ─── Unassigned Tasks report (#50 companion) ──────────────────────────────────
export interface UnassignedRow {
  taskId: string;
  clientName: string;
  serviceName: string;
  stepNumber: number;
  stepTitle: string;
  assignedRole: string | null;
  dueAt: string | null;
  isUrgent: boolean;
  updatedAt: string;
}
export const getUnassignedReport = () =>
  apiFetch<UnassignedRow[]>('/api/reports/unassigned');

// ─── Master Sheet ───────────────────────────────────────────────────────────
export interface MasterSheetRow {
  taskId: string;
  clientName: string;
  /** #152: the matter's organisation — a client can have several. */
  organisation: string;
  serviceType: string;
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountDue: number;
  lastUpdated: string;
  taskStatus: string;
  // #84 additions:
  createdAt: string;
  totalFees: number;
  paymentMode: string;
  professional: string;
  priority: string;
  pendingReason: string;
  pendingFrom: string;
  approvalPendingFrom: string;
  referralSource: string;
}

export const getMasterSheet = (filters: ReportFilters = {}) =>
  apiFetch<MasterSheetRow[]>(`/api/reports/master-sheet${buildQuery(filters)}`);

// ─── #84 Revenue Analytics ──────────────────────────────────────────────────
export interface RevenueReport {
  collected: number;
  outstanding: number;
  totalFees: number;
  pending: number;
  monthly: { month: string; collected: number }[];
  services: { service: string; collected: number; outstanding: number }[];
  team: { name: string; collected: number }[];
}
export const getRevenueReport = () => apiFetch<RevenueReport>('/api/reports/revenue');

// ─── LT #216 Employee Performance ───────────────────────────────────────────
// One person (uid) or the whole team, over a period. Every figure is computed on
// the server from step records and the activity log. There is NO time tracking:
// `elapsedMs` is start → finish of a task, not hours worked.

export type PerfGranularity = 'auto' | 'day' | 'week' | 'month';

export interface PerfStepRef {
  taskId: string;
  stepNumber: number;
  title: string;
  clientName: string;
  serviceName: string;
}

export interface PerfSummary {
  assigned: number;
  completed: number;
  inProgress: number;
  /** null in the whole-team view: future steps are not loaded there. */
  notStarted: number | null;
  pending: number;
  startedInRange: number;
  completedInRange: number;
  carriedForward: number;
  overdue: number;
  completionPct: number | null;
  awaitingApproval: number;
}

export interface PerfTimeItem extends PerfStepRef { startedAt: string; completedAt: string; elapsedMs: number }

export interface PerfLateItem extends PerfStepRef {
  dueAt: string | null;
  completedAt: string;
  delayDays: number;
  /** The comment recorded when the late task was completed — there is no delay-reason field. */
  completionComment: string | null;
}
export interface PerfOverdueItem extends PerfStepRef { dueAt: string; startedAt: string | null; daysOverdue: number }

export interface PerfTrendBucket { start: string; label: string; completed: number; onTime: number; withDue: number; onTimePct: number | null }
export interface PerfPeriodTotals { completed: number; onTime: number; withDue: number; onTimePct: number | null }

export interface PerfReturnedItem extends PerfStepRef {
  status: string;
  returns: number;
  totalReturns: number;
  lastReturnAt: string | null;
  lastReturnType: string;
  lastComment: string | null;
}
export interface PerfAwaitingItem {
  kind: 'step' | 'matter';
  waitingOn: 'admin' | 'client';
  taskId: string;
  stepNumber: number | null;
  title: string;
  approvalTitle: string;
  clientName: string;
  serviceName: string;
  since: string | null;
}

export interface PerfHistoryRow extends PerfStepRef {
  status: 'completed' | 'in_progress' | 'waiting';
  matterCreatedAt: string | null;
  assignedAt: string | null;
  assignedVia: 'reassigned' | 'matter-opened';
  startedAt: string | null;
  completedAt: string | null;
  dueAt: string | null;
  lastComment: string | null;
}

export interface PerfOverviewRow {
  uid: string;
  name: string;
  role: string | null;
  assigned: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completedLate: number;
  onTimePct: number | null;
  avgDelayDays: number | null;
  returned: number;
  firstTimeRightPct: number | null;
}

export interface PerfStaff { uid: string; name: string; role: string }

export interface TeamPerformanceReport {
  range: { from: string; to: string; previousFrom: string; previousTo: string };
  generatedAt: string;
  staff: PerfStaff[];
  employee: PerfStaff | null;
  overview: PerfOverviewRow[];
  summary: PerfSummary;
  time: { count: number; totalElapsedMs: number; avgElapsedMs: number | null; items: PerfTimeItem[] };
  deadlines: {
    completedOnTime: number;
    completedLate: number;
    completedWithoutDueDate: number;
    onTimePct: number | null;
    overdueNow: number;
    avgDelayDays: number | null;
    lateItems: PerfLateItem[];
    overdueItems: PerfOverdueItem[];
  };
  trend: {
    granularity: 'day' | 'week' | 'month';
    buckets: PerfTrendBucket[];
    current: PerfPeriodTotals;
    previous: PerfPeriodTotals | null;
    completedChange: number | null;
    onTimePctChange: number | null;
  };
  quality: {
    completed: number;
    firstTimeRight: number;
    firstTimeRightPct: number | null;
    returnedSteps: number;
    returnCount: number;
    returnedItems: PerfReturnedItem[];
    awaitingApproval: number;
    awaitingItems: PerfAwaitingItem[];
  };
  history: { total: number; rows: PerfHistoryRow[] };
  /** True when a safety cap was reached and some records were not read. */
  truncated: boolean;
}

export interface TeamPerformanceQuery {
  from: string;
  to: string;
  uid?: string;
  tz: number;
  granularity?: PerfGranularity;
}

export const getTeamPerformance = (q: TeamPerformanceQuery) => {
  const p = new URLSearchParams({ from: q.from, to: q.to, tz: String(q.tz) });
  if (q.uid) p.set('uid', q.uid);
  if (q.granularity && q.granularity !== 'auto') p.set('granularity', q.granularity);
  return apiFetch<TeamPerformanceReport>(`/api/reports/team-performance?${p.toString()}`);
};

export interface PerfActivity {
  id: string;
  taskId: string;
  type: string | null;
  label: string;
  at: string | null;
  byUid: string | null;
  byName: string;
  fromStep: number | null;
  fromTitle: string | null;
  toStep: number | null;
  toTitle: string | null;
  comment: string | null;
  clientName: string;
  serviceName: string;
}

export const getTeamPerformanceActivity = (q: { from: string; to: string; uid?: string; cursor?: string | null; limit?: number }) => {
  const p = new URLSearchParams({ from: q.from, to: q.to, limit: String(q.limit ?? 25) });
  if (q.uid) p.set('uid', q.uid);
  if (q.cursor) p.set('cursor', q.cursor);
  return apiFetch<{ data: PerfActivity[]; nextCursor: string | null }>(`/api/reports/team-performance/activity?${p.toString()}`);
};

// ─── #84 Storage Usage ──────────────────────────────────────────────────────
export interface StorageReport {
  totalBytes: number;
  remaining: number;
  provisioned: number;
  usedPct: number;
  alertLevel: 'ok' | 'warning' | 'critical';
  perClient: { client: string; bytes: number }[];
}
export const getStorageReport = () => apiFetch<StorageReport>('/api/reports/storage');

// ─── #84 Client-facing: my services ─────────────────────────────────────────
export interface MyServiceRow {
  taskId: string;
  serviceName: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  pendingAction: string;
  paymentStatus: PaymentStatus;
  totalFees: number;
  amountPaid: number;
  amountDue: number;
  paymentMode: string;
  paymentDate: string;
  assignedTeam: string;
  createdAt: string;
  matterDueAt: string;
}
export const getMyServices = () => apiFetch<MyServiceRow[]>('/api/reports/my-services');

// ─── Contact Leads report ───────────────────────────────────────────────────
export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface ContactLead {
  id: string;
  refId: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  state: string;
  preferredCallTime: string;
  source: string;
  sourceLabel: string;
  whatsapp: boolean;
  status: LeadStatus;
  notes: string;
  // #196: the lead-sheet fields. Dates are YYYY-MM-DD; '' when unset.
  leadDate: string;
  leadSource: string;
  organisationObjects: string;
  serviceRequired: string;
  proposalSentOn: string;
  lastFollowUp: string;
  outcome: LeadOutcome;
  outcomeRemarks: string;
  createdAt: string | null;
  updatedAt: string | null;
  contactedAt: string | null;
  registered: boolean;
  registeredUid: string | null;
  registeredRole: string | null;
}

export interface LeadInput {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  state?: string;
  preferredCallTime?: string;
  sourceLabel?: string;
  message?: string;
  notes?: string;
  status?: LeadStatus;
  leadDate?: string;
  leadSource?: string;
  organisationObjects?: string;
  serviceRequired?: string;
  proposalSentOn?: string;
  lastFollowUp?: string;
  outcome?: LeadOutcome;
  outcomeRemarks?: string;
}

export const getContactLeadsReport = () =>
  apiFetch<ContactLead[]>('/api/leads');

export const createLead = (body: LeadInput) =>
  apiFetch<ContactLead>('/api/leads', { method: 'POST', body: JSON.stringify(body) });

export const updateLead = (id: string, body: LeadInput) =>
  apiFetch<Partial<ContactLead>>(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteLead = (id: string) =>
  apiFetch<void>(`/api/leads/${id}`, { method: 'DELETE' });

/** Result of converting a lead into a client account (E08-S06). */
export interface ConvertLeadResult {
  message: string;
  uid: string;
  email: string;
  isUpdate: boolean;
}

/** Convert a lead into a client user (creates or links by email). Admin/manager. */
export const convertLeadToClient = (id: string) =>
  apiFetch<ConvertLeadResult>(`/api/leads/${id}/convert`, { method: 'POST' });

/**
 * Download the master sheet as CSV. The endpoint needs the sign-in token in a
 * header, which a plain window.open() cannot send (it came back 401), so fetch it
 * with the token and hand the bytes over: the share sheet inside the app, a normal
 * download in a browser.
 */
export async function downloadMasterSheetCSV(filters: ReportFilters = {}): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const params = new URLSearchParams({ format: 'csv' });
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;
  const res = await fetch(`${base}/api/reports/master-sheet?${params.toString()}`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Could not download the CSV.');
  }
  const blob = new Blob([await res.blob()], { type: 'text/csv' });
  const fileName = `master-sheet-${new Date().toISOString().slice(0, 10)}.csv`;
  if (await shareBlobNative(blob, fileName)) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/* ── LT #206: works and fees per group / client, by financial year ────────── */

export interface ClientGroupFeeRow {
  taskId: string;
  clientUid: string | null;
  clientName: string;
  /** '' for an individual client (no group). */
  group: string;
  serviceKey: string;
  serviceName: string;
  createdAt: string | null;
  financialYear: string | null;
  status: string;
  /** False when the matter carries no fee — shown as a dash, never ₹0. */
  priced: boolean;
  charged: number;
  received: number;
  balance: number;
}

export interface FeeTotals { works: number; charged: number; received: number; balance: number }

export interface ClientGroupFeeReport {
  financialYear: string;
  financialYears: string[];
  groups: string[];
  clients: { uid: string; name: string; group: string }[];
  services: { key: string; name: string }[];
  rows: ClientGroupFeeRow[];
  totals: FeeTotals;
  byGroup: (FeeTotals & { group: string; clients: number })[];
}

export interface ClientGroupFeeFilters { fy?: string; group?: string; clientUid?: string; serviceKey?: string }
export const CLIENT_GROUP_FEE_FILTER_KEYS = ['fy', 'group', 'clientUid', 'serviceKey'] as const;

/** The filter value that means "clients with no group". Mirrors the API. */
export const INDIVIDUAL_CLIENTS = 'individual';

export const getClientGroupFees = (filters: ClientGroupFeeFilters = {}) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v) q.set(k, v);
  const qs = q.toString();
  return apiFetch<ClientGroupFeeReport>(`/api/reports/client-group-fees${qs ? `?${qs}` : ''}`);
};
