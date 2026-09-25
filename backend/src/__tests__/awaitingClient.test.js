import test from 'node:test';
import assert from 'node:assert/strict';
import { markAwaitingClient } from '../controllers/tasks.controller.js';

/**
 * E20-S01 — does this matter await the CLIENT?
 *
 * The rule drives a "Needs you" badge on the client's dashboard, so the
 * asymmetry matters: a MISSED flag is a minor annoyance, a WRONG flag tells
 * someone to act when they need not. Every uncertain case must resolve to
 * false.
 */

// Ownership is derived by `deriveOwnerType`, which reads `ownerType`, a
// `payment_gate` type, or a CLIENT_APPROVE/GOVT_APPROVE transition — NOT
// `assignedRole`. Getting this wrong is easy and silently yields "team".
const DEF = {
  steps: [
    { stepNumber: 5, type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 17 }] },
    { stepNumber: 17, type: 'step', transitions: [{ event: 'CLIENT_APPROVE', to: 31 }] },
    { stepNumber: 31, type: 'step', transitions: [{ event: 'GOVT_APPROVE', to: 46 }] },
    { stepNumber: 46, ownerType: 'client' },
  ],
};
const task = (over = {}) => ({ status: 'active', currentStepNumber: 5, ...over });

test('a client-owned current step flags the client', () => {
  assert.equal(markAwaitingClient(task({ currentStepNumber: 17 }), DEF).awaitingClient, true);
});

test('a team-owned step does not', () => {
  assert.equal(markAwaitingClient(task({ currentStepNumber: 5 }), DEF).awaitingClient, false);
});

test('only ACTIVE matters can await the client', () => {
  for (const status of ['completed', 'cancelled', 'pending', 'on_hold', 'archived', 'rejected']) {
    assert.equal(
      markAwaitingClient(task({ status, currentStepNumber: 17 }), DEF).awaitingClient,
      false,
      `${status} matters never await the client`,
    );
  }
});

test('a #139 hidden-step fallback is never flagged', () => {
  // currentStepNumber points at the last VISIBLE step, not the real one, so the
  // client is not genuinely the blocker even if that visible step is theirs.
  const t = task({ currentStepNumber: 17, currentStepFallback: true });
  assert.equal(markAwaitingClient(t, DEF).awaitingClient, false);
});

test('a missing definition means unknown, never a wrong "needs you"', () => {
  assert.equal(markAwaitingClient(task({ currentStepNumber: 17 }), null).awaitingClient, false);
  assert.equal(markAwaitingClient(task({ currentStepNumber: 17 }), {}).awaitingClient, false);
  assert.equal(markAwaitingClient(task({ currentStepNumber: 17 }), { steps: [] }).awaitingClient, false);
});

test('a step number absent from the definition is not flagged', () => {
  assert.equal(markAwaitingClient(task({ currentStepNumber: 999 }), DEF).awaitingClient, false);
});

test('the rule matches on step NUMBER identity, not array position', () => {
  // Step 17 is the SECOND element but its identity is 17. Matching by index
  // would flag the wrong step — the #117/#55 bug family.
  assert.equal(markAwaitingClient(task({ currentStepNumber: 17 }), DEF).awaitingClient, true);
  assert.equal(markAwaitingClient(task({ currentStepNumber: 1 }), DEF).awaitingClient, false,
    'there is no step 1 — array position 1 is step 17, which IS client-owned');
});

test('the original task is not mutated', () => {
  const t = task({ currentStepNumber: 17 });
  const out = markAwaitingClient(t, DEF);
  assert.equal('awaitingClient' in t, false, 'input untouched');
  assert.equal(out.awaitingClient, true);
  assert.equal(out.currentStepNumber, 17, 'other fields carried through');
});

test('every route into client ownership is honoured', () => {
  const t = (n) => ({ status: 'active', currentStepNumber: n });
  // explicit ownerType
  assert.equal(markAwaitingClient(t(46), DEF).awaitingClient, true, 'explicit ownerType');
  // a CLIENT_APPROVE transition
  assert.equal(markAwaitingClient(t(17), DEF).awaitingClient, true, 'CLIENT_APPROVE transition');
  // a payment gate is the client's to clear
  const gate = { steps: [{ stepNumber: 9, type: 'payment_gate' }] };
  assert.equal(markAwaitingClient(t(9), gate).awaitingClient, true, 'payment_gate');
  // a GOVT step is NOT the client
  assert.equal(markAwaitingClient(t(31), DEF).awaitingClient, false, 'govt is not client');
});
