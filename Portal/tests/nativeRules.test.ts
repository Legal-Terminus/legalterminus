// Unit tests for the app-only rules (E29). Plain Node runs TypeScript directly
// (type stripping), so `npm test` needs no test framework: node --test tests/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountLinkPath, appleFullName, appleSignInMessage, showAppleSignIn } from '../src/lib/nativeRules.ts';

test('E29-S07: an emailed account link lands on the action page with its query intact', () => {
  assert.equal(
    accountLinkPath('https://legal-terminus-qa.web.app/portal/account/action?mode=signIn&oobCode=abc'),
    '/account/action?mode=signIn&oobCode=abc',
  );
  assert.equal(accountLinkPath('https://legalterminus.com/portal/account/action'), '/account/action');
});

test('E29-S07: every other link the system hands the app is ignored', () => {
  for (const raw of [
    'https://legalterminus.com/portal/tasks/123',
    'https://legalterminus.com/account/action?mode=signIn',
    'https://legalterminus.com/portal/account/actionX',
    'http://legalterminus.com/portal/account/action?mode=signIn',
    'capacitor://localhost/portal/account/action',
    'not a url',
    '',
  ]) assert.equal(accountLinkPath(raw), null, raw);
});

test('E29-S11 / D6: Apple sign-in shows on iOS always, never on Android, on the web only when switched on', () => {
  assert.equal(showAppleSignIn('ios', undefined), true);
  assert.equal(showAppleSignIn('ios', 'false'), true);
  assert.equal(showAppleSignIn('android', 'true'), false);
  assert.equal(showAppleSignIn('web', undefined), false);
  assert.equal(showAppleSignIn('web', 'true'), true);
  assert.equal(showAppleSignIn('web', 'TRUE'), false);
});

test('E29-S11: Apple sign-in errors read as sentences, never codes', () => {
  assert.equal(appleSignInMessage('auth/cancelled-popup-request'), null);
  assert.match(appleSignInMessage('auth/user-cancelled') ?? '', /closed before sign-in finished/);
  assert.match(appleSignInMessage('auth/account-exists-with-different-credential') ?? '', /already has an account/);
  assert.match(appleSignInMessage('auth/user-disabled') ?? '', /disabled/);
  for (const code of ['auth/internal-error', 'unknown']) {
    const msg = appleSignInMessage(code) ?? '';
    assert.doesNotMatch(msg, /auth\//);
    assert.match(msg, /did not complete/);
  }
});

test('E29-S11: the first-sign-in name from Apple, else the fallback, else nothing', () => {
  assert.equal(appleFullName({ name: { firstName: 'Asha', lastName: 'Rao' } }), 'Asha Rao');
  assert.equal(appleFullName({ name: { firstName: 'Asha' } }), 'Asha');
  assert.equal(appleFullName(null, ' Asha Rao '), 'Asha Rao');
  assert.equal(appleFullName({}, null), null);
  assert.equal(appleFullName(undefined, ''), null);
});
