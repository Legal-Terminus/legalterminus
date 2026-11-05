import { test, expect } from './fixtures';
import { request } from '@playwright/test';
import { apiAs, createPartPaidMatter, deleteMatter, getMatter } from './api';

/**
 * #222 Additional payment requests — staff ask the client for government fees,
 * fee by fee; the client sees the breakup and pays the total online, and it
 * lands in the payment history by itself.
 *
 * createPartPaidMatter: ₹10,000 total, ₹4,000 paid, ₹6,000 due. A request of
 * ₹1,500 makes it ₹11,500 total and ₹7,500 due, of which Pay Now pays ₹6,000.
 *
 * The API-level tests run anywhere; the payment tests need the SIMULATED
 * gateway (QA and the local test stack) and skip where real money would move.
 */
const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
const LINES = [
  { name: 'ROC filing fee', description: 'Form INC-32', amount: 1000 },
  { name: 'Stamp duty', amount: 500 },
];

type Req = { id: string; status: string; total: number; lines: { name: string; amount: number }[]; createdByName?: string };
type Ledger = { payments: { amount: number; mode: string }[]; amountDue: number; amountPaid: number; totalCost: number; paymentStatus: string };

const ledger = async (taskId: string): Promise<Ledger> => {
  const admin = await apiAs('admin');
  try { return await (await admin.get(`/api/tasks/${taskId}/payments`)).json(); } finally { await admin.dispose(); }
};
const listAs = async (role: 'admin' | 'client' | 'team', taskId: string): Promise<{ requests: Req[]; outstanding: number }> => {
  const who = await apiAs(role);
  try { return await (await who.get(`/api/tasks/${taskId}/payment-requests`)).json(); } finally { await who.dispose(); }
};
const sendAs = async (role: 'admin' | 'manager' | 'team', taskId: string, body: Record<string, unknown> = { lines: LINES }) => {
  const who = await apiAs(role);
  try {
    const res = await who.post(`/api/tasks/${taskId}/payment-requests`, { data: body });
    return { status: res.status(), body: await res.json().catch(() => null) };
  } finally { await who.dispose(); }
};

const matters: string[] = [];
const orders: string[] = [];

test.afterAll(async () => {
  const client = await apiAs('client');
  for (const id of orders) await client.post(`/api/orders/${id}/simulate`, { data: { outcome: 'discard' } }).catch(() => {});
  await client.dispose();
  for (const id of matters) await deleteMatter(id).catch(() => {});
});

test.describe('#222 payment requests — rules', () => {
  test('the server adds up the lines; a tampered total or bad line is refused', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    // A total of the page's own is refused outright, as is any extra field.
    expect((await sendAs('admin', taskId, { lines: LINES, total: 1 })).status).toBe(400);
    expect((await sendAs('admin', taskId, { lines: [{ name: 'Fee', amount: -100 }] })).status).toBe(400);
    expect((await sendAs('admin', taskId, { lines: [{ name: 'Fee', amount: 10.005 }] })).status).toBe(400);
    expect((await sendAs('admin', taskId, { lines: [] })).status).toBe(400);
    expect((await sendAs('admin', taskId, { lines: [{ name: 'Fee', amount: 100, total: 1 }] })).status).toBe(400);

    const sent = await sendAs('admin', taskId);
    expect(sent.status, JSON.stringify(sent.body)).toBe(201);
    expect(sent.body.request.total).toBe(1500);
    expect(sent.body.request.status).toBe('sent');
    // Added to what the matter costs, so the amount due includes it.
    expect(sent.body.totalCost).toBe(11500);
    expect(sent.body.amountDue).toBe(7500);
    const m = await getMatter(taskId);
    expect(m.totalCost).toBe(11500);
    expect(m.amountDue).toBe(7500);
  });

  test('any member of staff sends; only admin / manager cancel; the client cannot send', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    const byTeam = await sendAs('team', taskId);
    expect(byTeam.status, JSON.stringify(byTeam.body)).toBe(201);
    const requestId = byTeam.body.request.id as string;

    const client = await apiAs('client');
    expect((await client.post(`/api/tasks/${taskId}/payment-requests`, { data: { lines: LINES } })).status()).toBe(403);
    expect((await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/cancel`, { data: {} })).status()).toBe(403);
    expect((await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/record`, { data: { mode: 'Cash' } })).status()).toBe(403);
    await client.dispose();

    const team = await apiAs('team');
    expect((await team.post(`/api/tasks/${taskId}/payment-requests/${requestId}/cancel`, { data: {} })).status()).toBe(403);
    // Starting a payment is the client's alone.
    expect((await team.post(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { data: {} })).status()).toBe(403);
    await team.dispose();

    // The client sees the breakup and total, but not which member of staff raised it.
    const seen = await listAs('client', taskId);
    expect(seen.requests).toHaveLength(1);
    expect(seen.requests[0].lines.map((l) => l.name)).toEqual(['ROC filing fee', 'Stamp duty']);
    expect(seen.requests[0].total).toBe(1500);
    expect(seen.requests[0].createdByName).toBeUndefined();
    expect(seen.outstanding).toBe(1500);

    // A manager cancels: the total comes off the matter, and the client no longer sees it.
    const manager = await apiAs('manager');
    const cancelled = await manager.post(`/api/tasks/${taskId}/payment-requests/${requestId}/cancel`, { data: { reason: 'Raised twice' } });
    expect(cancelled.status(), await cancelled.text()).toBe(200);
    expect((await manager.post(`/api/tasks/${taskId}/payment-requests/${requestId}/cancel`, { data: {} })).status()).toBe(409);
    await manager.dispose();
    expect((await getMatter(taskId)).totalCost).toBe(10000);
    expect((await listAs('client', taskId)).requests).toHaveLength(0);
    expect((await listAs('admin', taskId)).requests[0].status).toBe('cancelled');
  });

  test('a manager records a request paid by hand: it joins the payment history once', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);
    const { body } = await sendAs('manager', taskId);
    const manager = await apiAs('manager');
    // The amount is the request's: one sent with the recording is refused.
    expect((await manager.post(`/api/tasks/${taskId}/payment-requests/${body.request.id}/record`, { data: { mode: 'Cash', amount: 1 } })).status()).toBe(400);
    const ok = await manager.post(`/api/tasks/${taskId}/payment-requests/${body.request.id}/record`, { data: { mode: 'Bank Transfer', reference: 'UTR123' } });
    expect(ok.status(), await ok.text()).toBe(200);
    const again = await manager.post(`/api/tasks/${taskId}/payment-requests/${body.request.id}/record`, { data: { mode: 'Cash' } });
    expect(again.status()).toBe(409);
    await manager.dispose();

    const l = await ledger(taskId);
    expect(l.amountPaid).toBe(5500);
    expect(l.amountDue).toBe(6000);
    expect(l.payments.filter((p) => p.amount === 1500)).toHaveLength(1);
  });
});

test.describe.serial('#222 payment requests — paying online (simulated gateway)', () => {
  test.beforeAll(async () => {
    const anon = await request.newContext({ baseURL: API() });
    try {
      const config = await (await anon.get('/api/orders/config')).json();
      test.skip(config.gateway !== 'simulated', 'the simulated gateway is not active in this environment');
    } finally { await anon.dispose(); }
  });

  test('staff compose a request; the client sees the breakup and pays it', async ({ adminPage, clientPage }) => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Payments', exact: true }).click();
    await adminPage.getByRole('button', { name: 'Request additional payment' }).click();
    await adminPage.getByLabel('Fee 1 name').fill('ROC filing fee');
    await adminPage.getByLabel('Fee 1 description').fill('Form INC-32');
    await adminPage.getByLabel('Fee 1 amount').fill('1000');
    // Lines can be added and removed before sending; the total follows.
    await adminPage.getByRole('button', { name: 'Add another fee' }).click();
    await adminPage.getByLabel('Fee 2 name').fill('Mistake');
    await adminPage.getByLabel('Fee 2 amount').fill('99');
    await expect(adminPage.getByTestId('request-total')).toHaveText('₹1,099');
    await adminPage.getByRole('button', { name: 'Remove fee 2' }).click();
    await adminPage.getByRole('button', { name: 'Add another fee' }).click();
    await adminPage.getByLabel('Fee 2 name').fill('Stamp duty');
    await adminPage.getByLabel('Fee 2 amount').fill('500');
    await expect(adminPage.getByTestId('request-total')).toHaveText('₹1,500');
    await adminPage.getByRole('button', { name: 'Send to client' }).click();
    await adminPage.getByRole('dialog').getByRole('button', { name: 'Send request' }).click();
    await expect(adminPage.getByText('Payment request sent to the client.')).toBeVisible({ timeout: 15_000 });
    await expect(adminPage.getByTestId('payment-request').first()).toHaveAttribute('data-status', 'sent');

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Payments', exact: true }).click();
    const card = clientPage.getByTestId('payment-request').first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByText('ROC filing fee')).toBeVisible();
    await expect(card.getByText('Form INC-32')).toBeVisible();
    await expect(card.getByText('Stamp duty')).toBeVisible();
    await expect(card.getByTestId('payment-request-total')).toHaveText('₹1,500');
    // Pay Now offers only the rest of the balance — the request has its own button.
    await expect(clientPage.getByRole('button', { name: /Pay Now ₹6,000/ })).toBeVisible();

    await card.getByRole('button', { name: 'Pay ₹1,500' }).click();
    await clientPage.getByRole('button', { name: 'Complete test payment' }).click();
    await expect(clientPage.getByText('Payment of ₹1,500 received. Thank you.')).toBeVisible({ timeout: 15_000 });

    await expect(async () => {
      const l = await ledger(taskId);
      expect(l.totalCost).toBe(11500);
      expect(l.amountPaid).toBe(5500);
      expect(l.amountDue).toBe(6000);
      expect(l.payments.filter((p) => p.mode === 'Online (test payment)').map((p) => p.amount)).toEqual([1500]);
      expect((await listAs('admin', taskId)).requests[0].status).toBe('paid');
    }).toPass({ timeout: 15_000 });
  });

  test('the amount is the request’s; clicking twice reuses the order; a double report pays once', async () => {
    const taskId = await createPartPaidMatter();
    matters.push(taskId);
    const { body } = await sendAs('admin', taskId);
    const requestId = body.request.id as string;

    const client = await apiAs('client');
    expect((await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { data: { amount: 1 } })).status()).toBe(400);
    const res = await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { data: {} });
    expect(res.status(), await res.text()).toBe(201);
    const order = await res.json();
    orders.push(order.orderId);
    expect(order.amount).toBe(1500);
    expect(order.matterId).toBe(taskId);
    const again = await (await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { data: {} })).json();
    expect(again.orderId).toBe(order.orderId);

    await client.post(`/api/orders/${order.orderId}/simulate`, { data: { outcome: 'duplicate_webhook' } });
    await expect(async () => {
      const l = await ledger(taskId);
      expect(l.payments.filter((p) => p.mode === 'Online (test payment)')).toHaveLength(1);
      expect(l.amountPaid).toBe(5500);
    }).toPass({ timeout: 15_000 });

    // Paid: there is nothing more to pay on it.
    const after = await client.post(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { data: {} });
    expect(after.status()).toBe(409);
    expect((await after.json()).code).toBe('ALREADY_PAID');
    await client.dispose();
  });
});

test('#222: a team member gets a "Payment requests" tab, never the payment figures', async ({ teamPage }) => {
  const taskId = await createPartPaidMatter();
  matters.push(taskId);
  await teamPage.goto(`tasks/${taskId}`);
  await teamPage.getByRole('button', { name: 'Payment requests', exact: true }).click();
  await expect(teamPage.getByRole('button', { name: 'Request additional payment' })).toBeVisible({ timeout: 15_000 });
  // #148 still holds: no Payments tab, no history, no figures.
  await expect(teamPage.getByRole('button', { name: 'Payments', exact: true })).toHaveCount(0);
  await expect(teamPage.getByText('Payment history')).toHaveCount(0);
  await expect(teamPage.getByText('Amount due')).toHaveCount(0);
});
