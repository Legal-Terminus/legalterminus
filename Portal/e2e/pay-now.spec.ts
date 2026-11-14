import { test, expect } from './fixtures';
import { request } from '@playwright/test';
import { apiAs, createMatter, createPartPaidMatter, deleteMatter, getMatter } from './api';

/**
 * #220 Pay Now — a client pays exactly what is due on a part-paid matter, and
 * it lands in the matter's payment history by itself.
 *
 * Runs on the SIMULATED gateway (QA and the local test stack); it skips where
 * real money would move. createPartPaidMatter leaves ₹6,000 of ₹10,000 due.
 */
const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';

type Ledger = { payments: { amount: number; mode: string }[]; amountDue: number; amountPaid: number; paymentStatus: string };
const ledger = async (taskId: string): Promise<Ledger> => {
  const admin = await apiAs('admin');
  try { return await (await admin.get(`/api/tasks/${taskId}/payments`)).json(); } finally { await admin.dispose(); }
};

const matters: string[] = [];
const orders: string[] = [];

test.describe.serial('#220 Pay Now (simulated gateway)', () => {
  test.beforeAll(async () => {
    const anon = await request.newContext({ baseURL: API() });
    try {
      const config = await (await anon.get('/api/orders/config')).json();
      test.skip(config.gateway !== 'simulated', 'the simulated gateway is not active in this environment');
    } finally { await anon.dispose(); }
  });

  test.afterAll(async () => {
    // Remove the test orders (the simulator only discards its own) and matters.
    const client = await apiAs('client');
    for (const id of orders) await client.post(`/api/orders/${id}/simulate`, { data: { outcome: 'discard' } }).catch(() => {});
    await client.dispose();
    for (const id of matters) await deleteMatter(id).catch(() => {});
  });

  test('the client pays exactly the amount due, and the matter becomes fully paid', async ({ clientPage }) => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Payments', exact: true }).click();
    const pay = clientPage.getByRole('button', { name: /Pay Now ₹6,000/ });
    await expect(pay).toBeVisible({ timeout: 15_000 });
    await pay.click();
    await clientPage.getByRole('button', { name: 'Complete test payment' }).click();
    await expect(clientPage.getByText('Payment of ₹6,000 received. Thank you.')).toBeVisible({ timeout: 15_000 });

    await expect(async () => {
      const l = await ledger(taskId);
      expect(l.paymentStatus).toBe('fully_paid');
      expect(l.amountDue).toBe(0);
      expect(l.amountPaid).toBe(10000);
      expect(l.payments.filter((p) => p.mode === 'Online (test payment)').map((p) => p.amount)).toEqual([6000]);
    }).toPass({ timeout: 15_000 });
    // Nothing is due any more, so there is nothing to pay.
    await clientPage.reload();
    await clientPage.getByRole('button', { name: 'Payments', exact: true }).click();
    await expect(clientPage.getByRole('button', { name: /Pay Now/ })).toHaveCount(0);
  });

  test('the amount is the server’s: a tampered amount is refused, and only a client can start', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    const client = await apiAs('client');
    expect((await client.post(`/api/tasks/${taskId}/pay-now`, { data: { amount: 1 } })).status()).toBe(400);
    const res = await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} });
    expect(res.status(), await res.text()).toBe(201);
    const order = await res.json();
    orders.push(order.orderId);
    expect(order.amount).toBe(6000);
    expect(order.matterId).toBe(taskId);
    // Clicking again reuses the order already started — no second charge to pay.
    const again = await (await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} })).json();
    expect(again.orderId).toBe(order.orderId);
    await client.dispose();

    for (const role of ['admin', 'manager', 'team'] as const) {
      const who = await apiAs(role);
      expect((await who.post(`/api/tasks/${taskId}/pay-now`, { data: {} })).status()).toBe(403);
      await who.dispose();
    }
  });

  test('a payment the gateway reports twice is added once', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);
    const client = await apiAs('client');
    const order = await (await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} })).json();
    orders.push(order.orderId);
    await client.post(`/api/orders/${order.orderId}/simulate`, { data: { outcome: 'duplicate_webhook' } });
    await client.dispose();

    await expect(async () => {
      const l = await ledger(taskId);
      expect(l.payments.filter((p) => p.mode === 'Online (test payment)')).toHaveLength(1);
      expect(l.paymentStatus).toBe('fully_paid');
    }).toPass({ timeout: 15_000 });
  });

  // #276: Razorpay "Customer Fee Bearer" — the client pays the amount due +
  // Razorpay's fee. The matter is credited the amount due only; the fee is on
  // the order for staff, never on the client's view.
  test('#276 a fee-bearer payment (amount due + gateway fee) is accepted; the matter gets only the amount due', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);
    const client = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const order = await (await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} })).json();
      orders.push(order.orderId);
      const res = await (await client.post(`/api/orders/${order.orderId}/simulate`, { data: { outcome: 'fee_webhook' } })).json();
      expect(res.delivered.outcome).toBe('paid');
      const full = await (await admin.get(`/api/orders/${order.orderId}`)).json();
      expect(full.status).toBe('paid');
      expect(full.amountPaid).toBe(order.amount);
      expect(full.convenienceFee).toBeGreaterThan(0);
      expect(full.gatewayAmount).toBe(Math.round((order.amount + full.convenienceFee) * 100) / 100);
      const mine = await (await client.get(`/api/orders/${order.orderId}`)).json();
      expect(JSON.stringify(mine)).not.toMatch(/convenience|gatewayAmount/);
      await expect(async () => {
        const l = await ledger(taskId);
        const online = l.payments.filter((p) => p.mode === 'Online (test payment)');
        expect(online).toHaveLength(1);
        expect(online[0].amount, 'the fee is not credited to the matter').toBe(order.amount);
        expect(l.paymentStatus).toBe('fully_paid');
      }).toPass({ timeout: 15_000 });
    } finally { await client.dispose(); await admin.dispose(); }
  });

  test('#276 a payment that is neither the amount due nor amount due + fee is held for review', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);
    const client = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const order = await (await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} })).json();
      orders.push(order.orderId);
      const res = await (await client.post(`/api/orders/${order.orderId}/simulate`, { data: { outcome: 'fee_mismatch' } })).json();
      expect(res.delivered.outcome).toBe('review');
      expect((await (await admin.get(`/api/orders/${order.orderId}`)).json()).status).toBe('review');
      expect((await ledger(taskId)).payments.filter((p) => p.mode === 'Online (test payment)')).toHaveLength(0);
    } finally { await client.dispose(); await admin.dispose(); }
  });

  test('nothing part-paid is due: a fully paid matter has no Pay Now', async () => {
    const taskId = await createMatter(); // fully paid
    matters.push(taskId);
    const client = await apiAs('client');
    const res = await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} });
    expect(res.status()).toBe(409);
    expect((await res.json()).code).toBe('NOTHING_DUE');
    await client.dispose();
  });

  test('an admin switches Pay Now off for a matter, and the client loses the button', async ({ adminPage, clientPage }) => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Payments', exact: true }).click();
    const sw = adminPage.getByRole('checkbox', { name: 'Let the client pay the amount due online' });
    await expect(sw).toBeChecked({ timeout: 15_000 });
    await sw.uncheck();
    await expect(async () => {
      expect((await getMatter(taskId)).onlinePaymentEnabled).toBe(false);
    }).toPass({ timeout: 15_000 });

    const client = await apiAs('client');
    const res = await client.post(`/api/tasks/${taskId}/pay-now`, { data: {} });
    expect(res.status()).toBe(409);
    expect((await res.json()).code).toBe('PAY_NOW_OFF');
    await client.dispose();

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Payments', exact: true }).click();
    await expect(clientPage.getByText('Amount due').first()).toBeVisible({ timeout: 15_000 });
    await expect(clientPage.getByRole('button', { name: /Pay Now/ })).toHaveCount(0);
  });
});
