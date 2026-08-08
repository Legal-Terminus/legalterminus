import { createMachine, assign } from 'xstate';
import { stateKeyFor, waitingKeyFor, FINAL_STATE_KEY, isSyntheticFinalStep } from './definitionSchema.js';

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
    // #144: an AUTHORED final step (e.g. "Final Incorporation Master Sheet
    // update") is real internal work — the flow must PARK on it and wait for a
    // COMPLETE_STEP, then terminate. Compiling it straight to an XState final
    // state made the machine finish the instant it arrived, so the step was
    // never actionable and never shown. Only the synthetic end marker is a bare
    // final state.
    if (isSyntheticFinalStep(step)) {
      return { [key]: { type: 'final', meta: stepMeta(step) } };
    }
    return {
      [key]: {
        meta: stepMeta(step),
        on: { COMPLETE_STEP: { target: FINAL_STATE_KEY } },
      },
    };
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
          ADMIN_OVERRIDE_PAYMENT: {
            actions: [assign(() => ({ adminOverride: true })), setStep(step.gate.onPass)],
            target: passKey,
          },
        },
      },
      // Paired waiting state: parks until payment recorded or admin overrides.
      [waitKey]: {
        meta: { waitingFor: step.stepNumber },
        on: {
          RECORD_PAYMENT: { actions: assign(({ event }) => ({ paymentStatus: event.newStatus })), target: key },
          ADMIN_OVERRIDE_PAYMENT: {
            actions: [assign(() => ({ adminOverride: true })), setStep(step.gate.onPass)],
            target: passKey,
          },
        },
      },
    };
  }

  // 'step' or 'branch': build `on` from explicit transitions.
  const on = {};
  for (const t of step.transitions ?? []) {
    const targetState = stateKeyFor(t.to);
    if (t.branch) {
      // Guarded branch entry: event with a `branch` discriminator. `branchLabel`
      // is a no-op field XState ignores, preserved in machine.config so the
      // diagram can show the human option name instead of a raw event code.
      on[t.event] = on[t.event] || [];
      on[t.event].push({
        guard: branchGuard(t.branch),
        target: targetState,
        actions: setStep(t.to),
        branchLabel: t.branch,
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
    description: step.description ?? '',
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
  let hasTerminal = false;
  for (const step of def.steps) {
    states = { ...states, ...compileStep(step) };
    // #144: only the SYNTHETIC marker compiles to a terminal state. An authored
    // final step parks for its COMPLETE_STEP and then targets FINAL_STATE_KEY,
    // so the machine still needs that terminal state to exist.
    if (isSyntheticFinalStep(step)) hasTerminal = true;
  }
  // Ensure a terminal state exists — for definitions with no final step at all,
  // and for those whose only final is an authored (actionable) one.
  if (!hasTerminal && !states[FINAL_STATE_KEY]) {
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
