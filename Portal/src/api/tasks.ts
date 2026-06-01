import { apiFetch } from './client';
import type { Task } from '../types/task';

export const getTasks = (params?: Record<string, string>) => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return apiFetch<Task[]>(`/api/tasks${qs}`);
};
export const getTask = (id: string) => apiFetch<Task>(`/api/tasks/${id}`);
export const createTask = (body: Partial<Task>) =>
  apiFetch<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(body) });
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
