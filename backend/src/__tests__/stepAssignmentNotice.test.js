/**
 * LT #293 — the team member assigned to a step must be told, every time.
 *
 * Root cause: a matter created with no payment (every GST return matter the
 * sweep opens) waits for admin approval, and approval told only the matter's
 * creator. The first step's assignee never got "New step assigned to you".
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { stepAssignmentRecipients, announceStepAssignment } from '../services/stepAssignmentNotice.service.js';

const here = dirname(fileURLToPath(import.meta.url));

/** Records every notification instead of writing one. */
function fakeDeps() {
  const sent = [];
  return {
    sent,
    deps: {
      createNotification: async (n) => { sent.push(n); return 'id'; },
      renderTemplate: async (key, vars) => (key === 'step_assigned'
        ? { subject: 'New step assigned to you', body: `${vars.clientName} · ${vars.serviceName}: ${vars.stepName}` }
        : null),
      logger: { warn: () => {} },
    },
  };
}

/** A fake Firestore holding one step document. */
const fakeDb = (step) => ({
  collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ({
    get: async () => ({ exists: !!step, data: () => step }),
  }) }) }) }),
});

test('every staff assignee of a shared step is told, never the client', () => {
  const uids = stepAssignmentRecipients({ assignedTo: 'a', assignedToUids: ['a', 'b', 'client1'] }, { clientUid: 'client1' });
  assert.deepEqual(uids, ['a', 'b']);
});

test('the primary-only shape (pre-#192 steps) still works', () => {
  assert.deepEqual(stepAssignmentRecipients({ assignedTo: 'a' }), ['a']);
});

test('nobody on the step: the matter owner is told — unless it is the client\'s step', () => {
  assert.deepEqual(stepAssignmentRecipients({}, { ownerUid: 'owner' }), ['owner']);
  assert.deepEqual(stepAssignmentRecipients(null, { ownerUid: 'owner' }), ['owner']);
  assert.deepEqual(stepAssignmentRecipients({ assignedTo: 'client1' }, { clientUid: 'client1', ownerUid: 'owner', clientOwned: true }), []);
});

test('the person who caused it and system actors are never told', () => {
  assert.deepEqual(stepAssignmentRecipients({ assignedToUids: ['me', 'you'] }, { actorUid: 'me' }), ['you']);
  assert.deepEqual(stepAssignmentRecipients({}, { ownerUid: 'system:gst-returns' }), []);
});

test('#293: approving a no-payment GST matter emails the first step\'s team member', async () => {
  const { sent, deps } = fakeDeps();
  const task = { clientUid: 'client1', clientName: 'Acme', serviceName: 'GST Return - October 2026', assignedTo: null, createdBy: 'system:gst-returns' };
  const told = await announceStepAssignment(fakeDb({ title: 'Prepare GSTR-1', assignedTo: 'gstTeam', assignedToUids: ['gstTeam'] }), {
    taskId: 't1', task, stepNumber: 1, actorUid: 'admin1',
  }, deps);
  assert.deepEqual(told, ['gstTeam']);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].recipientUid, 'gstTeam');
  assert.equal(sent[0].title, 'New step assigned to you');
  assert.match(sent[0].message, /Acme · GST Return - October 2026: Prepare GSTR-1/);
  // createNotification mirrors to email unless told not to — the email IS the point.
  assert.equal(sent[0].email, undefined, 'must not pass email:false');
});

test('a transition\'s own copy is used when given', async () => {
  const { sent, deps } = fakeDeps();
  await announceStepAssignment(fakeDb(null), {
    taskId: 't1', task: { assignedTo: 'owner' }, stepNumber: 4, step: { assignedToUids: ['a', 'b'] },
    actorUid: 'x', title: 'Correction required', message: 'Fix it', type: 'warning',
  }, deps);
  assert.deepEqual(sent.map((n) => [n.recipientUid, n.title, n.type, n.stepNumber]),
    [['a', 'Correction required', 'warning', 4], ['b', 'Correction required', 'warning', 4]]);
});

test('a failing notification never throws out of the notice', async () => {
  const deps = {
    createNotification: async () => { throw new Error('boom'); },
    renderTemplate: async () => null,
    logger: { warn: () => {} },
  };
  const told = await announceStepAssignment(fakeDb({ assignedTo: 'a' }), { taskId: 't', task: {}, stepNumber: 1 }, deps);
  assert.deepEqual(told, []);
});

// Guard against the regression itself: approval, creation and transitions must
// all route through the one notice. Source-level, because these handlers only
// run against Firestore.
test('#293: approveTask, createTask and transitionTask all announce the step', () => {
  const src = readFileSync(join(here, '../controllers/tasks.controller.js'), 'utf8');
  const body = (name) => {
    const start = src.indexOf(`export async function ${name}(`);
    assert.ok(start >= 0, `${name} not found`);
    const next = src.indexOf('\nexport ', start + 10);
    return src.slice(start, next === -1 ? undefined : next);
  };
  for (const fn of ['approveTask', 'createTask', 'transitionTask']) {
    assert.match(body(fn), /announceStepAssignment\(/, `${fn} must call announceStepAssignment`);
  }
});
