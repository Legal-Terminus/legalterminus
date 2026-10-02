/**
 * #200 — @mention parsing. Mentions are read from the PLAIN text of a message
 * (the editor autolinks addresses, which the plain projection flattens).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMentionEmails, listMentionableStaff } from '../services/mentions.service.js';

test('finds @email mentions, lower-cased and de-duplicated', () => {
  assert.deepEqual(
    extractMentionEmails('@Asha@firm.com please check, and @ravi@firm.com too. cc @asha@FIRM.com'),
    ['asha@firm.com', 'ravi@firm.com'],
  );
});

test('an address written in a sentence is not a mention', () => {
  assert.deepEqual(extractMentionEmails('write to asha@firm.com about it'), []);
});

test('trailing punctuation is not part of the address', () => {
  assert.deepEqual(extractMentionEmails('Thanks (@asha@firm.com).'), ['asha@firm.com']);
  assert.deepEqual(extractMentionEmails('Over to @asha@firm.com.'), ['asha@firm.com']);
});

test('mentions are capped at 20', () => {
  const many = Array.from({ length: 30 }, (_, i) => `@u${i}@firm.com`).join(' ');
  assert.equal(extractMentionEmails(many).length, 20);
});

test('empty input yields nothing', () => {
  assert.deepEqual(extractMentionEmails(''), []);
  assert.deepEqual(extractMentionEmails(null), []);
});

// The firm's follow-up on #200: seeded test accounts appeared in the picker.
const staffDb = (users) => ({
  collection: () => ({ where: () => ({ get: async () => ({ docs: users.map((u) => ({ id: u.uid, data: () => u })) }) }) }),
});
const STAFF = [
  { uid: 'a', name: 'Zara Khan', email: 'zara@firm.test', role: 'team_member' },
  { uid: 'b', name: 'E2E Admin', email: 'e2e-admin@firm.test', role: 'admin', e2e: true },
  { uid: 'c', name: 'Asha Rao', email: 'asha@firm.test', role: 'manager' },
  { uid: 'd', name: 'Gone', email: 'gone@firm.test', role: 'team_member', status: 'deactivated' },
];

test('listMentionableStaff hides seeded test accounts from a real firm', async () => {
  const list = await listMentionableStaff(staffDb(STAFF), { includeTestAccounts: false });
  assert.deepEqual(list.map((u) => u.name), ['Asha Rao', 'Zara Khan']);
});

test('listMentionableStaff keeps them during a test run, and returns the whole team uncapped', async () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ uid: `u${i}`, name: `Person ${String(i).padStart(2, '0')}`, email: `p${i}@firm.test` }));
  assert.equal((await listMentionableStaff(staffDb(many), { includeTestAccounts: false })).length, 25);
  const withTests = await listMentionableStaff(staffDb(STAFF), { includeTestAccounts: true });
  assert.ok(withTests.some((u) => u.email === 'e2e-admin@firm.test'));
});
