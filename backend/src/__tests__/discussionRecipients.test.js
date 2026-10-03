/**
 * LT #200 — who is told when a CLIENT posts in a matter's discussion:
 * the matter's owner + everyone on its current step; the admins if nobody.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  candidateUids, resolveClientMessageRecipients, stepAssignees,
} from '../services/discussionRecipients.service.js';

const USERS = {
  owner: { name: 'Owner', email: 'owner@firm.test', role: 'manager' },
  s1: { name: 'Step One', email: 's1@firm.test', role: 'team_member' },
  s2: { fullName: 'Step Two', emailIds: ['s2@firm.test'], role: 'team_member' },
  gone: { name: 'Left', email: 'left@firm.test', role: 'team_member', status: 'deactivated' },
  admin1: { name: 'Admin One', email: 'a1@firm.test', role: 'admin' },
  admin2: { name: 'Admin Two', email: 'a2@firm.test', role: 'admin' },
  adminOff: { name: 'Admin Off', email: 'a3@firm.test', role: 'admin', status: 'deactivated' },
  client: { name: 'The Client', email: 'c@x.test', role: 'client' },
};

/** A fake Firestore with users, and one step document for task "t1". */
function fakeDb({ step, users = USERS, failStep = false } = {}) {
  const calls = { adminQuery: 0 };
  const userDoc = (uid) => ({ get: async () => ({ exists: !!users[uid], id: uid, data: () => users[uid] }) });
  return {
    calls,
    collection: (name) => {
      if (name === 'users') {
        return {
          doc: userDoc,
          where: () => ({
            get: async () => {
              calls.adminQuery += 1;
              return { docs: Object.entries(users).filter(([, u]) => u.role === 'admin').map(([id, u]) => ({ id, data: () => u })) };
            },
          }),
        };
      }
      return {
        doc: () => ({ collection: () => ({ doc: () => ({ get: async () => {
          if (failStep) throw new Error('boom');
          return { exists: !!step, data: () => step };
        } }) }) }),
      };
    },
  };
}

test('stepAssignees reads everyone on a shared step, else the single assignee', () => {
  assert.deepEqual(stepAssignees({ assignedTo: 'a', assignedToUids: ['a', 'b'] }), ['a', 'b']);
  assert.deepEqual(stepAssignees({ assignedTo: 'a' }), ['a']);
  assert.deepEqual(stepAssignees({ assignedToUids: [] }), []);
  assert.deepEqual(stepAssignees(null), []);
});

test('candidateUids is owner + step assignees, unique, without the author', () => {
  assert.deepEqual(candidateUids({ assignedTo: 'o' }, { assignedToUids: ['o', 'a', 'b'] }, 'b'), ['o', 'a']);
  assert.deepEqual(candidateUids({}, null, 'x'), []);
});

test('owner and every assignee of the current step are told, once each', async () => {
  const db = fakeDb({ step: { assignedTo: 's1', assignedToUids: ['s1', 's2', 'owner'] } });
  const { recipients, fallback } = await resolveClientMessageRecipients(db, { id: 't1', assignedTo: 'owner', currentStepNumber: 3 }, 'client');
  assert.equal(fallback, false);
  assert.deepEqual(recipients.map((r) => r.uid), ['owner', 's1', 's2']);
  assert.equal(recipients[2].email, 's2@firm.test', 'falls back to the first additional email');
  assert.equal(recipients[2].name, 'Step Two');
  assert.equal(db.calls.adminQuery, 0, 'admins are not read when someone owns the work');
});

test('a step assignee is told even when the matter has no owner', async () => {
  const db = fakeDb({ step: { assignedTo: 's1' } });
  const { recipients, fallback } = await resolveClientMessageRecipients(db, { id: 't1', currentStepNumber: 1 }, 'client');
  assert.deepEqual(recipients.map((r) => r.uid), ['s1']);
  assert.equal(fallback, false);
});

test('nobody owns the matter or the step: the active admins are told', async () => {
  const db = fakeDb({ step: {} });
  const { recipients, fallback } = await resolveClientMessageRecipients(db, { id: 't1', currentStepNumber: 1 }, 'client');
  assert.equal(fallback, true);
  assert.deepEqual(recipients.map((r) => r.uid).sort(), ['admin1', 'admin2']);
});

test('a deactivated, removed or non-staff assignee is not told; if that leaves nobody, admins are', async () => {
  const db = fakeDb({ step: { assignedToUids: ['gone', 'ghost', 'client'] } });
  const { recipients, fallback } = await resolveClientMessageRecipients(db, { id: 't1', assignedTo: 'gone', currentStepNumber: 1 }, 'x');
  assert.equal(fallback, true);
  assert.deepEqual(recipients.map((r) => r.uid).sort(), ['admin1', 'admin2']);

  const mixed = fakeDb({ step: { assignedToUids: ['gone', 's1'] } });
  const r2 = await resolveClientMessageRecipients(mixed, { id: 't1', currentStepNumber: 1 }, 'x');
  assert.deepEqual(r2.recipients.map((r) => r.uid), ['s1']);
  assert.equal(r2.fallback, false);
});

test('a matter with no current step, or a failed step read, still reaches the owner', async () => {
  const noStep = await resolveClientMessageRecipients(fakeDb(), { id: 't1', assignedTo: 'owner' }, 'client');
  assert.deepEqual(noStep.recipients.map((r) => r.uid), ['owner']);
  const failed = await resolveClientMessageRecipients(fakeDb({ failStep: true }), { id: 't1', assignedTo: 'owner', currentStepNumber: 2 }, 'client');
  assert.deepEqual(failed.recipients.map((r) => r.uid), ['owner']);
});
