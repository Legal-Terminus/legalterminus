/**
 * LT #205 — the Client Database: the per-field merge (database value over the
 * client's profile), who has a row, the search, and the save schema.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLIENT_DATABASE_FIELDS, isDatabaseClient, profileDefaults, mergeRecord,
  matchesSearch, sortRows, toDateOnly,
} from '../services/clientDatabase.service.js';
import { clientDatabaseUpdateSchema, clientDatabaseListQuerySchema } from '../schemas/clientDatabase.schema.js';

const profile = {
  role: 'client',
  name: 'Ravi Kumar',
  organisation: 'Acme Pvt Ltd',
  email: 'ravi@acme.test',
  emailIds: ['ravi@acme.test', 'accounts@acme.test', 'cfo@acme.test'],
  phone: '9876543210',
  altPhone: '9123456780',
  contactDesignation: 'Director',
  address: '12 MG Road, Pune',
  state: 'Maharashtra',
  createdAt: '2025-06-01T20:00:00.000Z', // 2 June in India
};

test('the profile gives every field its starting value', () => {
  assert.deepEqual(profileDefaults(profile), {
    clientName: 'Acme Pvt Ltd',
    contactPerson: 'Ravi Kumar',
    contactDesignation: 'Director',
    phone: '9876543210',
    altPhone: '9123456780',
    email: 'ravi@acme.test',
    altEmail: 'accounts@acme.test, cfo@acme.test',
    address: '12 MG Road, Pune, Maharashtra',
    clientSince: '2025-06-02',
  });
});

test('a client with no organisation is named after the person; missing fields are empty', () => {
  const d = profileDefaults({ role: 'client', name: 'Asha', email: 'a@x.test' });
  assert.equal(d.clientName, 'Asha');
  assert.equal(d.contactPerson, 'Asha');
  for (const f of ['contactDesignation', 'phone', 'altPhone', 'altEmail', 'address', 'clientSince']) {
    assert.equal(d[f], '', f);
  }
});

test('the merge: a saved value wins, a never-saved field falls back to the profile', () => {
  const row = mergeRecord('u1', profile, {
    email: 'billing@acme.test', contactDesignation: 'Owner', altPhone: '', updatedAt: '2026-10-29T00:00:00.000Z',
  });
  assert.equal(row.uid, 'u1');
  assert.equal(row.email, 'billing@acme.test', 'database value over the profile');
  assert.equal(row.contactDesignation, 'Owner');
  assert.equal(row.altPhone, '', 'a saved empty string is a deliberate clear, not a fallback');
  assert.equal(row.phone, '9876543210', 'never saved → the profile');
  assert.equal(row.clientSince, '2025-06-02');
  assert.equal(row.updatedAt, '2026-10-29T00:00:00.000Z');
  assert.deepEqual(Object.keys(row).filter((k) => CLIENT_DATABASE_FIELDS.includes(k)), CLIENT_DATABASE_FIELDS);
});

test('the merge with no saved record is the profile, and never mutates it', () => {
  const before = JSON.stringify(profile);
  const row = mergeRecord('u1', profile, null);
  assert.equal(row.email, profile.email);
  assert.equal(row.updatedAt, null);
  assert.equal(JSON.stringify(profile), before);
});

test('one row per primary, active client — not additional logins, staff or deactivated', () => {
  assert.equal(isDatabaseClient(profile), true);
  assert.equal(isDatabaseClient({ ...profile, primaryClientUid: 'u1' }), false, '#166 additional login');
  assert.equal(isDatabaseClient({ ...profile, status: 'deactivated' }), false);
  assert.equal(isDatabaseClient({ ...profile, role: 'manager' }), false);
  assert.equal(isDatabaseClient(null), false);
});

test('Client Since accepts Timestamps, Dates and plain dates', () => {
  assert.equal(toDateOnly({ toDate: () => new Date('2024-01-31T19:00:00Z') }), '2024-02-01');
  assert.equal(toDateOnly(new Date('2024-01-31T10:00:00Z')), '2024-01-31');
  assert.equal(toDateOnly('2023-05-04'), '2023-05-04');
  assert.equal(toDateOnly('nonsense'), '');
  assert.equal(toDateOnly(null), '');
});

test('search covers name, organisation, email and phone digits', () => {
  const row = mergeRecord('u1', profile, { clientName: 'Acme Group' });
  assert.equal(matchesSearch(row, profile, ''), true);
  assert.equal(matchesSearch(row, profile, 'acme group'), true);
  assert.equal(matchesSearch(row, profile, 'Acme Pvt'), true, 'the profile organisation still finds it');
  assert.equal(matchesSearch(row, profile, 'ravi'), true);
  assert.equal(matchesSearch(row, profile, 'cfo@'), true);
  assert.equal(matchesSearch(row, profile, '98765 43210'), true);
  assert.equal(matchesSearch(row, profile, 'zebra'), false);
});

test('rows sort by client name, ignoring case', () => {
  const rows = sortRows([{ uid: 'b', clientName: 'beta' }, { uid: 'a', clientName: 'Alpha' }, { uid: 'c', clientName: 'alpha' }]);
  assert.deepEqual(rows.map((r) => r.uid), ['a', 'c', 'b']);
});

test('the schema accepts the nine fields with valid formats', () => {
  const out = clientDatabaseUpdateSchema.parse({
    clientName: '  Acme <b>Pvt</b> Ltd ',
    contactPerson: 'Ravi',
    contactDesignation: 'Accountant',
    phone: '+91 98765 43210',
    altPhone: '',
    email: 'Ravi@Acme.test',
    altEmail: 'a@acme.test,  B@acme.test ',
    address: '12 MG Road',
    clientSince: '2024-02-29',
  });
  assert.equal(out.clientName, 'Acme Pvt Ltd', 'tags stripped');
  assert.equal(out.email, 'ravi@acme.test');
  assert.equal(out.altEmail, 'a@acme.test, b@acme.test');
  assert.equal(out.altPhone, '');
  assert.deepEqual(clientDatabaseUpdateSchema.parse({}), {});
});

test('the schema rejects bad values and unknown fields', () => {
  const bad = (body) => assert.equal(clientDatabaseUpdateSchema.safeParse(body).success, false, JSON.stringify(body));
  bad({ contactDesignation: 'Chief Wizard' });
  bad({ contactDesignation: 'owner' });
  bad({ phone: 'call me' });
  bad({ altPhone: '12' });
  bad({ email: 'not-an-email' });
  bad({ altEmail: 'a@acme.test, nope' });
  bad({ clientSince: '2023-02-30' });
  bad({ clientSince: '01/02/2023' });
  bad({ clientName: '' });
  bad({ clientName: '<i></i>' });
  bad({ role: 'admin' });
  bad({ groupCompany: 'X' });
});

test('the list query is bounded', () => {
  assert.equal(clientDatabaseListQuerySchema.parse({}).limit, 25);
  assert.equal(clientDatabaseListQuerySchema.parse({ limit: '100', search: ' acme ' }).search, 'acme');
  assert.equal(clientDatabaseListQuerySchema.safeParse({ limit: '500' }).success, false);
});
