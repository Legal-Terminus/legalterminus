import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deletionRequestSchema } from '../schemas/accountDeletion.schema.js';
import { ACCOUNT_DELETION_ROLES, VALID_ROLES } from '../config/roles.js';
import { requestDeletion, DELETION_REQUESTED_STATUS } from '../services/accountDeletion.service.js';

// E29-S08 — a person asks for their own account to be deleted.

test('deletion request body: only an optional reason, at most 500 characters', () => {
  assert.deepEqual(deletionRequestSchema.parse({}), {});
  assert.equal(deletionRequestSchema.parse({ reason: '  moving firms  ' }).reason, 'moving firms');
  assert.throws(() => deletionRequestSchema.parse({ reason: 'x'.repeat(501) }));
  // The account is the token's: a body can never name another one.
  assert.throws(() => deletionRequestSchema.parse({ uid: 'someone-else' }));
  assert.throws(() => deletionRequestSchema.parse({ reason: 'x', userId: 'someone-else' }));
});

test('every role but admin may ask; admin may not (a lone admin must not lock the firm out)', () => {
  assert.equal(ACCOUNT_DELETION_ROLES.includes('admin'), false);
  for (const role of VALID_ROLES.filter((r) => r !== 'admin')) {
    assert.ok(ACCOUNT_DELETION_ROLES.includes(role), `${role} must be able to ask`);
  }
});

/** A Firestore stand-in: one users collection, transactions run inline. */
function fakeDb(users) {
  const docs = new Map(Object.entries(users));
  const ref = (id) => ({
    id,
    get: async () => ({ exists: docs.has(id), data: () => docs.get(id) }),
  });
  return {
    docs,
    collection: () => ({
      doc: ref,
      where: (field, _op, value) => ({
        get: async () => ({
          docs: [...docs.entries()].filter(([, d]) => d[field] === value).map(([id, d]) => ({ id, data: () => d })),
        }),
      }),
    }),
    runTransaction: async (fn) => fn({
      get: (r) => r.get(),
      set: (r, data) => { docs.set(r.id, { ...(docs.get(r.id) ?? {}), ...data }); },
    }),
  };
}

const fakeAuth = () => {
  const calls = [];
  return {
    calls,
    updateUser: async (uid, data) => { calls.push(['updateUser', uid, data]); },
    revokeRefreshTokens: async (uid) => { calls.push(['revoke', uid]); },
  };
};
const quietLog = { info() {}, warn() {}, error() {} };

test('a request marks the profile, disables sign-in and emails the admins once', async () => {
  const db = fakeDb({
    c1: { role: 'client', name: 'Asha Rao', email: 'asha@client.test' },
    a1: { role: 'admin', email: 'admin@firm.test' },
    a2: { role: 'admin', email: 'partner@firm.test' },
  });
  const auth = fakeAuth();
  const sent = [];
  const notify = async (m) => { sent.push(m); return true; };
  const now = () => '2026-11-11T10:00:00.000Z';

  const first = await requestDeletion({ db, auth, uid: 'c1', reason: 'closing my company', log: quietLog, now, notify });
  assert.equal(first.alreadyRequested, false);
  const profile = db.docs.get('c1');
  assert.equal(profile.deletionRequestedAt, '2026-11-11T10:00:00.000Z');
  assert.equal(profile.deletionReason, 'closing my company');
  assert.equal(profile.status, DELETION_REQUESTED_STATUS);
  assert.equal(profile.name, 'Asha Rao', 'the record is kept, only marked');
  assert.deepEqual(auth.calls, [['updateUser', 'c1', { disabled: true }], ['revoke', 'c1']]);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'admin@firm.test,partner@firm.test');
  assert.match(sent[0].message, /Asha Rao/);
  assert.match(sent[0].message, /closing my company/);

  // A second request: still 'disabled', no second email, the first date kept.
  const second = await requestDeletion({ db, auth, uid: 'c1', log: quietLog, now: () => 'later', notify });
  assert.equal(second.alreadyRequested, true);
  assert.equal(sent.length, 1);
  assert.equal(db.docs.get('c1').deletionRequestedAt, '2026-11-11T10:00:00.000Z');
});

test('a failed email does not fail the request', async () => {
  const db = fakeDb({ c1: { role: 'client', email: 'c@client.test' }, a1: { role: 'admin', email: 'a@firm.test' } });
  const result = await requestDeletion({
    db, auth: fakeAuth(), uid: 'c1', log: quietLog, notify: async () => { throw new Error('smtp down'); },
  });
  assert.equal(result.alreadyRequested, false);
  assert.equal(db.docs.get('c1').status, DELETION_REQUESTED_STATUS);
});
