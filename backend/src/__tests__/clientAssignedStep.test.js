/**
 * #204 — a step whose "Who does this?" is "The client".
 *
 * The editor stores that choice as the CLIENT_ASSIGNEE sentinel, not as
 * `ownerType`, so ownership derivation used to read such a step as the team's:
 * the client saw it with no Submit, and the team got the button. These pin the
 * rule every reader now shares.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CLIENT_ASSIGNEE, deriveOwnerType, isClientAssignedStep,
} from '../../../shared/workflows/definitionSchema.js';

const splitIntoOptions = {
  stepNumber: 46,
  type: 'branch',
  transitions: [{ event: 'BRANCH_DECISION', to: 6, branch: 'Submit' }],
};

test('a "Split into options" step assigned to the client is the client\'s', () => {
  const step = { ...splitIntoOptions, defaultAssigneeUid: CLIENT_ASSIGNEE };
  assert.equal(isClientAssignedStep(step), true);
  assert.equal(deriveOwnerType(step), 'client');
});

test('a plain step assigned to the client is the client\'s', () => {
  const step = { stepNumber: 2, type: 'step', defaultAssigneeUid: CLIENT_ASSIGNEE,
    transitions: [{ event: 'COMPLETE_STEP', to: 3 }] };
  assert.equal(deriveOwnerType(step), 'client');
});

test('the client in a multi-assignee list counts too', () => {
  const step = { ...splitIntoOptions, defaultAssigneeUids: ['staff-1', CLIENT_ASSIGNEE] };
  assert.equal(isClientAssignedStep(step), true);
});

test('the same step with no client assignee stays the team\'s', () => {
  assert.equal(isClientAssignedStep(splitIntoOptions), false);
  assert.equal(deriveOwnerType(splitIntoOptions), 'team');
  assert.equal(deriveOwnerType({ ...splitIntoOptions, defaultAssigneeUid: 'staff-1' }), 'team');
});

test('an explicit ownerType still wins', () => {
  const step = { ...splitIntoOptions, defaultAssigneeUid: CLIENT_ASSIGNEE, ownerType: 'govt' };
  assert.equal(deriveOwnerType(step), 'govt');
});
