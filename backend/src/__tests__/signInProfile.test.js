import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSignInProfile } from '../services/signInProfile.js';

// #277: sign-in (POST /api/auth/register) runs on every sign-in. An email-and-
// password account has no displayName, so the page sends the EMAIL as fullName.

const signIn = (over = {}) => ({
  email: 'asha@client.test', fullName: 'asha@client.test', mobile: '', businessName: '', state: '',
  provider: 'email', photoURL: null, ...over,
});

test('signing in never replaces an existing client name with the email address', () => {
  const p = buildSignInProfile({ name: 'Asha Rao', mobile: '9876543210' }, signIn());
  assert.equal(p.name, undefined);
  assert.equal(p.fullName, undefined);
  assert.equal(p.mobile, undefined, 'a blank mobile from sign-in must not wipe the saved one');
  assert.equal(p.email, 'asha@client.test');
});

test('signing in never replaces an existing name, even with a real display name', () => {
  const p = buildSignInProfile({ name: 'Asha Rao' }, signIn({ fullName: 'Asha R.', provider: 'google' }));
  assert.equal(p.name, undefined);
});

test('a real display name repairs a profile whose name is missing or is an email', () => {
  assert.equal(buildSignInProfile({ name: 'asha@client.test' }, signIn({ fullName: 'Asha Rao' })).name, 'Asha Rao');
  assert.equal(buildSignInProfile({ name: '' }, signIn({ fullName: 'Asha Rao' })).fullName, 'Asha Rao');
});

test('empty contact fields are filled from sign-in, saved ones are kept', () => {
  const p = buildSignInProfile({ name: 'Asha', mobile: '', state: 'Odisha' }, signIn({ mobile: '9876543210', state: 'Goa' }));
  assert.equal(p.mobile, '9876543210');
  assert.equal(p.state, undefined);
});

test('a new user is created exactly as before', () => {
  const p = buildSignInProfile(null, signIn({ fullName: 'New Person', mobile: '98765 43210', state: 'Odisha' }));
  assert.deepEqual(
    { name: p.name, fullName: p.fullName, mobile: p.mobile, state: p.state, businessName: p.businessName },
    { name: 'New Person', fullName: 'New Person', mobile: '98765 43210', state: 'Odisha', businessName: '' },
  );
});

test('a Google photo is still recorded; terms acceptance passes through', () => {
  const p = buildSignInProfile({ name: 'Asha' }, signIn({ provider: 'google', photoURL: 'https://x/p.png', terms: { termsAcceptedAt: 't' } }));
  assert.equal(p.profilePictureUrl, 'https://x/p.png');
  assert.equal(p.termsAcceptedAt, 't');
});
