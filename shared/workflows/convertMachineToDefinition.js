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

// Synthetic step number for the terminal/final state (no business step number).
const FINAL_STEP_NUMBER = 9999;

// Concise, client-friendly step descriptions (from the business spec). Steps not
// listed get no description. Used to seed `description` on each step.
const STEP_DESCRIPTIONS = {
  1: 'Initial payment to begin the incorporation process.',
  2: 'Our team is assigned and begins work on your incorporation.',
  3: 'We collect the proposed company name and business objects.',
  4: 'We confirm the incorporation checklist with you.',
  5: 'We prepare a name search and draft the company objects.',
  6: 'We finalise the proposed name and objects.',
  7: 'The name search report and objects are emailed to you.',
  8: 'Awaiting your review of the proposed name and objects.',
  9: 'Your approval of the final name and objects is required to proceed.',
  10: 'We file the name application with the authorities.',
  11: 'Payment of the name application fee.',
  12: 'Name application submitted; awaiting the department.',
  13: 'Awaiting the government decision on the name.',
  14: 'Deciding how to handle a name resubmission.',
  15: 'Preparing the name resubmission.',
  16: 'Preparing the required documents.',
  17: 'Repeating the name search step as needed.',
  18: 'Internal review checkpoint.',
  19: 'Second internal review checkpoint.',
  20: 'The name approval letter has been received.',
  21: 'Balance payment is due before document filing continues.',
  22: 'We prepare the incorporation documents.',
  23: 'Awaiting your signature and supporting documents.',
  24: 'You upload the signed and supporting documents.',
  25: 'We fill in the incorporation forms.',
  26: 'We review the completed incorporation forms.',
  27: 'Full payment received before forms are filed.',
  28: 'We upload the incorporation forms to the portal.',
  29: 'Payment of the incorporation challan.',
  30: 'Forms submitted; awaiting the Certificate of Incorporation.',
  31: 'Awaiting the government decision on incorporation.',
  32: 'We email you about any additional information or documents needed.',
  33: 'Deciding how to handle an incorporation resubmission.',
  34: 'We collect the required information or documents.',
  35: 'Your approval on the resubmission is required.',
  36: 'We fill in and resubmit the forms.',
  37: 'Resubmission filed; awaiting the department.',
  38: 'The Certificate of Incorporation (COI) has been received.',
  39: 'PAN and TAN certificates received from the department.',
  40: 'We email you the final Certificate of Incorporation.',
  41: 'Final records updated — your company is incorporated.',
};

// Client-facing journey phases (the tracker's "stations"). Steps are grouped by
// number range; the machine's own comments mark its three internal phases, which
// we split into six client-readable milestones. A step's phase is the LAST phase
// whose `from` is ≤ its number, so loop-back steps still resolve to a station.
const INCORPORATION_PHASES = [
  { id: 'name-approval',   name: 'Payment & Name Approval', order: 1, from: 1 },
  { id: 'name-filing',     name: 'Name Filing',             order: 2, from: 10 },
  { id: 'doc-collection',  name: 'Document Collection',     order: 3, from: 21 },
  { id: 'form-filing',     name: 'Form Filing',             order: 4, from: 27 },
  { id: 'final-approval',  name: 'Final Approval',          order: 5, from: 31 },
  { id: 'handover',        name: 'Handover',                order: 6, from: 38 },
];

/** Resolve a step number to its phase id via the range table above. */
function phaseIdForStep(stepNumber) {
  let id = null;
  for (const p of INCORPORATION_PHASES) {
    if (stepNumber >= p.from) id = p.id;
  }
  return id;
}

const stateKeyToNumber = (key) => {
  const p = parseStepKey(key);
  return p ? p.stepNumber : null;
};

// A target is "final" if it's the conventional `completed` key or a state marked
// `type: 'final'` in the source machine.
const isFinalTarget = (target, states) => {
  if (!target) return false;
  const t = String(target).replace(/^\./, '');
  return t === 'completed' || states[t]?.type === 'final';
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
    if (STEP_DESCRIPTIONS[stepNumber]) out.description = STEP_DESCRIPTIONS[stepNumber];

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
        // A transition to a final/terminal state (e.g. 'completed') has no step
        // number — route it to the synthetic final step so the flow can complete.
        const to = isFinalTarget(t.target, states) ? FINAL_STEP_NUMBER : stateKeyToNumber(t.target);
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
      ...(STEP_DESCRIPTIONS[stepNumber] ? { description: STEP_DESCRIPTIONS[stepNumber] } : {}),
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

  // Append the synthetic final step if anything transitions to it.
  const needsFinal = steps.some((s) => (s.transitions ?? []).some((t) => t.to === FINAL_STEP_NUMBER));
  if (needsFinal) {
    steps.push({ stepNumber: FINAL_STEP_NUMBER, title: 'Completed', type: 'final' });
  }

  // Group steps into client-facing journey phases. The synthetic 'final' step
  // rides along with the last real phase (handover) so it doesn't dangle.
  for (const s of steps) {
    const n = s.stepNumber === FINAL_STEP_NUMBER ? 41 : s.stepNumber;
    const phaseId = phaseIdForStep(n);
    if (phaseId) s.phaseId = phaseId;
  }

  steps.sort((a, b) => a.stepNumber - b.stepNumber);

  return {
    id,
    name,
    version,
    initialStep: stepList[0]?.stepNumber ?? 1,
    steps,
    phases: INCORPORATION_PHASES.map(({ id, name, order }) => ({ id, name, order })),
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
