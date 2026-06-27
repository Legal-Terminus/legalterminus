import { test, expect } from './fixtures';
import {
  createMatter, createNoPaymentMatter, deleteMatter, getMatter, apiAs,
} from './api';

/**
 * Issues #51, #54, #56, #58, #62 — workflow/payment/reporting changes.
 * These assert the backend contracts (deterministic) + a couple of UI surfaces.
 */

test('#51: a fully-paid matter is created active with payment captured', async () => {
  const taskId = await createMatter(); // helper now sends fully_paid + amounts
  try {
    const m = await getMatter(taskId);
    expect(m.paymentStatus).toBe('fully_paid');
    expect(m.amountPaid).toBe(10000);
    expect(['pending', 'active']).toContain(m.status as string);
    expect(m.createdWithoutPayment).toBeFalsy();
  } finally { await deleteMatter(taskId); }
});

test('#51: a NO-PAYMENT matter routes to admin approval (not live)', async () => {
  const taskId = await createNoPaymentMatter();
  try {
    const m = await getMatter(taskId);
    expect(m.status).toBe('pending_admin_approval');
    expect(m.createdWithoutPayment).toBe(true);
  } finally { await deleteMatter(taskId); }
});

test('#58: payment-overrides report lists no-payment / overridden matters', async () => {
  const taskId = await createNoPaymentMatter();
  try {
    const api = await apiAs('admin');
    const res = await api.get('/api/reports/payment-overrides');
    expect(res.ok()).toBeTruthy();
    const rows = await res.json();
    await api.dispose();
    const row = rows.find((r: { taskId: string }) => r.taskId === taskId);
    expect(row).toBeTruthy();
    expect(row.overrideReason).toContain('created_no_payment');
  } finally { await deleteMatter(taskId); }
});

test('#62: professional-mapping report returns the documented shape', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/reports/professional-mapping');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  await api.dispose();
  expect(typeof body.totalClients).toBe('number');
  expect(Array.isArray(body.byProfessional)).toBeTruthy();
  expect(Array.isArray(body.byGroup)).toBeTruthy();
});

test('#58/#62: the new report pages load and are linked from the hub', async ({ adminPage }) => {
  await adminPage.goto('reports');
  await expect(adminPage.getByRole('link', { name: /Payment Overrides/ })).toBeVisible();
  await expect(adminPage.getByRole('link', { name: /Professional \/ Group/ })).toBeVisible();

  await adminPage.goto('reports/payment-overrides');
  await expect(adminPage.getByRole('heading', { name: 'Payment Overrides' })).toBeVisible();

  await adminPage.goto('reports/professional-mapping');
  await expect(adminPage.getByRole('heading', { name: 'Professional / Group Mapping' })).toBeVisible();
});

test('#51: Create Matter modal shows payment fields and a no-payment notice', async ({ adminPage }) => {
  await adminPage.goto('tasks');
  await adminPage.getByRole('button', { name: /Create Matter|Create/ }).first().click();
  await expect(adminPage.getByRole('heading', { name: 'Create Matter' })).toBeVisible();

  // Default No Payment → admin-approval notice visible.
  await expect(adminPage.getByText(/sent to the.*Admin Approval/i)).toBeVisible();

  // Switching to Part/Full Payment reveals the amount fields.
  await adminPage.getByLabel('Payment status').selectOption('part_paid');
  await expect(adminPage.getByText('Amount Received')).toBeVisible();
});
