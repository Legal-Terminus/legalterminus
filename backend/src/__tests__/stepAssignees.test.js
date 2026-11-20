/**
 * #192 (reopened 2026-11-18) — several assignees on one step.
 *
 * Root causes covered here:
 *  - the Service save schema did not list `defaultAssigneeUids`, and step objects
 *    are not strict, so every save from the workflow editor silently stripped the
 *    list back to one assignee;
 *  - the step-patch endpoint behind the matter screen's "Step owner" could only
 *    set ONE person, collapsing a shared step.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefinitionSchema, updateDefinitionSchema } from '../schemas/workflow.schema.js';
import { stepPatchSchema } from '../schemas/task.schema.js';
import {
  stepAssigneeList, reconcileStepAssignees, definitionAssigneeUids,
  requestedStepOwners, assertStaffOwners, assertNoClientAssignees,
} from '../services/stepAssignees.service.js';

const def = (step) => ({
  id: 'svc', name: 'Service', initialStep: 1,
  steps: [
    { stepNumber: 1, title: 'Shared work', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }], ...step },
    { stepNumber: 2, title: 'Done', type: 'final' },
  ],
});

test('saving a Service keeps every assignee of a step', () => {
  const step = { defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'b'] };
  assert.deepEqual(createDefinitionSchema.parse(def(step)).steps[0].defaultAssigneeUids, ['a', 'b']);
  const { id: _id, ...body } = def(step);
  assert.deepEqual(updateDefinitionSchema.parse(body).steps[0].defaultAssigneeUids, ['a', 'b']);
});

test('the list counts only while its first entry is the primary', () => {
  assert.deepEqual(stepAssigneeList({ defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'b', 'a'] }), ['a', 'b']);
  // A single-field writer changed the primary: that change wins, the stale list goes.
  assert.deepEqual(stepAssigneeList({ defaultAssigneeUid: 'c', defaultAssigneeUids: ['a', 'b'] }), ['c']);
  // …or cleared it ("Our team (anyone)" in an editor that did not know the list).
  assert.deepEqual(stepAssigneeList({ defaultAssigneeUids: ['a', 'b'] }), []);
  assert.deepEqual(stepAssigneeList({ defaultAssigneeUid: '__CLIENT__', defaultAssigneeUids: ['a', 'b'] }), ['__CLIENT__']);
  assert.deepEqual(stepAssigneeList({}), []);
});

test('reconcile stores a list only when it names more than one person', () => {
  assert.deepEqual(reconcileStepAssignees({ title: 'x', defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'b'] }),
    { title: 'x', defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'b'] });
  assert.deepEqual(reconcileStepAssignees({ title: 'x', defaultAssigneeUid: 'c', defaultAssigneeUids: ['a', 'b'] }),
    { title: 'x', defaultAssigneeUid: 'c' });
  assert.deepEqual(reconcileStepAssignees({ title: 'x', defaultAssigneeUid: 'a', defaultAssigneeUids: ['a'] }),
    { title: 'x', defaultAssigneeUid: 'a' });
  assert.deepEqual(definitionAssigneeUids([
    { defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'b'] },
    { defaultAssigneeUid: '__CLIENT__' },
    { defaultAssigneeUid: 'b' },
  ]), ['a', 'b']);
});

test('a step patch can set several owners; assignedTo alone still means one', () => {
  assert.deepEqual(requestedStepOwners({ assignedToUids: ['a', 'b', 'a', ''] }), ['a', 'b']);
  assert.deepEqual(requestedStepOwners({ assignedToUids: [] }), []);
  assert.deepEqual(requestedStepOwners({ assignedTo: 'a' }), ['a']);
  assert.deepEqual(requestedStepOwners({ assignedTo: null }), []);
  assert.equal(requestedStepOwners({ isUrgent: true }), undefined);
  // The list wins when both are sent.
  assert.deepEqual(requestedStepOwners({ assignedTo: 'z', assignedToUids: ['a', 'b'] }), ['a', 'b']);

  assert.equal(stepPatchSchema.safeParse({ assignedToUids: ['a', 'b'] }).success, true);
  assert.equal(stepPatchSchema.safeParse({ assignedTo: null }).success, true);
  assert.equal(stepPatchSchema.safeParse({ assignedToUids: Array.from({ length: 21 }, (_, i) => `u${i}`) }).success, false);
  assert.equal(stepPatchSchema.safeParse({ status: 'completed' }).success, false, 'unknown fields refused');
});

const fakeDb = (users) => ({
  collection: () => ({
    doc: (uid) => ({
      get: async () => ({ exists: uid in users, data: () => users[uid] }),
    }),
  }),
});
const STAFF = ['admin', 'manager', 'team_member'];

test('only staff may be given a step', async () => {
  const db = fakeDb({ a: { role: 'team_member' }, m: { role: 'manager' }, c: { role: 'client' }, p: { role: 'professional' } });
  await assertStaffOwners(db, ['a', 'm'], { staffRoles: STAFF });
  await assert.rejects(assertStaffOwners(db, ['a', 'c'], { staffRoles: STAFF }), { status: 400 });
  await assert.rejects(assertStaffOwners(db, ['p'], { staffRoles: STAFF }), { status: 400 });
  await assert.rejects(assertStaffOwners(db, ['ghost'], { staffRoles: STAFF }), { status: 400 });
});

test('a Service save refuses a client in a step list, but not a since-deleted member', async () => {
  const db = fakeDb({ a: { role: 'team_member' }, c: { role: 'client' } });
  await assertNoClientAssignees(db, [{ defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'ghost'] }]);
  await assert.rejects(
    assertNoClientAssignees(db, [{ defaultAssigneeUid: 'a', defaultAssigneeUids: ['a', 'c'] }]),
    { status: 400, message: /client/ },
  );
});
