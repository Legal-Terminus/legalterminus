import { apiFetch } from './client';

/**
 * Workflow definitions (DATA) — fetched from the backend and compiled to an
 * XState machine client-side via the shared compiler. Powers the read-only
 * visualizer (and, later, the admin editor).
 */
export type OwnerType = 'client' | 'team' | 'govt';

/** A client-facing journey "station" grouping a run of steps. */
export interface PhaseDef {
  id: string;
  name: string;
  order: number;
}

export interface WorkflowStepDef {
  stepNumber: number;
  title: string;
  description?: string;
  type: 'step' | 'payment_gate' | 'branch' | 'final';
  assignedRole?: string;
  effects?: string[];
  phaseId?: string;
  typicalDurationDays?: number;
  clientActionLabel?: string;
  ownerType?: OwnerType;
  gate?: { requires: 'fully_paid' | 'part_paid'; onPass: number; onWait: number };
  transitions?: { event: string; to: number; branch?: string }[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: number;
  initialStep: number;
  steps: WorkflowStepDef[];
  phases?: PhaseDef[];
  serviceKeys?: string[];
}

/**
 * Derive who advances a step (mirrors shared/workflows/definitionSchema.js
 * `deriveOwnerType`) so the tracker's ownership cues need no per-step config.
 */
export function deriveOwnerType(step: WorkflowStepDef): OwnerType {
  if (step.ownerType) return step.ownerType;
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  if (step.type === 'payment_gate' || events.has('CLIENT_APPROVE')) return 'client';
  if (events.has('GOVT_APPROVE')) return 'govt';
  return 'team';
}

/**
 * Phase-aware progress for the journey rail. A phase is `done` when every one of
 * its steps is completed/skipped, `now` when it holds the current step (or any
 * in-progress step), else `upcoming`. Deriving from real per-step statuses (not
 * just `currentStepNumber`) is what lets the FINAL phase turn green on completion
 * — there's no later phase for the cursor to advance into, so a cursor-only
 * heuristic would leave it stuck on `now` forever.
 *
 * `stepStatuses` maps stepNumber → runtime status (from task.steps). When absent
 * (e.g. a fresh task with no statuses yet), falls back to the cursor heuristic.
 * Mirrors the shared `phaseProgress`.
 */
export function phaseProgress(
  def: WorkflowDefinition,
  currentStepNumber: number,
  stepStatuses?: Map<number, string>,
) {
  const phases = [...(def.phases ?? [])].sort((a, b) => a.order - b.order);
  const phaseOf = new Map(def.steps.map((s) => [s.stepNumber, s.phaseId ?? null]));
  const currentPhaseId = phaseOf.get(currentStepNumber) ?? null;
  const activeIndex = phases.findIndex((p) => p.id === currentPhaseId);

  // Group the definition's step numbers by phase (final/synthetic steps excluded).
  const stepsByPhase = new Map<string, number[]>();
  for (const s of def.steps) {
    if (s.type === 'final' || !s.phaseId) continue;
    const arr = stepsByPhase.get(s.phaseId) ?? [];
    arr.push(s.stepNumber);
    stepsByPhase.set(s.phaseId, arr);
  }

  const isDoneStatus = (st?: string) => st === 'completed' || st === 'skipped';

  const withStatus = phases.map((p, i) => {
    let status: 'done' | 'now' | 'upcoming';
    if (stepStatuses && stepStatuses.size > 0) {
      const nums = stepsByPhase.get(p.id) ?? [];
      const allDone = nums.length > 0 && nums.every((n) => isDoneStatus(stepStatuses.get(n)));
      const anyDone = nums.some((n) => isDoneStatus(stepStatuses.get(n)));
      status = allDone ? 'done' : i === activeIndex || anyDone ? 'now' : 'upcoming';
    } else {
      // Fallback: cursor-only heuristic (no runtime statuses available).
      status = activeIndex === -1 ? 'upcoming' : i < activeIndex ? 'done' : i === activeIndex ? 'now' : 'upcoming';
    }
    return { ...p, status };
  });
  return { phases: withStatus, activeIndex, total: phases.length };
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

/** Per-phase default assignees (E11-S02): phaseId → user UID (or null). */
export type PhaseAssignments = Record<string, string | null>;

export const getPhaseAssignments = (id: string) =>
  apiFetch<{ definitionId: string; assignments: PhaseAssignments }>(
    `/api/workflow-definitions/${id}/phase-assignments`,
  );

export const putPhaseAssignments = (id: string, assignments: PhaseAssignments) =>
  apiFetch<{ definitionId: string; assignments: PhaseAssignments }>(
    `/api/workflow-definitions/${id}/phase-assignments`,
    { method: 'PUT', body: JSON.stringify({ assignments }) },
  );

/** Config sync / health check for a workflow definition (E10-S02). */
export interface WorkflowSyncCheck {
  definitionId: string;
  version: number;
  stepCount: number;
  inSync: boolean;
  errors: string[];
  warnings: string[];
}

export const getWorkflowSyncCheck = (id: string) =>
  apiFetch<WorkflowSyncCheck>(`/api/workflow-definitions/${id}/sync-check`);

/** Per-step ETA config (E13-S01): one editable row per non-final step. */
export interface StepEtaRow {
  stepNumber: number;
  title: string;
  phaseId: string | null;
  typicalDurationDays: number | null;
}

export interface StepEtas {
  definitionId: string;
  version: number;
  steps: StepEtaRow[];
}

export const getStepEtas = (id: string) =>
  apiFetch<StepEtas>(`/api/workflow-definitions/${id}/step-etas`);

/** Save per-step ETAs. `etas` maps stepNumber → days (or null to clear). */
export const putStepEtas = (id: string, etas: Record<string, number | null>) =>
  apiFetch<StepEtas>(`/api/workflow-definitions/${id}/step-etas`, {
    method: 'PUT',
    body: JSON.stringify({ etas }),
  });
