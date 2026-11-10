import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clientDisplayName, clientRealName, syncClientNameOnMatters, afterClientProfileWrite,
} from '../services/clientName.service.js';

/**
 * #277 — a renamed client's matters kept the old name. `clientName` on a matter
 * is a copy of the profile's name; these pin down who refreshes it and how.
 */

/** A minimal Firestore stand-in: one `tasks` collection, equality `where`, batches. */
function fakeDb(tasks) {
  const docs = new Map(tasks.map((t) => [t.id, { ...t }]));
  const writes = [];
  let queries = 0;
  const refOf = (id) => ({ id });
  return {
    docs, writes,
    get queries() { return queries; },
    collection(name) {
      assert.equal(name, 'tasks');
      return {
        where(field, op, value) {
          assert.equal(op, '==');
          return {
            async get() {
              queries += 1;
              const hits = [...docs.values()].filter((d) => d[field] === value);
              return { docs: hits.map((d) => ({ id: d.id, ref: refOf(d.id), data: () => ({ ...d }) })) };
            },
          };
        },
      };
    },
    batch() {
      const pending = [];
      return {
        update(ref, patch) { pending.push([ref.id, patch]); },
        async commit() {
          for (const [id, patch] of pending) {
            Object.assign(docs.get(id), patch);
            writes.push([id, patch]);
          }
        },
      };
    },
  };
}

test('clientDisplayName uses the same rule matters were always created with', () => {
  assert.equal(clientDisplayName({ name: 'Asha Rao', fullName: 'Old', email: 'a@x.test' }), 'Asha Rao');
  assert.equal(clientDisplayName({ fullName: 'Asha Rao', email: 'a@x.test' }), 'Asha Rao');
  assert.equal(clientDisplayName({ email: 'a@x.test' }), 'a@x.test');
  assert.equal(clientDisplayName({}), 'Client');
  assert.equal(clientDisplayName(null), '');
});

test('a rename rewrites clientName on every matter the client owns, and only those', async () => {
  const db = fakeDb([
    { id: 'm1', clientUid: 'c1', clientName: 'Old Name', status: 'active', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 'm2', clientUid: 'c1', clientName: 'Old Name', status: 'completed', updatedAt: '2026-01-02T00:00:00.000Z' },
    // c1 is only an additional contact here (#188): the name on it is the OWNER's.
    { id: 'm3', clientUid: 'c2', clientName: 'Someone Else', ccEmails: ['c1@x.test'] },
  ]);
  const n = await syncClientNameOnMatters(db, 'c1', 'New Name');
  assert.equal(n, 2);
  assert.equal(db.docs.get('m1').clientName, 'New Name');
  assert.equal(db.docs.get('m2').clientName, 'New Name', 'completed matters are renamed too');
  assert.equal(db.docs.get('m3').clientName, 'Someone Else');
});

test('the sync writes ONLY clientName — updatedAt is untouched so the list order does not move', async () => {
  const db = fakeDb([{ id: 'm1', clientUid: 'c1', clientName: 'Old', updatedAt: '2026-01-01T00:00:00.000Z' }]);
  await syncClientNameOnMatters(db, 'c1', 'New');
  assert.deepEqual(db.writes, [['m1', { clientName: 'New' }]]);
  assert.equal(db.docs.get('m1').updatedAt, '2026-01-01T00:00:00.000Z');
});

test('the sync is idempotent: a matter already showing the name is not written again', async () => {
  const db = fakeDb([
    { id: 'm1', clientUid: 'c1', clientName: 'Same' },
    { id: 'm2', clientUid: 'c1', clientName: 'Stale' },
  ]);
  assert.equal(await syncClientNameOnMatters(db, 'c1', 'Same'), 1);
  assert.equal(await syncClientNameOnMatters(db, 'c1', 'Same'), 0);
  assert.deepEqual(db.writes, [['m2', { clientName: 'Same' }]]);
});

test('an empty name or a missing uid never blanks the matters', async () => {
  const db = fakeDb([{ id: 'm1', clientUid: 'c1', clientName: 'Kept' }]);
  assert.equal(await syncClientNameOnMatters(db, 'c1', '   '), 0);
  assert.equal(await syncClientNameOnMatters(db, '', 'X'), 0);
  assert.equal(db.docs.get('m1').clientName, 'Kept');
  assert.equal(db.queries, 0);
});

test('afterClientProfileWrite acts for clients only, and takes the name from the saved profile', async () => {
  const db = fakeDb([{ id: 'm1', clientUid: 'u1', clientName: 'Old' }]);
  assert.equal(await afterClientProfileWrite(db, 'u1', { role: 'manager', name: 'Staffer' }), 0);
  assert.equal(db.queries, 0, 'a staff rename does not even query matters');
  assert.equal(await afterClientProfileWrite(db, 'u1', { role: 'client', name: 'New', fullName: 'New' }), 1);
  assert.equal(db.docs.get('m1').clientName, 'New');
});

test('afterClientProfileWrite never throws — the profile save already succeeded', async () => {
  const broken = { collection() { throw new Error('firestore down'); } };
  assert.equal(await afterClientProfileWrite(broken, 'u1', { role: 'client', name: 'X' }), 0);
});

// #277 (follow-up): sign-in used to write the email over a client's name. The
// rename sync must never copy an email address onto the matters.
test('clientRealName is empty when the profile has no name or only an email', () => {
  assert.equal(clientRealName({ name: 'Asha Rao', email: 'a@x.test' }), 'Asha Rao');
  assert.equal(clientRealName({ name: 'a@x.test', fullName: 'a@x.test', email: 'a@x.test' }), '');
  assert.equal(clientRealName({ email: 'a@x.test' }), '');
  assert.equal(clientRealName(null), '');
});

test('a client whose name is an email address does not rename their matters', async () => {
  const db = fakeDb([{ id: 't1', clientUid: 'c1', clientName: 'Asha Rao' }]);
  const n = await afterClientProfileWrite(db, 'c1', { role: 'client', name: 'a@x.test', email: 'a@x.test' });
  assert.equal(n, 0);
  assert.equal(db.docs.get('t1').clientName, 'Asha Rao');
});
