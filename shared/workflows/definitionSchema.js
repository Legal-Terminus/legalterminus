/**
 * Workflow Definition Schema (v1) — the DATA shape of a workflow, stored in the
 * Firestore `workflowDefinitions` collection and compiled to an XState machine at
 * runtime (see compileDefinition.js). This replaces hand-written machine code:
 * new flows are documents, editable/versionable without a deploy.
 *
 * A definition is a flat list of STEPS. Each step declares its transitions
 * explicitly (event → next step number), so branches, loops and gates are all
 * representable as data. The compiler turns this into the equivalent XState v5
 * machine the engine already runs.
 *
 * ── Shape ─────────────────────────────────────────────────────────────────
 * WorkflowDefinition = {
 *   id: string,                 // e.g. 'company-incorporation'
 *   name: string,               // human label
 *   version: number,            // bumped on every published edit (immutable per task)
 *   initialStep: number,        // step number to start at
 *   steps: WorkflowStepDef[],
 *   phases?: PhaseDef[],        // optional client-facing grouping (the "journey" stations)
 * }
 *
 * PhaseDef = {
 *   id: string,                 // stable phase id, referenced by step.phaseId
 *   name: string,               // human label shown on the journey tracker station
 *   order: number,              // station order on the rail (ascending)
 * }
 *
 * WorkflowStepDef = {
 *   stepNumber: number,         // unique within the definition (explicit identity — NOT parsed)
 *   title: string,              // explicit display title (no snake_case inference)
 *   description?: string,       // optional client/staff-facing explanation of the step
 *   type: 'step' | 'payment_gate' | 'branch' | 'final',
 *   assignedRole?: string,      // default responsible role
 *   defaultAssigneeUid?: string,// default assignee (specific user UID); overrides phase default
 *   effects?: string[],         // declarative effect names (e.g. 'SEND_EMAIL') run by backend AFTER commit
 *   phaseId?: string,           // which PhaseDef this step belongs to (journey grouping)
 *   typicalDurationDays?: number, // expected duration — powers ETA + delay states
 *   clientVisible?: boolean,    // whether this step appears in the CLIENT step list (default true)
 *   clientActionLabel?: string, // short CTA label for the client hero card (vs. generic title)
 *   // Gate config (type === 'payment_gate'):
 *   gate?: { requires: 'fully_paid' | 'part_paid', onPass: number, onWait: number },
 *   // Transitions (type 'step'/'branch'): event → target step number.
 *   transitions?: TransitionDef[],
 * }
 *
 * TransitionDef = {
 *   event: string,              // e.g. 'COMPLETE_STEP', 'CLIENT_APPROVE', 'BRANCH_DECISION'
 *   to: number,                 // target step number
 *   branch?: string,            // for BRANCH_DECISION: which branch value selects this target
 * }
 *
 * Notes:
 * - Payment gates compile to an eventless (`always`) guard plus a paired waiting
 *   state that accepts RECORD_PAYMENT / ADMIN_OVERRIDE_PAYMENT (matches the
 *   current incorporation machine semantics).
 * - 'final' step compiles to an XState final state.
 */

export const STEP_TYPES = ['step', 'payment_gate', 'branch', 'final'];
export const PAYMENT_REQUIREMENTS = ['fully_paid', 'part_paid'];

/** "Who's driving" buckets for the journey tracker's ownership cues. */
export const OWNER_TYPES = ['client', 'team', 'govt'];

/**
 * Derive who is responsible for advancing a step — no extra per-step config needed.
 * Payment gates and client-approval steps are on the client; government-response
 * steps are on the registrar; everything else is the firm's team. An explicit
 * `step.ownerType` (if ever set) wins over the derivation.
 */
export function deriveOwnerType(step) {
  if (!step) return 'team';
  if (OWNER_TYPES.includes(step.ownerType)) return step.ownerType;
  const events = new Set((step.transitions ?? []).map((t) => t.event));
  if (step.type === 'payment_gate' || events.has('CLIENT_APPROVE')) return 'client';
  if (events.has('GOVT_APPROVE')) return 'govt';
  return 'team';
}

/**
 * Map each step number to its phase id (falling back to null when a step has no
 * phaseId). Pure lookup the tracker uses to place steps under their station.
 */
export function stepPhaseMap(def) {
  const map = new Map();
  for (const s of def?.steps ?? []) map.set(s.stepNumber, s.phaseId ?? null);
  return map;
}

/**
 * Phase-aware progress for the "Stage X of N" label and rail fill. A phase is
 * `done` when all its steps are completed/skipped, `now` when it holds the
 * current (or any in-progress) step, else `upcoming`. When `stepStatuses`
 * (Map<stepNumber, status>) is provided, status derives from real per-step
 * completion — required so the FINAL phase turns `done` at the end (there's no
 * later phase for a cursor-only heuristic to advance into). Without it, falls
 * back to the cursor heuristic. Returns ordered phases + the active index.
 */
export function phaseProgress(def, currentStepNumber, stepStatuses) {
  const phases = [...(def?.phases ?? [])].sort((a, b) => a.order - b.order);
  const phaseOf = stepPhaseMap(def);
  const currentPhaseId = phaseOf.get(currentStepNumber) ?? null;
  const activeIndex = phases.findIndex((p) => p.id === currentPhaseId);

  const stepsByPhase = new Map();
  for (const s of def?.steps ?? []) {
    if (s.type === 'final' || !s.phaseId) continue;
    const arr = stepsByPhase.get(s.phaseId) ?? [];
    arr.push(s.stepNumber);
    stepsByPhase.set(s.phaseId, arr);
  }
  const isDone = (st) => st === 'completed' || st === 'skipped';

  const withStatus = phases.map((p, i) => {
    let status;
    if (stepStatuses && stepStatuses.size > 0) {
      const nums = stepsByPhase.get(p.id) ?? [];
      const allDone = nums.length > 0 && nums.every((n) => isDone(stepStatuses.get(n)));
      const anyDone = nums.some((n) => isDone(stepStatuses.get(n)));
      status = allDone ? 'done' : i === activeIndex || anyDone ? 'now' : 'upcoming';
    } else {
      status = activeIndex === -1 ? 'upcoming' : i < activeIndex ? 'done' : i === activeIndex ? 'now' : 'upcoming';
    }
    return { ...p, status };
  });
  return { phases: withStatus, activeIndex, total: phases.length };
}

/** Stable XState state key for a step number (single source for compiler + viz). */
export const stateKeyFor = (stepNumber) => `step_${stepNumber}`;
export const waitingKeyFor = (stepNumber) => `await_${stepNumber}`;
export const FINAL_STATE_KEY = 'completed';

/**
 * Lightweight structural validation of a definition (defensive; the Zod schema on
 * the write endpoint is the real gate). Returns an array of error strings (empty
 * if valid). Kept dependency-free so both Portal and backend can call it.
 */
export function validateDefinition(def) {
  const errors = [];
  if (!def || typeof def !== 'object') return ['definition must be an object'];
  if (!def.id) errors.push('id is required');
  if (!Array.isArray(def.steps) || def.steps.length === 0) errors.push('steps[] is required and non-empty');
  if (typeof def.initialStep !== 'number') errors.push('initialStep (number) is required');

  const numbers = new Set();
  for (const s of def.steps ?? []) {
    if (typeof s.stepNumber !== 'number') { errors.push(`step "${s.title ?? '?'}" missing numeric stepNumber`); continue; }
    if (numbers.has(s.stepNumber)) errors.push(`duplicate stepNumber ${s.stepNumber}`);
    numbers.add(s.stepNumber);
    if (!STEP_TYPES.includes(s.type)) errors.push(`step ${s.stepNumber} has invalid type '${s.type}'`);
    // ETA (E13-S01): optional, but when present must be a non-negative number.
    if (s.typicalDurationDays != null &&
        (typeof s.typicalDurationDays !== 'number' || !Number.isFinite(s.typicalDurationDays) || s.typicalDurationDays < 0)) {
      errors.push(`step ${s.stepNumber} typicalDurationDays must be a non-negative number`);
    }
    // clientVisible (per-step client interface visibility): optional boolean.
    if (s.clientVisible != null && typeof s.clientVisible !== 'boolean') {
      errors.push(`step ${s.stepNumber} clientVisible must be a boolean`);
    }
    if (s.type === 'payment_gate') {
      if (!s.gate) errors.push(`payment_gate step ${s.stepNumber} missing gate config`);
      else {
        if (!PAYMENT_REQUIREMENTS.includes(s.gate.requires)) errors.push(`step ${s.stepNumber} gate.requires invalid`);
        if (typeof s.gate.onPass !== 'number') errors.push(`step ${s.stepNumber} gate.onPass must be a step number`);
        if (typeof s.gate.onWait !== 'number') errors.push(`step ${s.stepNumber} gate.onWait must be a step number`);
      }
    }
  }

  // Validate transition targets exist.
  for (const s of def.steps ?? []) {
    for (const t of s.transitions ?? []) {
      if (!numbers.has(t.to)) errors.push(`step ${s.stepNumber} transition '${t.event}' → unknown step ${t.to}`);
    }
    if (s.gate) {
      if (!numbers.has(s.gate.onPass)) errors.push(`step ${s.stepNumber} gate.onPass → unknown step ${s.gate.onPass}`);
      if (!numbers.has(s.gate.onWait)) errors.push(`step ${s.stepNumber} gate.onWait → unknown step ${s.gate.onWait}`);
    }
  }
  if (def.initialStep != null && !numbers.has(def.initialStep)) {
    errors.push(`initialStep ${def.initialStep} is not a defined step`);
  }

  // Phases are optional, but if present they must be well-formed and every
  // step.phaseId must reference a declared phase (no dangling stations).
  if (def.phases != null) {
    if (!Array.isArray(def.phases)) {
      errors.push('phases must be an array when present');
    } else {
      const phaseIds = new Set();
      for (const p of def.phases) {
        if (!p || typeof p.id !== 'string') { errors.push('each phase needs a string id'); continue; }
        if (phaseIds.has(p.id)) errors.push(`duplicate phase id '${p.id}'`);
        phaseIds.add(p.id);
        if (typeof p.name !== 'string') errors.push(`phase '${p.id}' missing name`);
        if (typeof p.order !== 'number') errors.push(`phase '${p.id}' missing numeric order`);
      }
      for (const s of def.steps ?? []) {
        if (s.phaseId != null && !phaseIds.has(s.phaseId)) {
          errors.push(`step ${s.stepNumber} references unknown phase '${s.phaseId}'`);
        }
      }
    }
  }
  return errors;
}
