import { apiFetch } from './client';

/**
 * Workflow definitions (DATA) — fetched from the backend and compiled to an
 * XState machine client-side via the shared compiler. Powers the read-only
 * visualizer (and, later, the admin editor).
 */
export interface WorkflowStepDef {
  stepNumber: number;
  title: string;
  type: 'step' | 'payment_gate' | 'branch' | 'final';
  assignedRole?: string;
  effects?: string[];
  gate?: { requires: 'fully_paid' | 'part_paid'; onPass: number; onWait: number };
  transitions?: { event: string; to: number; branch?: string }[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: number;
  initialStep: number;
  steps: WorkflowStepDef[];
  serviceKeys?: string[];
}

export interface WorkflowDefinitionSummary {
  id: string;
  name: string;
  version: number;
  serviceKeys: string[];
  stepCount: number;
  updatedAt: string | null;
}

export const getWorkflowDefinitions = () =>
  apiFetch<WorkflowDefinitionSummary[]>('/api/workflow-definitions');

export const getWorkflowDefinition = (id: string) =>
  apiFetch<WorkflowDefinition>(`/api/workflow-definitions/${id}`);
