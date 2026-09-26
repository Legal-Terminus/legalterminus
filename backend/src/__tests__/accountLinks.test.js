/**
 * #203 — emailed account links point at the portal, never at firebaseapp.com,
 * and the setup email says who set the account up and whom to ask.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.FRONTEND_URL = 'https://app.example.test/';

const {
  toPortalLink, passwordLinkFor, signInLinkFor, isEmailLinkDisabled,
  setupEmail, resetEmail, signInEmail, passwordAccessEmail, describeInviter,
} = await import('../services/accountLinks.service.js');

const FIREBASE = 'https://proj.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=ABC123&apiKey=SECRETISH&lang=en';

test('toPortalLink keeps only the code and lands on the portal action page', () => {
  const link = toPortalLink(FIREBASE, { mode: 'resetPassword', intent: 'setup' });
  assert.equal(link, 'https://app.example.test/portal/account/action?mode=resetPassword&oobCode=ABC123&intent=setup');
  assert.doesNotMatch(link, /firebaseapp|apiKey/);
});

test('toPortalLink refuses a link with no code rather than emailing a dead one', () => {
  assert.throws(() => toPortalLink('https://proj.firebaseapp.com/__/auth/action?mode=resetPassword'), /oobCode/);
});

test('passwordLinkFor asks Firebase for a reset code and returns a portal link', async () => {
  const calls = [];
  const auth = { generatePasswordResetLink: async (email, settings) => { calls.push({ email, settings }); return FIREBASE; } };
  const link = await passwordLinkFor('a@b.test', { intent: 'reset', auth });
  assert.equal(calls[0].email, 'a@b.test');
  assert.equal(calls[0].settings, undefined, 'no continue URL — it only adds a way to fail');
  assert.match(link, /\/portal\/account\/action\?mode=resetPassword&oobCode=ABC123&intent=reset$/);
});

test('passwordLinkFor falls back to setup wording for an unknown intent', async () => {
  const auth = { generatePasswordResetLink: async () => FIREBASE };
  assert.match(await passwordLinkFor('a@b.test', { intent: 'nope', auth }), /intent=setup$/);
});

test('signInLinkFor requests an in-app link and returns mode=signIn', async () => {
  let settings;
  const auth = {
    generateSignInWithEmailLink: async (_e, s) => { settings = s; return FIREBASE.replace('resetPassword', 'signIn'); },
  };
  const link = await signInLinkFor('a@b.test', { auth });
  assert.equal(settings.handleCodeInApp, true);
  assert.equal(settings.url, 'https://app.example.test/portal/account/action');
  assert.match(link, /\/portal\/account\/action\?mode=signIn&oobCode=ABC123$/);
});

test('isEmailLinkDisabled recognises the provider-disabled error only', () => {
  assert.equal(isEmailLinkDisabled({ code: 'auth/operation-not-allowed' }), true);
  assert.equal(isEmailLinkDisabled({ message: 'The given sign-in provider is disabled for this Firebase project.' }), true);
  assert.equal(isEmailLinkDisabled({ code: 'auth/user-not-found' }), false);
  assert.equal(isEmailLinkDisabled(undefined), false);
});

test('setupEmail names who set it up, why, and whom to contact', () => {
  const mail = setupEmail({
    name: 'Asha', role: 'client', link: 'https://l',
    inviter: { name: 'Priya Rao', email: 'priya@firm.test' },
  });
  assert.equal(mail.title, 'Priya Rao at Legal Terminus set up your account');
  assert.match(mail.message, /^Hello Asha,/);
  assert.match(mail.message, /follow your matters/);
  assert.match(mail.message, /Contact Priya Rao \(priya@firm\.test\)/);
  assert.match(mail.message, /Google/);
  assert.deepEqual(mail.action, { label: 'Create your password', url: 'https://l' });
  // The link is the button — it is not pasted into the prose.
  assert.doesNotMatch(mail.message, /https:\/\/l/);
});

test('setupEmail without an inviter falls back to the firm', () => {
  const mail = setupEmail({ role: 'team_member', link: 'https://l' });
  assert.equal(mail.title, 'Legal Terminus set up your account');
  assert.match(mail.message, /^Hello there,/);
  assert.match(mail.message, /Contact Legal Terminus before using the link/);
});

test('reset, sign-in and fallback emails each carry their own button', () => {
  assert.equal(resetEmail({ link: 'x' }).action.label, 'Choose a new password');
  assert.equal(signInEmail({ link: 'x' }).action.label, 'Sign in');
  assert.match(signInEmail({ link: 'x', sentBy: { name: 'Priya' } }).message, /^Priya sent you a link/);
  assert.equal(passwordAccessEmail({ link: 'x' }).action.label, 'Choose a password and sign in');
});

test('describeInviter reads the member record and tolerates its absence', async () => {
  const db = (data) => ({ collection: () => ({ doc: () => ({ get: async () => ({ exists: Boolean(data), data: () => data }) }) }) });
  assert.deepEqual(await describeInviter(db({ name: 'Priya', email: 'p@f.test' }), 'u1'), { name: 'Priya', email: 'p@f.test' });
  assert.equal(await describeInviter(db(null), 'u1'), null);
  assert.equal(await describeInviter(db({ name: 'x' }), 'admin'), null, 'the legacy "admin" placeholder is not a person');
});
