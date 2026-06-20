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
