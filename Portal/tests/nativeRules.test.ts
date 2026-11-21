// Unit tests for the app-only rules (E29). Plain Node runs TypeScript directly
// (type stripping), so `npm test` needs no test framework: node --test tests/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountLinkPath, appleFullName, appleSignInMessage, entryScriptOf, shouldReloadForUpdate, showAppleSignIn } from '../src/lib/nativeRules.ts';
import { isBusy, whileBusy } from '../src/lib/updateGuard.ts';

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

test('E29: the entry script is read from the Portal index.html', () => {
  assert.equal(entryScriptOf('<script type="module" crossorigin src="/portal/assets/index-Qjdh60Tg.js"></script>'), '/portal/assets/index-Qjdh60Tg.js');
  assert.equal(entryScriptOf('<script src="/gtm.js"></script>'), null);
  assert.equal(entryScriptOf(''), null);
});

test('E29: the app reloads for a new website version only when it is safe', () => {
  const base = { hiddenMs: 120_000, minHiddenMs: 60_000, current: '/portal/assets/index-a.js', latest: '/portal/assets/index-b.js', busy: false, editing: false };
  assert.equal(shouldReloadForUpdate(base), true);
  assert.equal(shouldReloadForUpdate({ ...base, latest: base.current }), false, 'same version');
  assert.equal(shouldReloadForUpdate({ ...base, hiddenMs: 5_000 }), false, 'a quick app switch');
  assert.equal(shouldReloadForUpdate({ ...base, busy: true }), false, 'an upload is running');
  assert.equal(shouldReloadForUpdate({ ...base, editing: true }), false, 'someone is typing');
  assert.equal(shouldReloadForUpdate({ ...base, latest: null }), false, 'could not read the new version');
});

test('E29: an upload counts as busy until it settles, even when it fails', async () => {
  let seen = false;
  await whileBusy(async () => { seen = isBusy(); });
  assert.equal(seen, true);
  assert.equal(isBusy(), false);
  await assert.rejects(whileBusy(async () => { throw new Error('x'); }));
  assert.equal(isBusy(), false);
});
