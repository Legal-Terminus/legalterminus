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
  bucket: 'assigned' | 'unassigned' | 'other';
}

/** Consolidated step worklist for the current staff user across all matters. */
export const getMySteps = async (): Promise<MyStepRow[]> =>
  (await apiFetch<{ data: MyStepRow[] }>('/api/tasks/my-steps')).data;

/** Assign (or clear, with null) a specific step to a staff user. */
export const assignStep = (taskId: string, stepNumber: number, assignedTo: string | null) =>
  apiFetch<void>(`/api/tasks/${taskId}/steps/${stepNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo }),
  });
