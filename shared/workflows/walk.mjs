/**
 * Standalone happy-path walk of a compiled workflow definition. No Firebase.
 * Builds the definition exactly as the seed does (machine → convert), compiles
 * it, then drives it event-by-event to confirm the flow reaches a final state
 * with no dead end. A "dead end" = a non-final state where no event changes the
 * state (the bug class that produced the step-13 loop and step-41 dead-end).
 *
 * Run: node shared/workflows/walk.mjs
 */
import { createActor } from 'xstate';
import { companyIncorporationMachine } from './companyIncorporation.machine.js';
import { convertMachineToDefinition } from './convertMachineToDefinition.js';
import { validateDefinition } from './definitionSchema.js';
import { compileDefinition } from './compileDefinition.js';

const def = convertMachineToDefinition(companyIncorporationMachine, {
  id: 'company-incorporation', name: 'Company Incorporation', version: 1,
});
const errors = validateDefinition(def);
if (errors.length) {
  console.error('❌ Definition invalid:\n - ' + errors.join('\n - '));
  process.exit(1);
}

const baseContext = {
  taskId: 'walk', clientUid: 'walk', workflowType: def.id,
  paymentStatus: 'not_paid', currentStepNumber: def.initialStep,
  completedSteps: [], activeParallelGroup: null, branchDecision: null,
  iterationCount: {}, adminOverride: false,
};

// Prefer the canonical forward event for a step type; fall back to first branch.
function pickEvent(events) {
  const forward = ['COMPLETE_STEP', 'CLIENT_APPROVE', 'GOVT_APPROVE'];
  for (const e of forward) if (events.includes(e)) return { type: e };
  if (events.includes('RECORD_PAYMENT')) return { type: 'RECORD_PAYMENT', newStatus: 'fully_paid' };
  if (events.includes('BRANCH_DECISION')) return null; // need a branch value; handled by caller
  return null;
}

const machine = compileDefinition({ ...def });
let actor = createActor(machine, { input: baseContext });
actor.start();

const MAX = 200;
let steps = 0;
const path = [];

while (steps++ < MAX) {
  const snap = actor.getSnapshot();
  const stateKey = String(snap.value);
  const stepNum = snap.context.currentStepNumber;

  if (snap.status === 'done' || stateKey === 'completed') {
    path.push(`✔ completed (status=${snap.status})`);
    break;
  }

  // What events does this state accept?
  const accepted = snap._nodes
    ? [...new Set(snap._nodes.flatMap((n) => Object.keys(n.config?.on ?? {})))]
    : [];
  // xstate v5: derive from snapshot.machine resolved node
  const events = accepted.length ? accepted : Object.keys(
    machine.getStateNodeById?.(`${machine.id}.${stateKey}`)?.config?.on ?? {}
  );

  let event = pickEvent(events);
  if (!event && events.includes('BRANCH_DECISION')) {
    // take the first declared branch
    const stepDef = def.steps.find((s) => s.stepNumber === stepNum);
    const branch = stepDef?.transitions?.find((t) => t.branch)?.branch;
    event = { type: 'BRANCH_DECISION', branch };
  }

  if (!event) {
    console.error(`\n❌ DEAD END at state '${stateKey}' (step ${stepNum}). Accepted events: [${events.join(', ')}]`);
    console.error('Path so far:\n  ' + path.join('\n  '));
    process.exit(2);
  }

  actor.send(event);
  const after = actor.getSnapshot();
  if (String(after.value) === stateKey && after.context.currentStepNumber === stepNum) {
    console.error(`\n❌ STUCK: event '${event.type}' did not advance state '${stateKey}' (step ${stepNum}).`);
    console.error('Path so far:\n  ' + path.join('\n  '));
    process.exit(3);
  }
  path.push(`step ${stepNum} (${stateKey}) --${event.type}${event.branch ? ':' + event.branch : ''}--> step ${after.context.currentStepNumber}`);
}

if (steps >= MAX) {
  console.error(`\n❌ Did not complete within ${MAX} transitions (possible loop).`);
  console.error('Path:\n  ' + path.join('\n  '));
  process.exit(4);
}

console.log(`✅ Happy path completes in ${path.length - 1} transitions (${def.steps.length} defined steps).`);
console.log('Path:\n  ' + path.join('\n  '));
