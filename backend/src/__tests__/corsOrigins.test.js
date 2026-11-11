import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAllowedOrigins, isAllowedOrigin } from '../config/corsOrigins.js';

const PROD = { NODE_ENV: 'production', FIREBASE_PROJECT_ID: 'legal-terminus-web' };

test('CORS: strangers and lookalikes are refused', () => {
  const allowed = buildAllowedOrigins(PROD);
  for (const origin of [
    'https://evil.web.app',
    'https://evil.firebaseapp.com',
    'https://evillegalterminus.com',
    'https://legalterminus.com.evil.test',
    'http://legalterminus.com',
    'https://other.legalterminus.com',
    'https://legal-terminus-web.web.app.evil.test',
    'https://legal-terminus-web-evil.web.app',
  ]) assert.equal(isAllowedOrigin(origin, allowed), false, `${origin} must be refused`);
});

test('CORS: the firm\'s own sites are allowed', () => {
  const allowed = buildAllowedOrigins(PROD);
  for (const origin of [
    'https://legalterminus.com',
    'https://www.legalterminus.com',
    'https://portal.legalterminus.com',
    'https://legal-terminus-web.web.app',
    'https://legal-terminus-web.firebaseapp.com',
    'https://legal-terminus-qa.web.app',
    'https://legal-terminus-qa.firebaseapp.com',
    'https://legal-terminus-web--preview-a1b2.web.app',
  ]) assert.equal(isAllowedOrigin(origin, allowed), true, `${origin} must be allowed`);
});

test('CORS: localhost only outside production', () => {
  for (const origin of ['http://localhost', 'http://localhost:5173', 'capacitor://localhost']) {
    assert.equal(isAllowedOrigin(origin, buildAllowedOrigins(PROD)), false);
  }
  assert.equal(isAllowedOrigin('http://localhost:5173', buildAllowedOrigins({ NODE_ENV: 'development' })), true);
});

test('CORS: CORS_ORIGINS adds exact origins only', () => {
  const allowed = buildAllowedOrigins({
    ...PROD, CORS_ORIGINS: 'https://localhost, *, firm.example, https://*.firm.example, http://localhost:5173/',
  });
  assert.equal(isAllowedOrigin('https://localhost', allowed), true);
  assert.equal(isAllowedOrigin('http://localhost:5173', allowed), true);
  assert.equal(isAllowedOrigin('http://localhost:3000', allowed), false);
  assert.equal(isAllowedOrigin('https://any.firm.example', allowed), false);
  assert.equal(allowed.includes('*'), false);
});

test('CORS: every pattern is anchored at both ends', () => {
  for (const entry of buildAllowedOrigins({ ...PROD, NODE_ENV: 'development' })) {
    if (entry instanceof RegExp) {
      assert.ok(entry.source.startsWith('^') && entry.source.endsWith('$'), String(entry));
    }
  }
});

// E29-S03: the iOS app's origin, accepted as one exact string and nothing near it.
test('CORS: capacitor://localhost is allowed exactly, and only when listed', () => {
  const allowed = buildAllowedOrigins({ ...PROD, CORS_ORIGINS: 'https://localhost,capacitor://localhost' });
  assert.equal(isAllowedOrigin('capacitor://localhost', allowed), true);
  assert.equal(isAllowedOrigin('https://localhost', allowed), true);
  for (const origin of [
    'capacitor://localhost:8080',
    'capacitor://localhost/',
    'capacitor://evil',
    'ionic://localhost',
    'capacitor://localhost.evil.test',
    'CAPACITOR://localhost',
  ]) assert.equal(isAllowedOrigin(origin, allowed), false, `${origin} must be refused`);
  assert.equal(isAllowedOrigin('capacitor://localhost', buildAllowedOrigins(PROD)), false);
  assert.equal(isAllowedOrigin('capacitor://localhost', buildAllowedOrigins({ ...PROD, CORS_ORIGINS: '' })), false);
});

test('CORS: nothing else on the capacitor scheme survives CORS_ORIGINS', () => {
  const allowed = buildAllowedOrigins({
    ...PROD, CORS_ORIGINS: 'capacitor://evil,capacitor://localhost:1,capacitor://*,ionic://localhost',
  });
  assert.equal(allowed.some((e) => typeof e === 'string' && !/^https?:/.test(e)), false);
});
