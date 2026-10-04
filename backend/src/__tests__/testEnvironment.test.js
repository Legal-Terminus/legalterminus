/**
 * E24-S00 — a test environment that shares production's sign-in accounts must
 * refuse real accounts. Outside one, the guard does nothing.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertAllowedAccountEmail, isAllowedAccountEmail, isTestAddress, isTestEnvironment,
} from '../config/testEnvironment.js';

const prev = process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
test.afterEach(() => {
  if (prev === undefined) delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  else process.env.TEST_ACCOUNT_EMAIL_DOMAINS = prev;
});

test('production (variable unset): real accounts are allowed, test accounts are refused', () => {
  delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  assert.equal(isTestEnvironment(), false);
  assert.equal(isAllowedAccountEmail('owner@realclient.com'), true);
  assert.equal(isAllowedAccountEmail('admin@legalterminus.com'), true);
  assert.doesNotThrow(() => assertAllowedAccountEmail('owner@realclient.com'));
  // A QA account carries an admin claim on the SHARED sign-in system.
  assert.equal(isAllowedAccountEmail('qa-admin@legalterminus.test'), false);
  assert.equal(isAllowedAccountEmail('someone@anything.test'), false);
  assert.throws(() => assertAllowedAccountEmail('qa-admin@legalterminus.test'), (e) => e.status === 403 && e.code === 'TEST_ACCOUNT');
  // Only the reserved domain itself — not a real domain that happens to contain the word.
  assert.equal(isAllowedAccountEmail('person@contest.com'), true);
  assert.equal(isAllowedAccountEmail('person@test.com'), true);
  assert.equal(isAllowedAccountEmail('person@mytest'), true);
  assert.equal(isTestAddress('a@b.TEST'), true);
});

test('test environment: only the listed domains may be used', () => {
  process.env.TEST_ACCOUNT_EMAIL_DOMAINS = ' legalterminus.test , Example.TEST ';
  assert.equal(isTestEnvironment(), true);
  assert.equal(isAllowedAccountEmail('e2e-admin@legalterminus.test'), true);
  assert.equal(isAllowedAccountEmail('Someone@EXAMPLE.test'), true);
  assert.equal(isAllowedAccountEmail('owner@realclient.com'), false);
  assert.equal(isAllowedAccountEmail('admin@legalterminus.com'), false, 'the firm’s real domain is not the test domain');
  assert.equal(isAllowedAccountEmail('x@evil-legalterminus.test.com'), false);
  assert.equal(isAllowedAccountEmail(''), false);
  assert.equal(isAllowedAccountEmail(null), false, 'an account with no email is refused, not waved through');
});

test('assertAllowedAccountEmail throws a 403 the handlers can surface', () => {
  process.env.TEST_ACCOUNT_EMAIL_DOMAINS = 'legalterminus.test';
  assert.throws(() => assertAllowedAccountEmail('owner@realclient.com'), (e) => e.status === 403 && e.code === 'TEST_ENVIRONMENT');
});
