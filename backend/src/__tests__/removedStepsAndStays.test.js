import test from 'node:test';
import assert from 'node:assert/strict';
import { isDeclaredStay, removedStepNumbers } from '../../../shared/workflows/definitionSchema.js';

// #215 (steps deleted from a service) and #214 (a loop back
// to the same step). Both rules are pure; the engine and the matter view use them.

const service = [
  { stepNumber: 1, title: 'Collect details', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 44 }] },
  {
    stepNumber: 44, title: 'Awaiting approval', type: 'step',
    transitions: [{ event: 'CLIENT_APPROVE', to: 45 }, { event: 'CLIENT_REJECT', to: 44 }],
  },
  { stepNumber: 45, title: 'Master sheet update', type: 'final' },
];

test('#215: a step deleted from the service, never started on the matter, is a removed step', () => {
  const rows = [
    { stepNumber: 1, status: 'completed' },
    { stepNumber: 44, status: 'active' },
    { stepNumber: 45, status: 'pending' },
    { stepNumber: 49, status: 'pending' }, // deleted from the service
    { stepNumber: 50 },                    // deleted; a record with no status is pending
  ];
  assert.deepEqual(removedStepNumbers(rows, service), [49, 50]);
});

test('#215: a deleted step the matter already worked on is history, and stays', () => {
  for (const status of ['completed', 'active', 'skipped', 'cancelled']) {
    assert.deepEqual(removedStepNumbers([{ stepNumber: 49, status }], service), [], status);
  }
});

test('#215: nothing is removed when the service is unchanged, or has no steps to compare', () => {
  const rows = service.map((s) => ({ stepNumber: s.stepNumber, status: 'pending' }));
  assert.deepEqual(removedStepNumbers(rows, service), []);
  assert.deepEqual(removedStepNumbers([], service), []);
  assert.deepEqual(removedStepNumbers(undefined, service), []);
});

test('#214: a loop the service declares back to the same step is a valid move', () => {
  assert.equal(isDeclaredStay(service, 44, 'CLIENT_REJECT'), true);
  // Moving on is not a stay; an event the step does not have is not either.
  assert.equal(isDeclaredStay(service, 44, 'CLIENT_APPROVE'), false);
  assert.equal(isDeclaredStay(service, 44, 'GOVT_REJECT'), false);
  assert.equal(isDeclaredStay(service, 1, 'COMPLETE_STEP'), false);
  assert.equal(isDeclaredStay(service, 99, 'CLIENT_REJECT'), false);
  assert.equal(isDeclaredStay(service, 44, undefined), false);
});
