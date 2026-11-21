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

test('CORS: localhost is never allowed, in any environment', () => {
  for (const env of [PROD, { NODE_ENV: 'development' }, {}]) {
    const allowed = buildAllowedOrigins(env);
    for (const origin of [
      'http://localhost', 'http://localhost:5173', 'https://localhost', 'capacitor://localhost',
      'http://127.0.0.1:5173', 'https://app.localhost',
    ]) assert.equal(isAllowedOrigin(origin, allowed), false, `${origin} must be refused (${env.NODE_ENV ?? 'unset'})`);
  }
});

test('CORS: CORS_ORIGINS adds exact origins only, and never localhost', () => {
  const allowed = buildAllowedOrigins({
    ...PROD,
    CORS_ORIGINS: 'https://firm.example, *, firm.example, https://*.firm.example, https://localhost, '
      + 'http://localhost:5173/, capacitor://localhost, http://127.0.0.1:3000, https://x.localhost, http://0.0.0.0:80',
  });
  assert.equal(isAllowedOrigin('https://firm.example', allowed), true);
  for (const origin of [
    'https://localhost', 'http://localhost:5173', 'capacitor://localhost', 'http://127.0.0.1:3000',
    'https://x.localhost', 'http://0.0.0.0:80', 'https://any.firm.example',
  ]) assert.equal(isAllowedOrigin(origin, allowed), false, `${origin} must be refused`);
  assert.equal(allowed.includes('*'), false);
  assert.equal(allowed.some((e) => typeof e === 'string' && !/^https?:/.test(e)), false);
});

test('CORS: every pattern is anchored at both ends', () => {
  for (const entry of buildAllowedOrigins({ ...PROD, NODE_ENV: 'development' })) {
    if (entry instanceof RegExp) {
      assert.ok(entry.source.startsWith('^') && entry.source.endsWith('$'), String(entry));
    }
  }
});
