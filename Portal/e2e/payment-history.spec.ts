import { test, expect } from './fixtures';
import { apiAs, createPartPaidMatter, deleteMatter, getMatter } from './api';

/**
 * #148 — Payment History. A matter's payments are a LEDGER (one doc per
 * instalment in tasks/{id}/payments), not a single overwritten latest figure.
 * The task's amountPaid / amountDue / paymentStatus are rollups the backend
 * recomputes from that ledger.
 *
 * Access: Admin and Manager may view and manage; a Team member must not see the
 * Payments tab or any payment information at all.
 *
 * Matters here start part-paid (₹4,000 of ₹10,000) with an EMPTY ledger, which
 * also covers the pre-existing-data case: history starts from the next payment.
 */

test('#148: payments accumulate and the rollups follow the ledger', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    // A matter created before this feature has no ledger yet.
    const initial = await (await api.get(`/api/tasks/${taskId}/payments`)).json();
    expect(initial.payments).toEqual([]);
    expect(initial.totalCost).toBe(10000);

    // First instalment.
    const r1 = await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 2500, mode: 'UPI', reference: 'UTR-001' },
    });
    expect(r1.status()).toBe(201);
    const b1 = await r1.json();
    expect(b1.amountPaid).toBe(2500);
    expect(b1.amountDue).toBe(7500);
    expect(b1.paymentStatus).toBe('part_paid');

    // Second instalment — the ledger accumulates rather than overwriting.
    const r2 = await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 3500, mode: 'Bank Transfer' },
    });
    expect(r2.status()).toBe(201);
    expect((await r2.json()).amountPaid).toBe(6000);

    // The history lists both, oldest first, each with the balance after it.
    const hist = await (await api.get(`/api/tasks/${taskId}/payments`)).json();
    expect(hist.payments).toHaveLength(2);
    expect(hist.payments.map((p: { amount: number }) => p.amount)).toEqual([2500, 3500]);
    expect(hist.payments.map((p: { dueAfter: number }) => p.dueAfter)).toEqual([7500, 4000]);
    expect(hist.payments[0].mode).toBe('UPI');
    expect(hist.payments[0].reference).toBe('UTR-001');
    // Who recorded it is captured for the audit trail.
    expect(hist.payments[0].recordedBy).toBeTruthy();

    // The task doc rollups agree with the ledger.
    const task = await getMatter(taskId);
    expect(task.amountPaid).toBe(6000);
    expect(task.amountDue).toBe(4000);
    expect(task.paymentStatus).toBe('part_paid');

    // Settling the balance flips the matter to fully paid automatically.
    const r3 = await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 4000, mode: 'Cash' },
    });
    expect(r3.status()).toBe(201);
    const b3 = await r3.json();
    expect(b3.amountDue).toBe(0);
    expect(b3.paymentStatus).toBe('fully_paid');
    expect((await getMatter(taskId)).paymentStatus).toBe('fully_paid');
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: a payment can be corrected or removed, and the rollups follow', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    const created = await (await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 3000, mode: 'UPI' },
    })).json();
    const paymentId = created.id;
    expect(paymentId).toBeTruthy();

    // Correct a mistyped amount — the rollup recomputes from the ledger.
    const patched = await api.patch(`/api/tasks/${taskId}/payments/${paymentId}`, {
      data: { amount: 5000, mode: 'Cheque' },
    });
    expect(patched.ok()).toBeTruthy();
    expect((await patched.json()).amountPaid).toBe(5000);
    expect((await getMatter(taskId)).amountDue).toBe(5000);

    // Remove it entirely — back to nothing received.
    const removed = await api.delete(`/api/tasks/${taskId}/payments/${paymentId}`);
    expect(removed.ok()).toBeTruthy();
    const after = await removed.json();
    expect(after.amountPaid).toBe(0);
    expect(after.paymentStatus).toBe('not_paid');
    expect((await (await api.get(`/api/tasks/${taskId}/payments`)).json()).payments).toEqual([]);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: a payment cannot exceed the outstanding balance', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    const res = await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 10001, mode: 'UPI' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).code).toBe('PAYMENT_EXCEEDS_TOTAL');
    // Nothing was written.
    expect((await (await api.get(`/api/tasks/${taskId}/payments`)).json()).payments).toEqual([]);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: once a ledger exists, amountPaid cannot be set behind its back', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    await api.post(`/api/tasks/${taskId}/payments`, { data: { amount: 2000, mode: 'UPI' } });

    // The old single-figure editor must not silently desync the two.
    const res = await api.patch(`/api/tasks/${taskId}/payment`, { data: { amountPaid: 9000 } });
    expect(res.status()).toBe(400);
    expect((await res.json()).code).toBe('PAYMENT_LEDGER_AUTHORITATIVE');
    expect((await getMatter(taskId)).amountPaid).toBe(2000);

    // Editing the total cost is still allowed — only the paid figure is locked.
    const ok = await api.patch(`/api/tasks/${taskId}/payment`, { data: { totalCost: 8000 } });
    expect(ok.ok()).toBeTruthy();
    const task = await getMatter(taskId);
    expect(task.totalCost).toBe(8000);
    expect(task.amountPaid).toBe(2000);
    expect(task.amountDue).toBe(6000);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

/* ── Access control: Team must not see payments at all ─────────────────────── */

test('#148: a manager can view and record payments', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('manager');
  try {
    const created = await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 1000, mode: 'UPI' },
    });
    expect(created.status()).toBe(201);
    const hist = await api.get(`/api/tasks/${taskId}/payments`);
    expect(hist.ok()).toBeTruthy();
    expect((await hist.json()).payments).toHaveLength(1);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: a team member is refused every payment endpoint', async () => {
  const taskId = await createPartPaidMatter();
  const admin = await apiAs('admin');
  const team = await apiAs('team');
  try {
    const seeded = await (await admin.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 1000, mode: 'UPI' },
    })).json();

    expect((await team.get(`/api/tasks/${taskId}/payments`)).status()).toBe(403);
    expect((await team.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 500, mode: 'Cash' },
    })).status()).toBe(403);
    expect((await team.patch(`/api/tasks/${taskId}/payments/${seeded.id}`, {
      data: { amount: 500 },
    })).status()).toBe(403);
    expect((await team.delete(`/api/tasks/${taskId}/payments/${seeded.id}`)).status()).toBe(403);
  } finally {
    await admin.dispose();
    await team.dispose();
    await deleteMatter(taskId);
  }
});

test('#148/#165: a client CAN read their own matter’s payment history', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('client');
  try {
    // #165 (3ba3bdb7) deliberately opened this up: the client is the one paying,
    // and the Payments tab already shows what they owe, so refusing the ledger
    // was hiding their own money from them. This assertion tracked the old rule.
    const res = await api.get(`/api/tasks/${taskId}/payments`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.payments)).toBeTruthy();
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: deleting a matter also deletes its payment ledger', async () => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    await api.post(`/api/tasks/${taskId}/payments`, { data: { amount: 1500, mode: 'UPI' } });
    expect((await (await api.get(`/api/tasks/${taskId}/payments`)).json()).payments).toHaveLength(1);

    // Firestore does not cascade — the delete handler sweeps subcollections by an
    // explicit list, so a new one (like this ledger) must be added to it or the
    // payment docs are orphaned. Guard that here.
    const del = await api.delete(`/api/tasks/${taskId}`);
    expect(del.ok()).toBeTruthy();
    // The matter is gone, and so is everything under it.
    expect((await api.get(`/api/tasks/${taskId}/payments`)).status()).toBe(404);
  } finally {
    await api.dispose();
    await deleteMatter(taskId); // best-effort; already gone
  }
});

/* ── UI ─────────────────────────────────────────────────────────────────────── */

test('#148: admin sees the Payments tab with a history table', async ({ adminPage }) => {
  const taskId = await createPartPaidMatter();
  const api = await apiAs('admin');
  try {
    await api.post(`/api/tasks/${taskId}/payments`, {
      data: { amount: 2500, mode: 'UPI', reference: 'UTR-777' },
    });

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Payments' }).click();
    // `exact` keeps this distinct from the "Loading payment history…" placeholder.
    await expect(adminPage.getByText('Payment history', { exact: true })).toBeVisible();
    // The recorded instalment and the balance after it are both shown.
    await expect(adminPage.getByText('₹2,500').first()).toBeVisible();
    await expect(adminPage.getByText('UTR-777')).toBeVisible();
    // Recording another is offered.
    await expect(adminPage.getByRole('button', { name: 'Record payment' })).toBeVisible();
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#148: a team member does not see the Payments tab', async ({ teamPage }) => {
  const taskId = await createPartPaidMatter();
  try {
    await teamPage.goto(`tasks/${taskId}`);
    // The matter screen loaded …
    await expect(teamPage.getByRole('button', { name: 'Steps' })).toBeVisible();
    // … but Payments is absent entirely, not merely disabled.
    await expect(teamPage.getByRole('button', { name: 'Payments' })).toHaveCount(0);
  } finally {
    await deleteMatter(taskId);
  }
});
