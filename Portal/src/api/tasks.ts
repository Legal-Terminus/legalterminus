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
