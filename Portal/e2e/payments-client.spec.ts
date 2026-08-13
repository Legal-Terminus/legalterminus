import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #165 — a client could not load the payment history for their OWN matter: the
 * route was admin/manager-only, so the client's Payments tab rendered
 * "Could not load the payment history." They now READ their own ledger (never
 * write it), with staff identities masked; team members stay excluded (#148).
 */
test('#165: a client can read their own matter payment history', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    // Record a payment so the ledger is non-empty.
    const rec = await admin.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 2500, mode: 'UPI', reference: 'E2E-165' },
    });
    expect(rec.ok()).toBeTruthy();
    await admin.dispose();

    const client = await apiAs('client');
    const res = await client.get(`/api/tasks/${taskId}/payments`);
    expect(res.status(), 'client may read their own ledger').toBe(200);
    const body = await res.json();
    expect(body.payments.length).toBeGreaterThan(0);
    expect(body.payments[0].amount).toBe(2500);
    // Staff identity must NOT leak to the client.
    expect(body.payments[0].recordedBy).toBeUndefined();
    expect(body.payments[0].recordedByName).toBeUndefined();
    // Writing stays staff-only.
    const w = await client.post(`/api/tasks/${taskId}/payments`, { data: { amount: 1, mode: 'UPI' } });
    expect(w.status(), 'client cannot record payments').toBe(403);
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#165/#148: a TEAM member still cannot see payment history', async () => {
  const taskId = await createMatter();
  try {
    const team = await apiAs('team');
    const res = await team.get(`/api/tasks/${taskId}/payments`);
    expect(res.status()).toBe(403);
    await team.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#165: an unauthenticated request is still refused', async ({ request }) => {
  const taskId = await createMatter();
  try {
    // No bearer token → the auth middleware refuses before any ownership check.
    const res = await request.get(`http://localhost:5001/api/tasks/${taskId}/payments`);
    expect([401, 403]).toContain(res.status());
  } finally { await deleteMatter(taskId); }
});
