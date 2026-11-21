import { test, expect } from './fixtures';
import { request, type Page } from '@playwright/test';
import {
  apiAs, apiAsCredentials, createMatter, createThrowawayClient, deleteMatter, deleteUser, resolveServiceKey,
  signUpWithPassword,
} from './api';
import { openMatter } from './helpers';

/**
 * #240 — the refund log, and #242 — the client dashboard before approval.
 *
 * Refunds are RECORDED and moved on by hand (Razorpay's refund API is not
 * connected), so everything here is our own rules: who may record and read,
 * never more than was paid, "Successfully Credited" only with a transaction id,
 * final is final, and a client sees only their own.
 *
 * The pre-approval tests buy through the SIMULATED gateway as a throwaway client
 * with no matters, and skip where the simulator is not active.
 */

const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
const today = () => new Date().toISOString().slice(0, 10);

test.describe.serial('#240 refund log on a matter', () => {
  let taskId: string;
  let otherClient: { uid: string } | null = null;
  let otherMatter: string | null = null;

  test.beforeAll(async () => {
    // Fully paid: ₹10,000 received (see createMatter).
    taskId = await createMatter();
  });
  test.afterAll(async () => {
    await deleteMatter(taskId);
    if (otherMatter) await deleteMatter(otherMatter);
    if (otherClient) await deleteUser(otherClient.uid);
  });

  test('who may record and read: admin/manager write, team never sees it, the client reads only', async () => {
    const team = await apiAs('team');
    const client = await apiAs('client');
    const manager = await apiAs('manager');
    try {
      const body = { reason: 'E2E guard', refundAmount: 1, initiatedAt: today() };
      expect((await team.get(`/api/tasks/${taskId}/refunds`)).status()).toBe(403);
      expect((await team.post(`/api/tasks/${taskId}/refunds`, { data: body })).status()).toBe(403);
      expect((await client.post(`/api/tasks/${taskId}/refunds`, { data: body })).status()).toBe(403);
      expect((await client.get(`/api/tasks/${taskId}/refunds`)).status()).toBe(200);
      expect((await manager.get(`/api/tasks/${taskId}/refunds`)).status()).toBe(200);
      const anon = await request.newContext({ baseURL: API() });
      expect((await anon.get(`/api/tasks/${taskId}/refunds`)).status()).toBe(401);
      await anon.dispose();
    } finally { await team.dispose(); await client.dispose(); await manager.dispose(); }
  });

  test('a client gets 404 for another client’s matter', async () => {
    otherClient = await createThrowawayClient();
    const admin = await apiAs('admin');
    const client = await apiAs('client');
    try {
      const res = await admin.post('/api/tasks', {
        data: { clientUid: otherClient.uid, serviceKey: await resolveServiceKey(), paymentStatus: 'fully_paid', totalCost: 5000, amountReceived: 5000, paymentMode: 'E2E' },
      });
      expect(res.ok()).toBe(true);
      otherMatter = (await res.json()).id as string;
      expect((await admin.post(`/api/tasks/${otherMatter}/refunds`, { data: { reason: 'Theirs', refundAmount: 100, initiatedAt: today() } })).status()).toBe(201);
      expect((await client.get(`/api/tasks/${otherMatter}/refunds`)).status()).toBe(404);
    } finally { await admin.dispose(); await client.dispose(); }
  });

  test('the server refuses: more than was paid, a payment amount from the page, credited without a transaction id', async () => {
    const admin = await apiAs('admin');
    try {
      const over = await admin.post(`/api/tasks/${taskId}/refunds`, { data: { reason: 'Too much', refundAmount: 10_001, initiatedAt: today() } });
      expect(over.status()).toBe(400);
      expect((await over.json()).code).toBe('REFUND_EXCEEDS_PAID');
      expect((await admin.post(`/api/tasks/${taskId}/refunds`, { data: { reason: 'x', refundAmount: 10, initiatedAt: today(), paymentAmount: 1 } })).status()).toBe(400);
      const noTxn = await admin.post(`/api/tasks/${taskId}/refunds`, { data: { reason: 'x', refundAmount: 10, initiatedAt: today(), status: 'credited' } });
      expect(noTxn.status()).toBe(400);
      expect((await noTxn.json()).code).toBe('TRANSACTION_ID_REQUIRED');
    } finally { await admin.dispose(); }
  });

  test('admin records a refund under Payments → Refund History; it does not change the amount paid', async ({ adminPage }) => {
    await openMatter(adminPage, taskId, 'Payments');
    const log = adminPage.getByTestId('refund-history');
    await expect(log.getByText('Refund history')).toBeVisible();
    await log.getByRole('button', { name: 'Record refund' }).click();
    await expect(log.getByLabel('Payment amount')).toHaveText('₹10,000');
    await log.getByLabel('Refund amount').fill('2500');
    await log.getByLabel('Refund reason').fill('E2E: part of the service was withdrawn');
    await log.getByRole('button', { name: 'Save refund' }).click();
    const row = log.getByTestId('refund-row').filter({ hasText: 'E2E: part of the service was withdrawn' });
    await expect(row).toBeVisible();
    await expect(row.locator('span', { hasText: /^Initiated$/ })).toBeVisible();

    // Move it on by hand: Processing, then Successfully Credited with its transaction id.
    await row.getByLabel(/^Status of refund/).selectOption('processing');
    await row.getByRole('button', { name: 'Update' }).click();
    await expect(row.locator('span', { hasText: /^Processing$/ })).toBeVisible();
    await row.getByLabel(/^Status of refund/).selectOption('credited');
    await expect(row.getByRole('button', { name: 'Update' })).toBeDisabled();
    await row.getByLabel(/^Transaction ID of refund/).fill('rfnd_E2E_240');
    await row.getByRole('button', { name: 'Update' }).click();
    await expect(row.getByText('Successfully Credited', { exact: true })).toBeVisible();
    await expect(log.getByTestId('refund-net')).toHaveText('₹7,500');

    // The ledger is untouched: still ₹10,000 paid, fully paid.
    const admin = await apiAs('admin');
    try {
      const m = await (await admin.get(`/api/tasks/${taskId}`)).json();
      expect(m.amountPaid).toBe(10_000);
      expect(m.paymentStatus).toBe('fully_paid');
      const log2 = await (await admin.get(`/api/tasks/${taskId}/refunds`)).json();
      const credited = log2.refunds.find((x: { transactionId: string }) => x.transactionId === 'rfnd_E2E_240');
      // Final is final.
      const again = await admin.patch(`/api/tasks/${taskId}/refunds/${credited.id}`, { data: { status: 'failed' } });
      expect(again.status()).toBe(409);
    } finally { await admin.dispose(); }
  });

  test('the client sees the refund read-only, and a Refund card on the dashboard', async ({ clientPage }) => {
    await openMatter(clientPage, taskId, 'Payments');
    const log = clientPage.getByTestId('refund-history');
    await expect(log.getByText('E2E: part of the service was withdrawn')).toBeVisible();
    await expect(log.getByText('Successfully Credited', { exact: true })).toBeVisible();
    await expect(log.getByRole('button', { name: 'Record refund' })).toHaveCount(0);
    await expect(log.getByRole('button', { name: 'Update' })).toHaveCount(0);
    await expect(log.getByText(/recorded by/)).toHaveCount(0);

    const client = await apiAs('client');
    try {
      const body = await (await client.get(`/api/tasks/${taskId}/refunds`)).json();
      expect(body.refunds[0].recordedByName).toBeUndefined();
    } finally { await client.dispose(); }

    await clientPage.goto('dashboard');
    await expect(clientPage.getByTestId('stat-refund')).toBeVisible();
    await expect(clientPage.getByTestId('stat-refund')).toContainText('Refund');
  });
});

/* ─────────────── #242 the dashboard before approval (+ #240 on an order) ─────────────── */

async function signIn(page: Page, email: string, password: string) {
  await page.goto('login');
  await page.getByRole('heading', { name: 'Sign in' }).waitFor({ timeout: 20_000 });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL((url) => !/\/login(\?|$)/.test(url.pathname + url.search), { timeout: 60_000 });
}

test.describe.serial('#242 client dashboard before approval', () => {
  const password = `E2e-${Date.now()}-Pw!`;
  const email = `e2e-buyer-${Date.now()}@legalterminus.test`;
  let uid = '';
  let orderId = '';

  test.beforeAll(async () => {
    const anon = await request.newContext({ baseURL: API() });
    const admin = await apiAs('admin');
    try {
      const config = await (await anon.get('/api/orders/config')).json();
      test.skip(config.gateway !== 'simulated', 'the simulated gateway is not active in this environment');
      // A fresh client with NO matters — the state the website buyer is in.
      await signUpWithPassword(email, password);
      const res = await admin.post('/api/portal/users', {
        data: { name: 'E2E Website Buyer', email, phone: '9990002222', role: 'client', organisation: 'E2E Buyer Co', professionalName: 'E2E', address: '1 Test Street', contactDesignation: 'Owner' },
      });
      expect(res.ok(), await res.text()).toBe(true);
      uid = (await res.json()).uid;

      // Buy a service that has a workflow, so the paid order waits for approval.
      const products = (await (await admin.get('/api/pricing')).json()).products as { key: string; serviceKey: string | null; plans: { id: string; active: boolean }[] }[];
      const defs = await (await admin.get('/api/workflow-definitions')).json() as { serviceKeys?: string[] }[];
      const covered = new Set(defs.flatMap((d) => d.serviceKeys ?? []));
      const product = products.find((p) => p.serviceKey && covered.has(p.serviceKey) && p.plans.some((x) => x.active));
      test.skip(!product, 'no website product with a workflow in this database');
      const buyer = await apiAsCredentials(email, password);
      try {
        const order = await (await buyer.post('/api/orders', { data: { productKey: product!.key, planId: product!.plans.find((x) => x.active)!.id } })).json();
        orderId = order.orderId;
        const paid = await (await buyer.post(`/api/orders/${orderId}/simulate`, { data: { outcome: 'success' } })).json();
        expect((await buyer.post(`/api/orders/${orderId}/verify`, { data: paid })).status()).toBe(200);
      } finally { await buyer.dispose(); }
    } finally { await anon.dispose(); await admin.dispose(); }
  });

  test.afterAll(async () => {
    if (orderId) {
      try {
        const buyer = await apiAsCredentials(email, password);
        await buyer.post(`/api/orders/${orderId}/simulate`, { data: { outcome: 'discard' } });
        await buyer.dispose();
      } catch { /* best-effort */ }
    }
    if (uid) await deleteUser(uid);
  });

  test('/api/orders/mine: the buyer’s own requests only; staff are refused', async () => {
    const buyer = await apiAsCredentials(email, password);
    const team = await apiAs('team');
    const other = await apiAs('client');
    try {
      const mine = (await (await buyer.get('/api/orders/mine')).json()).data as { orderId: string; stage: string; matterId: string | null }[];
      const o = mine.find((x) => x.orderId === orderId);
      expect(o?.stage).toBe('awaiting_approval');
      expect(o?.matterId).toBeNull();
      expect((await team.get('/api/orders/mine')).status()).toBe(403);
      const theirs = (await (await other.get('/api/orders/mine')).json()).data as { orderId: string }[];
      expect(theirs.some((x) => x.orderId === orderId), 'another client never sees it').toBe(false);
    } finally { await buyer.dispose(); await team.dispose(); await other.dispose(); }
  });

  test('before approval: Pending Approval, the four request cards, and no ₹0 due or progress', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      await signIn(page, email, password);
      await page.goto('dashboard');
      await expect(page.getByTestId('pending-approval-notice')).toContainText('Pending approval');
      await expect(page.getByTestId('pending-approval-notice')).toContainText('received your payment');
      await expect(page.getByTestId('stat-payment-status')).toContainText('Paid');
      await expect(page.getByTestId('stat-matter-status')).toContainText('Pending approval');
      await expect(page.getByTestId('stat-amount-paid')).not.toContainText('₹0');
      await expect(page.getByTestId('stat-service-requests')).toContainText('1');
      await expect(page.getByTestId('stat-amount-due')).toHaveCount(0);
      await expect(page.getByTestId('stat-in-progress')).toHaveCount(0);
      await expect(page.getByTestId('stat-refund')).toHaveCount(0);
      await expect(page.getByTestId('service-request')).toContainText('Pending approval');
    } finally { await ctx.close(); }
  });

  test('cancelled and refunded before approval: approval is refused and the client sees Refunded', async ({ browser }) => {
    const admin = await apiAs('admin');
    const team = await apiAs('team');
    try {
      const full = await (await admin.get(`/api/orders/${orderId}`)).json();
      const paid = full.amountPaid ?? full.amount;
      expect((await team.post(`/api/orders/${orderId}/refunds`, { data: { reason: 'x', refundAmount: 1, initiatedAt: today() } })).status()).toBe(403);
      expect((await admin.post(`/api/orders/${orderId}/refunds`, { data: { reason: 'x', refundAmount: paid + 1, initiatedAt: today() } })).status()).toBe(400);
      const rec = await admin.post(`/api/orders/${orderId}/refunds`, { data: { reason: 'E2E: cancelled before work began', refundAmount: paid, initiatedAt: today() } });
      expect(rec.status()).toBe(201);
      const refundId = (await rec.json()).id;
      // A standing refund means the service was cancelled: no matter is opened.
      expect((await admin.post(`/api/orders/${orderId}/approve`)).status()).toBe(409);
      const done = await admin.patch(`/api/orders/${orderId}/refunds/${refundId}`, { data: { status: 'credited', transactionId: 'rfnd_E2E_242' } });
      expect(done.status()).toBe(200);
      expect((await (await admin.get(`/api/orders/${orderId}`)).json()).status).toBe('refunded');
    } finally { await admin.dispose(); await team.dispose(); }

    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      await signIn(page, email, password);
      await page.goto('dashboard');
      await expect(page.getByTestId('pending-approval-notice')).toContainText('Service cancelled');
      await expect(page.getByTestId('stat-payment-status')).toContainText('Refunded');
      await expect(page.getByTestId('stat-matter-status')).toContainText('Cancelled');
      await expect(page.getByTestId('service-request-refund')).toContainText('E2E: cancelled before work began');
      await expect(page.getByTestId('service-request-refund')).toContainText('Successfully Credited');
      await expect(page.getByTestId('stat-refund')).toContainText('Successfully Credited');
    } finally { await ctx.close(); }
  });
});
