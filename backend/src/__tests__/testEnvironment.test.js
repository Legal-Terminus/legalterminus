/**
 * E24-S00 — a test environment that shares production's sign-in accounts must
 * refuse real accounts. Outside one, the guard does nothing.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertAllowedAccountEmail, isAllowedAccountEmail, isTestEnvironment,
} from '../config/testEnvironment.js';

const prev = process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
test.afterEach(() => {
  if (prev === undefined) delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  else process.env.TEST_ACCOUNT_EMAIL_DOMAINS = prev;
});

test('production (variable unset): every account is allowed and nothing is guarded', () => {
  delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  assert.equal(isTestEnvironment(), false);
  assert.equal(isAllowedAccountEmail('owner@realclient.com'), true);
  assert.equal(isAllowedAccountEmail(undefined), true);
  assert.doesNotThrow(() => assertAllowedAccountEmail('owner@realclient.com'));
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
