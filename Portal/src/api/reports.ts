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
  pendingReason: 'payment' | 'document' | 'client_action' | 'government';
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
export interface ContactLead {
  id: string;
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
  status: 'new' | 'contacted' | 'closed';
  createdAt: string | null;
  updatedAt: string | null;
  registered: boolean;
  registeredUid: string | null;
  registeredRole: string | null;
}

export const getContactLeadsReport = () =>
  apiFetch<ContactLead[]>('/api/leads');

/** Navigates browser to download CSV — no fetch needed (binary stream) */
export const downloadMasterSheetCSV = (filters: ReportFilters = {}) => {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
  const params = new URLSearchParams({ format: 'csv' });
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  window.open(`${base}/api/reports/master-sheet?${params.toString()}`, '_blank');
};
