import { apiFetch } from './client';

export interface WorkflowTemplate {
  id: string;
  name: string;
  type: string;
}

export const getWorkflows = () => apiFetch<WorkflowTemplate[]>('/api/workflows');
export const getWorkflow = (id: string) => apiFetch<WorkflowTemplate>(`/api/workflows/${id}`);
export const advanceWorkflow = (taskId: string, event: Record<string, unknown>) =>
  apiFetch<void>(`/api/workflows/${taskId}/advance`, {
    method: 'POST',
    body: JSON.stringify(event),
  });
