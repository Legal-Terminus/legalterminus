import { test, expect } from './fixtures';
import { apiAs } from './api';

/**
 * Email diagnostics + the E2E no-send safety net.
 *
 * GET /api/health/email is an admin-only diagnostic that verifies the Gmail SMTP
 * transport WITHOUT sending an email. The E2E backend runs with EMAIL_DISABLED=true
 * (see `start:backend:e2e`), so this suite also PROVES email is force-disabled
 * during tests — the seeded accounts use fake addresses, and we must never send
 * real mail to them.
 */

test('email health endpoint is admin-only', async () => {
  // A client is rejected (403); an unauthenticated request is 401.
  const client = await apiAs('client');
  const cRes = await client.get('/api/health/email');
  expect(cRes.status()).toBe(403);
  await client.dispose();
});

test('email is FORCE-DISABLED during E2E (no real emails are ever sent)', async () => {
  const admin = await apiAs('admin');
  const res = await admin.get('/api/health/email');
  // Force-disabled → the endpoint reports not-enabled and returns 503.
  expect(res.status()).toBe(503);
  const body = await res.json();
  expect(body.enabled).toBe(false);
  expect(body.verified).toBe(false);
  expect(String(body.error)).toMatch(/force-disabled|disabled|no-op/i);
  await admin.dispose();
});
