import { parseStepKey, getStepList } from './stepList.js';

/**
 * One-time converter: derive a data WorkflowDefinition from the legacy hardcoded
 * XState machine, so we can seed the `workflowDefinitions` collection without
 * hand-authoring 41 steps. After seeding, definitions are edited as data and this
 * converter is no longer needed at runtime (kept for re-seeds / other legacy flows).
 *
 * It reads the machine's `config.states`, maps each `step_N_*` state to a step,
 * and translates `always` (gates) / `on` (transitions, branches) into the schema.
 */

const stateKeyToNumber = (key) => {
  const p = parseStepKey(key);
  return p ? p.stepNumber : null;
};

// Resolve a transition `target` (a sibling state key) to a step number, mapping
// the legacy `awaiting_payment_*` waiting states back to their gate step.
function targetToStepNumber(target, states) {
  if (!target) return null;
  const direct = stateKeyToNumber(target);
  if (direct != null) return direct;
  // Waiting state: find which gate step routes to it via `always` onWait.
  return null; // handled by gate detection below
}

export function convertMachineToDefinition(machine, { id, name, version = 1 }) {
  const states = machine.config.states ?? {};
  const stepList = getStepList(machine); // [{stepNumber,key,title}]

  const steps = [];

  for (const { stepNumber, key, title } of stepList) {
    const def = states[key];
    const out = { stepNumber, title, type: 'step' };

    // Carry effects from legacy `entry` (email triggers).
    if (def.entry) out.effects = ['SEND_EMAIL'];

    // Payment gate: has `always` with guarded targets.
    if (Array.isArray(def.always)) {
      const passTransition = def.always.find((t) => t.guard);
      const requiresPart = def.always.some(
        (t) => typeof t.guard === 'function' && t.guard.name === 'partPaymentGateGuard'
      );
      // Pass target → step number.
      const onPass = stateKeyToNumber(passTransition?.target);
      out.type = 'payment_gate';
      out.gate = {
        requires: requiresPart && !def.always.some((t) => t.guard?.name === 'paymentGateGuard')
          ? 'part_paid'
          : 'fully_paid',
        onPass,
        onWait: stepNumber, // re-enter the gate; waiting handled by compiler
      };
      continue;
    }

    // Event transitions.
    const on = def.on ?? {};
    const transitions = [];
    let isBranch = false;
    for (const [event, value] of Object.entries(on)) {
      const arr = Array.isArray(value) ? value : [value];
      for (const t of arr) {
        const to = stateKeyToNumber(t.target);
        if (to == null) continue;
        if (event === 'BRANCH_DECISION') {
          isBranch = true;
          // Recover the branch discriminator from the legacy guard by probing.
          const branch = recoverBranchValue(t.guard);
          transitions.push({ event, to, branch });
        } else {
          transitions.push({ event, to });
        }
      }
    }
    if (isBranch) out.type = 'branch';
    if (transitions.length) out.transitions = transitions;
    steps.push(out);
  }

  // Insert gate steps (skipped via `continue` above) back in order.
  for (const { stepNumber, key, title } of stepList) {
    if (steps.find((s) => s.stepNumber === stepNumber)) continue;
    const def = states[key];
    const passTransition = (def.always ?? []).find((t) => t.guard);
    const requiresPart = (def.always ?? []).some((t) => t.guard?.name === 'partPaymentGateGuard');
    const requiresFull = (def.always ?? []).some((t) => t.guard?.name === 'paymentGateGuard');
    const gateStep = {
      stepNumber,
      title,
      type: 'payment_gate',
      gate: {
        requires: requiresFull ? 'fully_paid' : requiresPart ? 'part_paid' : 'fully_paid',
        onPass: stateKeyToNumber(passTransition?.target),
        onWait: stepNumber,
      },
    };
    if (def.entry) gateStep.effects = ['SEND_EMAIL'];
    steps.push(gateStep);
  }

  steps.sort((a, b) => a.stepNumber - b.stepNumber);

  return {
    id,
    name,
    version,
    initialStep: stepList[0]?.stepNumber ?? 1,
    steps,
  };
}

// The legacy branch guards are arrow fns comparing event.branch; we can't read
// the literal back reliably, so probe with each known branch value.
function recoverBranchValue(guard) {
  if (typeof guard !== 'function') return undefined;
  for (const branch of ['new_name', 'documentation', 'information']) {
    try {
      if (guard({ event: { type: 'BRANCH_DECISION', branch } })) return branch;
    } catch {
      // ignore
    }
  }
  return undefined;
}

// silence unused (kept for symmetry/readability)
void targetToStepNumber;
