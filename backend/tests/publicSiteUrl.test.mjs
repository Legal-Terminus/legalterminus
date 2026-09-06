/**
 * Emails and payment redirects were sending clients to the OLD *.web.app host
 * because the deployed FRONTEND_URL still held it, and an empty value silently
 * produced a relative "/portal/" link that is meaningless in an inbox. The URL
 * now resolves through one helper that defaults to the canonical domain.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { publicSiteUrl } from '../src/services/emailService.js';

const CANON = 'https://legalterminus.com';

test('defaults to the canonical production domain when unset', () => {
  delete process.env.FRONTEND_URL;
  assert.equal(publicSiteUrl(), CANON);
});

test('an empty value falls back to the canonical domain, never a relative path', () => {
  process.env.FRONTEND_URL = '';
  assert.equal(publicSiteUrl(), CANON);
  assert.ok(publicSiteUrl().startsWith('https://'), 'must be absolute for email clients');
});

test('an explicit override wins (local dev / non-prod deploys)', () => {
  process.env.FRONTEND_URL = 'http://localhost:5174';
  assert.equal(publicSiteUrl(), 'http://localhost:5174');
});

test('a trailing slash is stripped so links never double up', () => {
  process.env.FRONTEND_URL = 'https://legalterminus.com/';
  assert.equal(publicSiteUrl(), CANON);
  assert.equal(`${publicSiteUrl()}/portal/`, `${CANON}/portal/`);
});
