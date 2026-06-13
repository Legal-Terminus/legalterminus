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
 * }
 *
 * WorkflowStepDef = {
 *   stepNumber: number,         // unique within the definition (explicit identity — NOT parsed)
 *   title: string,              // explicit display title (no snake_case inference)
 *   type: 'step' | 'payment_gate' | 'branch' | 'final',
 *   assignedRole?: string,      // default responsible role
 *   effects?: string[],         // declarative effect names (e.g. 'SEND_EMAIL') run by backend AFTER commit
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
  return errors;
}
