import { createMachine, assign } from 'xstate';
import { stateKeyFor, waitingKeyFor, FINAL_STATE_KEY } from './definitionSchema.js';

/**
 * Compile a stored WorkflowDefinition (data) into an XState v5 machine (engine).
 * This is the bridge that makes flows data-driven: one compiler serves all 50+
 * flows; new flows are documents, not code. Output is semantically equivalent to
 * the previously hand-written machines (gates, branches, loops, currentStepNumber
 * tracking), so the runtime, transition logic and visualizer are unchanged.
 *
 * Effects are NOT executed here — a step's `effects` are declared as data and run
 * by the backend after a transition commits (see backend effect handlers).
 */

const setStep = (n) => assign(() => ({ currentStepNumber: n }));

function compileStep(step) {
  const key = stateKeyFor(step.stepNumber);

  if (step.type === 'final') {
    return { [key]: { type: 'final', meta: stepMeta(step) } };
  }

  if (step.type === 'payment_gate') {
    const passKey = stateKeyFor(step.gate.onPass);
    const waitKey = waitingKeyFor(step.stepNumber);
    const guardName = step.gate.requires === 'part_paid' ? 'partPaymentGateGuard' : 'paymentGateGuard';
    return {
      [key]: {
        meta: stepMeta(step),
        always: [
          { guard: guardName, target: passKey, actions: setStep(step.gate.onPass) },
          { target: waitKey },
        ],
        on: {
          RECORD_PAYMENT: { actions: assign(({ event }) => ({ paymentStatus: event.newStatus })), target: key },
          ADMIN_OVERRIDE_PAYMENT: { actions: assign(() => ({ adminOverride: true })), target: passKey },
        },
      },
      // Paired waiting state: parks until payment recorded or admin overrides.
      [waitKey]: {
        meta: { waitingFor: step.stepNumber },
        on: {
          RECORD_PAYMENT: { actions: assign(({ event }) => ({ paymentStatus: event.newStatus })), target: key },
          ADMIN_OVERRIDE_PAYMENT: { actions: assign(() => ({ adminOverride: true })), target: passKey },
        },
      },
    };
  }

  // 'step' or 'branch': build `on` from explicit transitions.
  const on = {};
  for (const t of step.transitions ?? []) {
    const targetState = stateKeyFor(t.to);
    if (t.branch) {
      // Guarded branch entry: event with a `branch` discriminator.
      on[t.event] = on[t.event] || [];
      on[t.event].push({
        guard: branchGuard(t.branch),
        target: targetState,
        actions: setStep(t.to),
      });
    } else if (on[t.event]) {
      // Additional unguarded targets are not valid; keep the first (defensive).
      continue;
    } else {
      on[t.event] = { target: targetState, actions: setStep(t.to) };
    }
  }
  return { [key]: { meta: stepMeta(step), on } };
}

function stepMeta(step) {
  return {
    stepNumber: step.stepNumber,
    title: step.title,
    type: step.type,
    assignedRole: step.assignedRole,
    effects: step.effects ?? [],
  };
}

// Branch guards read the BRANCH_DECISION event's `branch` value. Named via a
// closure so the compiled machine needs no external guard registry for branches.
function branchGuard(branchValue) {
  return ({ event }) => event?.type === 'BRANCH_DECISION' && event.branch === branchValue;
}

/** Guards referenced by name in compiled gates. */
const guards = {
  paymentGateGuard: ({ context }) => context.paymentStatus === 'fully_paid' || context.adminOverride,
  partPaymentGateGuard: ({ context }) =>
    context.paymentStatus === 'part_paid' || context.paymentStatus === 'fully_paid' || context.adminOverride,
};

export function compileDefinition(def) {
  let states = {};
  let hasFinal = false;
  for (const step of def.steps) {
    states = { ...states, ...compileStep(step) };
    if (step.type === 'final') hasFinal = true;
  }
  // Ensure a terminal state exists even if the definition omits an explicit final.
  if (!hasFinal && !states[FINAL_STATE_KEY]) {
    states[FINAL_STATE_KEY] = { type: 'final' };
  }

  return createMachine(
    {
      id: def.id,
      initial: stateKeyFor(def.initialStep),
      context: ({ input }) => input,
      states,
    },
    { guards }
  );
}
