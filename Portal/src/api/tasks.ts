import { apiFetch } from './client';
import type { Task } from '../types/task';

export interface TasksPage {
  data: Task[];
  nextCursor: string | null;
}

/** Paginated list. Returns { data, nextCursor }. */
export const getTasksPage = (params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return apiFetch<TasksPage>(`/api/tasks${qs}`);
};

/** Convenience: first page's rows only (used by the current list view). */
export const getTasks = async (params?: Record<string, string>): Promise<Task[]> =>
  (await getTasksPage(params)).data;
export const getTask = (id: string) => apiFetch<Task>(`/api/tasks/${id}`);

/** A workflow event (intent) sent to the backend-authoritative transition endpoint. */
export interface WorkflowEventInput {
  type:
    | 'COMPLETE_STEP' | 'RECORD_PAYMENT' | 'ADMIN_OVERRIDE_PAYMENT' | 'BRANCH_DECISION'
    | 'CLIENT_APPROVE' | 'CLIENT_REJECT' | 'GOVT_APPROVE' | 'GOVT_REJECT';
  newStatus?: 'not_paid' | 'part_paid' | 'fully_paid';
  branch?: string;
  remark?: string;
  reason?: string;
}

/** Advance a task by firing a workflow event. Backend enforces guards. */
export const advanceTask = (taskId: string, event: WorkflowEventInput) =>
  apiFetch<Task>(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: JSON.stringify({ event }),
  });
export const createTask = (body: Partial<Task>) =>
  apiFetch<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(body) });

/** Assign a service's workflow to a client → creates a task. */
export const assignServiceToClient = (input: {
  clientUid: string;
  serviceKey: string;
  serviceName?: string;
}) =>
  apiFetch<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(input) });
export const updateTask = (id: string, body: Partial<Task>) =>
  apiFetch<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteTask = (id: string) =>
  apiFetch<void>(`/api/tasks/${id}`, { method: 'DELETE' });

/** Approve a matter pending admin approval (E03-S04) → it goes active. Admin only. */
export const approveTask = (id: string) =>
  apiFetch<{ success: boolean; status: string }>(`/api/tasks/${id}/approve`, { method: 'POST' });

/** Reject a matter pending admin approval with a reason (E03-S04). Admin only. */
export const rejectTask = (id: string, reason: string) =>
  apiFetch<{ success: boolean; status: string }>(`/api/tasks/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

/** Stop/cancel an in-flight matter when a client discontinues (GitHub #41).
 *  Staff (admin/manager/team_member). Requires a reason. */
export const stopTask = (id: string, reason: string) =>
  apiFetch<{ success: boolean; status: string }>(`/api/tasks/${id}/stop`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });

/** An entry in a matter's activity thread (from the events audit subcollection). */
export interface TaskEvent {
  type: string;
  comment: string | null;
  fromStep: number | null;
  toStep: number | null;
  byRole: string | null;
  byName: string;
  at: string | null;
}

/** Activity thread for a matter — who did what, when, with comments. */
export const getTaskEvents = async (taskId: string): Promise<TaskEvent[]> =>
  (await apiFetch<{ data: TaskEvent[] }>(`/api/tasks/${taskId}/events`)).data;

/** Assign (or clear, with null) a whole matter to a staff user. Routes its active step too. */
export const assignMatter = (taskId: string, assignedTo: string | null) =>
  apiFetch<void>(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo }),
  });

/** Toggle urgent flag on a whole task */
export const setTaskUrgent = (taskId: string, isUrgent: boolean) =>
  apiFetch<void>(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isUrgent }),
  });

/** Toggle urgent flag on a specific step */
export const setStepUrgent = (taskId: string, stepId: string, isUrgent: boolean) =>
  apiFetch<void>(`/api/tasks/${taskId}/steps/${stepId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isUrgent }),
  });

/** A row in the cross-matter "My Tasks" worklist (the active step of an open matter). */
export interface MyStepRow {
  taskId: string;
  clientName: string;
  serviceName: string;
  isUrgent: boolean;
  updatedAt: string | null;
  stepNumber: number;
  stepTitle: string;
  assignedRole: string | null;
  assignedTo: string | null;
  // Due date of the active step (E13-S03); null when the step has no ETA.
  dueAt: string | null;
  bucket: 'assigned' | 'unassigned' | 'other';
}

/** A matter awaiting the current user's approval (E11-S04). */
export interface MyApprovalRow {
  taskId: string;
  clientName: string;
  serviceName: string;
  createdByName: string;
  isUrgent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Full "My Tasks" payload: the active-step worklist + matters awaiting my approval. */
export interface MyStepsResponse {
  data: MyStepRow[];
  approvals: MyApprovalRow[];
}

/** Consolidated step worklist + approvals for the current staff user across all matters. */
export const getMySteps = (): Promise<MyStepsResponse> =>
  apiFetch<MyStepsResponse>('/api/tasks/my-steps');

/**
 * Assign (or clear, with null) a specific step to a staff user. Direct + immediate
 * (no acceptance handshake); the backend records the change in the activity thread.
 */
export const assignStep = (taskId: string, stepNumber: number, assignedTo: string | null) =>
  apiFetch<void>(`/api/tasks/${taskId}/steps/${stepNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo }),
  });
