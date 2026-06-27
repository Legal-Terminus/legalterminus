import { apiFetch } from './client';
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
  serviceType: string;
  serviceName: string;
  stepNumber: number;
  stepTitle: string;
  phaseId: string | null;
  phaseName: string;
  assigneeUid: string | null;
  assigneeName: string | null;
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

// ─── Master Sheet ───────────────────────────────────────────────────────────
export interface MasterSheetRow {
  taskId: string;
  clientName: string;
  serviceType: string;
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountDue: number;
  lastUpdated: string;
  taskStatus: string;
}

export const getMasterSheet = (filters: ReportFilters = {}) =>
  apiFetch<MasterSheetRow[]>(`/api/reports/master-sheet${buildQuery(filters)}`);

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

/** Navigates browser to download CSV — no fetch needed (binary stream) */
export const downloadMasterSheetCSV = (filters: ReportFilters = {}) => {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
  const params = new URLSearchParams({ format: 'csv' });
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  window.open(`${base}/api/reports/master-sheet?${params.toString()}`, '_blank');
};
