import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter } from './api';
import { env } from './helpers';

/**
 * Batch A (#117 #118 #119/#120 #121):
 *  #117 — "Full payment" is rejected while a balance is due (create + edit).
 *  #118 — the matter header shows the organisation beside the client name.
 *  #119/#120 — the Stages rail starts COLLAPSED, so the steps pane shows the
 *              continuous all-steps timeline; expanding switches to per-stage.
 */

test('#117: creating a matter as fully_paid with a balance due is rejected', async () => {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'),
      serviceKey: 'incorporation',
      paymentStatus: 'fully_paid',
      totalCost: 10000,
      amountReceived: 5000, // ← less than total
      paymentMode: 'E2E',
    },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(JSON.stringify(body)).toMatch(/outstanding balance|Full Payment/i);
  await api.dispose();
});

test('#117: fully_paid with the full amount still succeeds', async () => {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey: 'incorporation',
      paymentStatus: 'fully_paid', totalCost: 10000, amountReceived: 10000, paymentMode: 'E2E',
    },
  });
  expect(res.ok()).toBeTruthy();
  const taskId = (await res.json()).id as string;
  await api.dispose();
  await deleteMatter(taskId);
});

test('#117: editing payment to fully_paid while a balance remains is rejected', async () => {
  const taskId = await createMatter(); // fully paid 10000/10000
  try {
    const api = await apiAs('admin');
    // Raise the total so a balance exists, and try to force fully_paid.
    const res = await api.patch(`/api/tasks/${taskId}/payment`, {
      data: { totalCost: 20000, amountPaid: 5000, paymentStatus: 'fully_paid' },
    });
    expect(res.status()).toBe(400);
    expect(JSON.stringify(await res.json())).toMatch(/outstanding balance/i);
    await api.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#118: the matter header shows the organisation beside the client name', async ({ adminPage }) => {
  const api = await apiAs('admin');
  const org = `E2E Org ${Date.now()}`;
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey: 'incorporation', organisation: org,
      paymentStatus: 'fully_paid', totalCost: 10000, amountReceived: 10000, paymentMode: 'E2E',
    },
  });
  const taskId = (await res.json()).id as string;
  await api.dispose();
  try {
    expect((await getMatter(taskId)).organisation).toBe(org);
    await adminPage.goto(`tasks/${taskId}`);
    // The header subtitle carries the organisation.
    await expect(adminPage.getByText(org).first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#119/#120: stages start collapsed showing the continuous all-steps timeline', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    // The rail remembers the user's choice, so clear any persisted preference
    // first to assert the DEFAULT (collapsed) for a first-time user.
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.evaluate(() => {
      localStorage.removeItem('matterLayout:stages:c');
      localStorage.removeItem('matterLayout:stages:w');
    });
    await adminPage.reload();
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Collapsed by default → the "All steps" continuous view with a stage jump.
    // (The stage picker renders per breakpoint, so scope to the first match.)
    await expect(adminPage.getByRole('button', { name: /Browse by stage/i })).toBeVisible();
    await expect(adminPage.getByLabel('Jump to stage').first()).toBeVisible();

    // Switching to per-stage focus is a user choice.
    await adminPage.getByRole('button', { name: /Browse by stage/i }).click();
    await expect(adminPage.getByRole('button', { name: /Show all steps/i })).toBeVisible();

    // And back again — the toggle is reversible.
    await adminPage.getByRole('button', { name: /Show all steps/i }).click();
    await expect(adminPage.getByRole('button', { name: /Browse by stage/i })).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
