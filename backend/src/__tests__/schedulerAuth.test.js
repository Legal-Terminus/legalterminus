/**
 * GST timing: the scheduler proves itself with a Google-signed token for its own
 * service account, and the traffic fallback waits until 09:00 India time.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { isSchedulerCall } from '../services/schedulerAuth.service.js';
import { sweepWindowOpen } from '../services/gstReturns.service.js';

const SA = 'lt-scheduler@legal-terminus-web.iam.gserviceaccount.com';
const req = (auth) => ({ headers: auth ? { authorization: auth } : {} });
const verifyAs = (payload) => async ({ audience }) => {
  if (audience !== 'aud-x') throw new Error('wrong audience');
  return { getPayload: () => payload };
};

test('accepted only for the scheduler account, verified, for our audience', async () => {
  const ok = verifyAs({ email: SA, email_verified: true });
  assert.equal(await isSchedulerCall(req('Bearer t'), { expectedEmail: SA, audience: 'aud-x', verify: ok }), true);
  // Another Google account, even a verified one.
  assert.equal(await isSchedulerCall(req('Bearer t'), { expectedEmail: SA, audience: 'aud-x',
    verify: verifyAs({ email: 'someone@gmail.com', email_verified: true }) }), false);
  assert.equal(await isSchedulerCall(req('Bearer t'), { expectedEmail: SA, audience: 'aud-x',
    verify: verifyAs({ email: SA, email_verified: false }) }), false);
  // Signature or audience check fails (e.g. a Firebase sign-in token).
  assert.equal(await isSchedulerCall(req('Bearer t'), { expectedEmail: SA, audience: 'other', verify: ok }), false);
  // No token, or not configured: never.
  assert.equal(await isSchedulerCall(req(), { expectedEmail: SA, audience: 'aud-x', verify: ok }), false);
  assert.equal(await isSchedulerCall(req('Bearer t'), { expectedEmail: '', audience: 'aud-x', verify: ok }), false);
});

test('the traffic fallback opens at 09:00 India time, not at midnight', () => {
  assert.equal(sweepWindowOpen(new Date('2026-11-30T18:35:00Z')), false); // 1 Dec 00:05 IST
  assert.equal(sweepWindowOpen(new Date('2026-12-01T03:29:00Z')), false); // 08:59 IST
  assert.equal(sweepWindowOpen(new Date('2026-12-01T03:30:00Z')), true);  // 09:00 IST
  assert.equal(sweepWindowOpen(new Date('2026-12-01T18:00:00Z')), true);  // 23:30 IST
});
