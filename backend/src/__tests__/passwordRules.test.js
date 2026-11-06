import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as shared from '../../../shared/auth/passwordRules.js';
import * as website from '../../../Frontend/src/utils/passwordRules.js';
import { termsAcceptanceFields } from '../services/termsAcceptance.js';

/** #35 — the password rules, and the website's copy of them. */

const SAMPLES = [
  '', 'short1!A', 'abcdefgh', 'ABCDEFGH', 'Abcdefgh', 'Abcdefg1', 'Abcdefg!', 'abcdefg1!',
  'ABCDEFG1!', 'Abcdef1!', 'Abc 1!', 'Abcdefg1 ', 'Pässwörd1!', 'Abcdefg1_', 'A'.repeat(127) + 'a1!',
];

test('a password needs 8 characters, upper, lower, a number and a special character', () => {
  assert.equal(shared.isStrongPassword('Abcdef1!'), true);
  assert.equal(shared.isStrongPassword('Abcdefg1_'), true, 'underscore counts as special');
  assert.equal(shared.isStrongPassword('Abcde1!'), false, '7 characters');
  assert.equal(shared.isStrongPassword('abcdef1!'), false, 'no uppercase');
  assert.equal(shared.isStrongPassword('ABCDEF1!'), false, 'no lowercase');
  assert.equal(shared.isStrongPassword('Abcdefg!'), false, 'no number');
  assert.equal(shared.isStrongPassword('Abcdefg1'), false, 'no special character');
  assert.equal(shared.isStrongPassword('Abcdefg1 '), false, 'a space is not a special character');
  assert.equal(shared.isStrongPassword(undefined), false);
});

test('a password over the maximum is refused', () => {
  const long = 'Aa1!' + 'x'.repeat(shared.PASSWORD_MAX_LENGTH);
  assert.equal(shared.isStrongPassword(long), false);
});

test('checkPassword lists each rule in order with whether it is met', () => {
  assert.deepEqual(
    shared.checkPassword('abc').map((r) => [r.id, r.met]),
    [['length', false], ['upper', false], ['lower', true], ['number', false], ['special', false]],
  );
});

test("the website's copy of the rules matches the shared rules", () => {
  assert.equal(website.PASSWORD_MIN_LENGTH, shared.PASSWORD_MIN_LENGTH);
  assert.equal(website.PASSWORD_MAX_LENGTH, shared.PASSWORD_MAX_LENGTH);
  assert.equal(website.PASSWORD_RULES_MESSAGE, shared.PASSWORD_RULES_MESSAGE);
  assert.deepEqual(website.PASSWORD_RULES.map((r) => [r.id, r.label]), shared.PASSWORD_RULES.map((r) => [r.id, r.label]));
  for (const pw of SAMPLES) {
    assert.deepEqual(website.checkPassword(pw), shared.checkPassword(pw), pw);
    assert.equal(website.isStrongPassword(pw), shared.isStrongPassword(pw), pw);
  }
});

test('terms: the first agreement is recorded, a later one does not move it', () => {
  const now = '2026-11-06T10:00:00.000Z';
  assert.deepEqual(termsAcceptanceFields({ termsAccepted: true }, null, now), { termsAcceptedAt: now });
  assert.deepEqual(termsAcceptanceFields({ termsAccepted: true }, { email: 'a@b.c' }, now), { termsAcceptedAt: now });
  assert.deepEqual(termsAcceptanceFields({ termsAccepted: true }, { termsAcceptedAt: '2026-01-01T00:00:00.000Z' }, now), {});
});

test('terms: nothing is recorded without an explicit true', () => {
  for (const body of [{}, null, { termsAccepted: 'true' }, { termsAccepted: 1 }, { termsAccepted: false }]) {
    assert.deepEqual(termsAcceptanceFields(body, null, 'x'), {});
  }
});
