import { test, expect } from './fixtures';
import { request, type APIRequestContext, type Page } from '@playwright/test';
import { apiAs } from './api';

/**
 * #256, #257, #260 — coupon codes, end to end with the payment gateway
 * SIMULATED (as orders.spec.ts does).
 *
 * - An admin creates a coupon of each kind on Settings → Coupons; a manager may
 *   too; a team member and a client may not, on the screen or the API.
 * - The SERVER prices an order with a code: the discount comes off before GST,
 *   a code that does not fit the order is refused in words, and an amount (or a
 *   discount) sent by the page is refused.
 * - A one-time code is held by one checkout, used up by its payment, and then
 *   refused to everyone; the Coupon & Discount report shows that use.
 *
 * Everything is made for this run and removed after it: the orders through the
 * simulator's `discard` (which also takes back their coupon uses), then the
 * coupons.
 */

const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
type Product = { choice?: unknown; key: string; code: string; label: string; plans: { id: string; price: number; active: boolean }[] };
type Line = { productKey: string; planId: string; price: number; label: string; code: string };
type Quote = { lines: { productKey: string; listPrice: number; discount: number; price: number; gst: number; amount: number }[];
  subtotalBeforeDiscount: number; discount: number; price: number; gst: number; gstPercent: number; amount: number; coupon: { code: string } | null };

const RUN = Date.now().toString(36).toUpperCase().slice(-6);
const CODES = {
  percent: `E2E-PCT-${RUN}`,
  services: `E2E-SVC-${RUN}`,
  minimum: `E2E-MIN-${RUN}`,
  once: `E2E-ONE-${RUN}`,
  manager: `E2E-MGR-${RUN}`,
};

let a: Line;
let b: Line;
let gstPercent = 0;
const paise = (n: number) => Math.round(n * 100) / 100;
/** The server's rule: GST on the price after the discount, to the paisa. */
const charged = (price: number) => paise(price + Math.round(price * gstPercent) / 100);
const todayIst = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

/** Orders made by this run, with who made them — the simulator discards only its owner's. */
const started: { orderId: string; by: 'client' | 'admin' }[] = [];

const order = async (buyer: APIRequestContext, by: 'client' | 'admin', data: Record<string, unknown>) => {
  const res = await buyer.post('/api/orders', { data });
  // A response body can be read again by the test that made it.
  if (res.status() === 201) started.push({ orderId: (await res.json()).orderId, by });
  return res;
};
const quote = (buyer: APIRequestContext, data: Record<string, unknown>) => buyer.post('/api/orders/quote', { data });
const one = (l: Line) => ({ productKey: l.productKey, planId: l.planId });

/** Open the new-coupon form and fill the code and discount. */
async function startForm(page: Page, code: string, type: 'Percentage' | 'Fixed amount', value: number) {
  await page.goto('settings/coupons');
  await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
  await page.getByRole('button', { name: 'New coupon' }).click();
  await expect(page.getByRole('heading', { name: 'New coupon' })).toBeVisible();
  await page.getByLabel('Code', { exact: true }).fill(code);
  await page.getByRole('radio', { name: new RegExp(`^${type}`) }).check();
  await page.getByLabel(type === 'Percentage' ? 'Discount (%)' : 'Discount (₹)', { exact: true }).fill(String(value));
}

async function saveForm(page: Page, code: string) {
  await page.getByRole('button', { name: 'Create coupon' }).click();
  await expect(page.getByText(`Coupon ${code} created.`)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Coupons' })).toBeVisible();
  await expect(page.locator('table').getByText(code, { exact: true })).toBeVisible();
}

test.describe.serial('Coupons #256 #257 #260 (simulated gateway)', () => {
  test.beforeAll(async () => {
    const admin = await apiAs('admin');
    const anon = await request.newContext({ baseURL: API() });
    try {
      const config = await (await anon.get('/api/orders/config')).json();
      test.skip(config.gateway !== 'simulated', 'the simulated gateway is not active in this environment');
      const products = ((await (await admin.get('/api/pricing')).json()).products as Product[])
        // #221: a product that asks a question (trademark's user type) needs an answer; not used here.
        .filter((p) => p.plans.some((x) => x.active) && !p.choice);
      test.skip(products.length < 2, 'need two services on sale in the price catalogue');
      const pick = (p: Product): Line => {
        const plan = p.plans.find((x) => x.active)!;
        return { productKey: p.key, planId: plan.id, price: plan.price, label: p.label, code: p.code };
      };
      [a, b] = [pick(products[0]), pick(products[1])];
      gstPercent = (await (await anon.get('/api/public/pricing')).json()).gstPercent;
      expect(gstPercent).toBeGreaterThan(0);
    } finally { await admin.dispose(); await anon.dispose(); }
  });

  test.afterAll(async () => {
    const client = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      for (const s of started) {
        await (s.by === 'client' ? client : admin).post(`/api/orders/${s.orderId}/simulate`, { data: { outcome: 'discard' } });
      }
      for (const code of Object.values(CODES)) await admin.delete(`/api/coupons/${code}`);
    } finally { await client.dispose(); await admin.dispose(); }
  });

  test('an admin creates a coupon of each kind on the Coupons screen', async ({ adminPage: page }) => {
    // General, percentage, valid for 7 days from today.
    await startForm(page, CODES.percent, 'Percentage', 10);
    await saveForm(page, CODES.percent);

    // Specific services, a fixed amount, valid for 30 days.
    await startForm(page, CODES.services, 'Fixed amount', 500);
    await page.getByRole('radio', { name: /^Specific services/ }).check();
    // Nothing chosen yet: the form says so instead of saving.
    await page.getByRole('button', { name: 'Create coupon' }).click();
    await expect(page.getByRole('alert')).toContainText('Choose at least one service');
    await page.getByLabel('Search services').fill(b.label);
    await page.getByRole('checkbox', { name: new RegExp(b.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().check();
    await page.getByLabel('Valid for').selectOption('30');
    await saveForm(page, CODES.services);

    // Minimum order amount — a + b together reach it, a alone does not — chosen dates.
    await startForm(page, CODES.minimum, 'Percentage', 5);
    await page.getByRole('radio', { name: /^Minimum order amount/ }).check();
    await page.getByLabel('Minimum order, before GST (₹)').fill(String(a.price + b.price));
    await page.getByLabel('Valid for').selectOption('custom');
    await page.getByLabel('First day').fill(todayIst());
    await page.getByLabel('Last day').fill(todayIst());
    await saveForm(page, CODES.minimum);

    // One-time use. A percentage over 100 is refused first.
    await startForm(page, CODES.once, 'Percentage', 150);
    await page.getByRole('radio', { name: /^One-time use/ }).check();
    await page.getByRole('button', { name: 'Create coupon' }).click();
    await expect(page.getByRole('alert')).toContainText('at most 100%');
    await page.getByLabel('Discount (%)', { exact: true }).fill('20');
    await saveForm(page, CODES.once);
    await expect(page.locator('table tr', { hasText: CODES.once })).toContainText('One-time use');

    // What was saved is what was entered.
    const admin = await apiAs('admin');
    try {
      const svc = await (await admin.get(`/api/coupons/${CODES.services}`)).json();
      expect([svc.discountType, svc.discountValue, svc.scope, svc.productKeys, svc.validity, svc.state])
        .toEqual(['fixed', 500, 'services', [b.productKey], 'period', 'active']);
      const min = await (await admin.get(`/api/coupons/${CODES.minimum}`)).json();
      expect([min.scope, min.minAmount]).toEqual(['min_amount', a.price + b.price]);
      // A code is unique.
      const dup = await admin.post('/api/coupons', { data: { code: CODES.percent, discountType: 'percent', discountValue: 5, scope: 'general', validity: 'one_time' } });
      expect(dup.status()).toBe(409);
      expect((await dup.json()).message).toContain('already exists');
    } finally { await admin.dispose(); }
  });

  test('a manager can manage coupons; a team member and a client cannot', async ({ managerPage, teamPage, clientPage }) => {
    await managerPage.goto('settings/coupons');
    await expect(managerPage.getByRole('heading', { name: 'Coupons' })).toBeVisible();
    await managerPage.goto('reports/coupons');
    await expect(managerPage.getByRole('heading', { name: 'Coupon & discount report' })).toBeVisible();
    for (const page of [teamPage, clientPage]) {
      await page.goto('settings/coupons');
      await expect(page).not.toHaveURL(/\/settings\/coupons(\?|$)/);
      await page.goto('reports/coupons');
      await expect(page).not.toHaveURL(/\/reports\/coupons(\?|$)/);
    }
    const body = { code: CODES.manager, discountType: 'percent', discountValue: 5, scope: 'general', validity: 'one_time' };
    const manager = await apiAs('manager');
    const team = await apiAs('team');
    const client = await apiAs('client');
    const anon = await request.newContext({ baseURL: API() });
    try {
      expect((await manager.post('/api/coupons', { data: body })).status()).toBe(201);
      expect((await manager.patch(`/api/coupons/${CODES.manager}`, { data: { active: false } })).status()).toBe(200);
      for (const who of [team, client]) {
        expect((await who.get('/api/coupons')).status()).toBe(403);
        expect((await who.post('/api/coupons', { data: { ...body, code: `${CODES.manager}-X` } })).status()).toBe(403);
        expect((await who.get('/api/coupons/redemptions')).status()).toBe(403);
      }
      expect((await anon.get('/api/coupons')).status()).toBe(401);
      expect((await anon.post('/api/orders/quote', { data: { ...one(a), couponCode: CODES.percent } })).status()).toBe(401);
    } finally { await manager.dispose(); await team.dispose(); await client.dispose(); await anon.dispose(); }
  });

  test('the server prices the order with the code; a code that does not fit is refused in words', async () => {
    const client = await apiAs('client');
    try {
      // 10% off before GST; GST on what is left.
      const q = await quote(client, { ...one(a), couponCode: CODES.percent.toLowerCase() });
      expect(q.status()).toBe(200);
      const priced = await q.json() as Quote;
      const off = Math.round(a.price * 10) / 100;
      expect(priced.coupon?.code).toBe(CODES.percent);
      expect([priced.subtotalBeforeDiscount, priced.discount, priced.price]).toEqual([a.price, off, paise(a.price - off)]);
      expect(priced.amount).toBe(charged(paise(a.price - off)));

      // The order is priced the same, by the server, from the code alone.
      const res = await order(client, 'client', { ...one(a), couponCode: CODES.percent });
      expect(res.status()).toBe(201);
      const made = await res.json();
      expect([made.couponCode, made.discount, made.amount]).toEqual([CODES.percent, off, priced.amount]);
      // A page cannot send its own amount or discount.
      expect((await client.post('/api/orders', { data: { ...one(a), couponCode: CODES.percent, amount: 1 } })).status()).toBe(400);
      expect((await client.post('/api/orders', { data: { ...one(a), couponCode: CODES.percent, discount: a.price } })).status()).toBe(400);
      expect((await client.post('/api/orders/quote', { data: { ...one(a), amount: 1 } })).status()).toBe(400);

      // Specific services: not for a; for b only, in a cart of both.
      const wrong = await quote(client, { ...one(a), couponCode: CODES.services });
      expect(wrong.status()).toBe(422);
      expect((await wrong.json()).message).toBe(`This code applies only to: ${b.label}.`);
      const cart = await (await quote(client, { items: [one(a), one(b)], couponCode: CODES.services })).json() as Quote;
      expect(cart.lines.map((l) => l.discount)).toEqual([0, Math.min(500, b.price)]);

      // Minimum order amount: a alone is short by b's price.
      const short = await quote(client, { ...one(a), couponCode: CODES.minimum });
      expect(short.status()).toBe(422);
      expect((await short.json()).message).toMatch(/needs an order of at least ₹.+ before GST — add ₹.+ more\./);
      expect((await quote(client, { items: [one(a), one(b)], couponCode: CODES.minimum })).status()).toBe(200);

      // An unknown code, or one switched off.
      const unknown = await quote(client, { ...one(a), couponCode: 'NO-SUCH-CODE' });
      expect([unknown.status(), (await unknown.json()).message]).toEqual([422, 'This coupon code is not valid. Check the code and try again.']);
      expect((await quote(client, { ...one(a), couponCode: CODES.manager })).status()).toBe(422);
      // No code: the plain price.
      expect((await (await quote(client, one(a))).json() as Quote).amount).toBe(charged(a.price));
    } finally { await client.dispose(); }
  });

  test('a one-time code is held by one checkout, used by its payment, then refused to everyone', async () => {
    const client = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const res = await order(client, 'client', { ...one(a), couponCode: CODES.once });
      expect(res.status()).toBe(201);
      const made = await res.json();
      expect(made.discount).toBe(Math.round(a.price * 20) / 100);

      // Another person's checkout meanwhile is turned away; the coupon says where it is.
      const held = await quote(admin, { ...one(a), couponCode: CODES.once });
      expect(held.status()).toBe(409);
      expect((await held.json()).message).toBe('This code is being used in another checkout. Try again in a few minutes.');
      expect((await order(admin, 'admin', { ...one(a), couponCode: CODES.once })).status()).toBe(409);
      expect((await (await admin.get(`/api/coupons/${CODES.once}`)).json()).state).toBe('in_checkout');

      // The client pays.
      const paid = await (await client.post(`/api/orders/${made.orderId}/simulate`, { data: { outcome: 'success' } })).json();
      const verify = await client.post(`/api/orders/${made.orderId}/verify`, { data: paid });
      expect(verify.status()).toBe(200);
      expect((await verify.json()).status).toBe('paid');
      // The same confirmation again does not count the code twice.
      expect((await client.post(`/api/orders/${made.orderId}/simulate`, { data: { outcome: 'success_webhook' } })).status()).toBe(200);

      const used = await (await admin.get(`/api/coupons/${CODES.once}`)).json();
      expect([used.state, used.active, used.usedCount, used.consumedBy?.orderId]).toEqual(['used', false, 1, made.orderId]);
      for (const who of [admin, client]) {
        const again = await quote(who, { ...one(a), couponCode: CODES.once });
        expect([again.status(), (await again.json()).message]).toEqual([422, 'This code has already been used.']);
      }
      // A used code is history: it cannot be switched on again or deleted.
      expect((await admin.patch(`/api/coupons/${CODES.once}`, { data: { active: true } })).status()).toBe(409);
      expect((await admin.delete(`/api/coupons/${CODES.once}`)).status()).toBe(409);

      // The redemption, with its own figures.
      const report = await (await admin.get('/api/coupons/redemptions?limit=100')).json();
      const r = report.data.find((x: { orderId: string }) => x.orderId === made.orderId);
      expect(r).toBeTruthy();
      expect([r.code, r.discountType, r.discountValue, r.originalAmount, r.discount, r.amountPaid])
        .toEqual([CODES.once, 'percent', 20, a.price, made.discount, made.amount]);
      expect(paise(r.originalAmount - r.discount + r.gst)).toBe(r.amountPaid);
      const csv = await admin.get('/api/coupons/redemptions?format=csv');
      expect(csv.headers()['content-type']).toContain('text/csv');
      expect(await csv.text()).toContain(CODES.once);
    } finally { await client.dispose(); await admin.dispose(); }
  });

  test('the Coupon & Discount report shows the use and the uses per coupon', async ({ adminPage: page }) => {
    await page.goto('reports');
    await page.getByRole('link', { name: /Coupon & Discount/ }).click();
    await expect(page.getByRole('heading', { name: 'Coupon & discount report' })).toBeVisible();
    const row = page.locator('table tr', { hasText: CODES.once });
    await expect(row).toBeVisible({ timeout: 15_000 });
    await expect(row).toContainText('20% off');
    await expect(row).toContainText(a.label);
    await expect(page.getByRole('list', { name: 'Uses per coupon' }).getByRole('listitem').filter({ hasText: CODES.once })).toContainText('1 use');
    // Dates with no use say so.
    await page.getByLabel('Used from').fill('2001-01-01');
    await page.getByLabel('Used to').fill('2001-01-02');
    await expect(page.getByText('No coupon has been used in these dates.')).toBeVisible();
  });

  test('switching a coupon off stops it working; switching it on again restores it', async ({ adminPage: page }) => {
    await page.goto('settings/coupons');
    await page.getByRole('button', { name: `Switch off coupon ${CODES.percent}` }).first().click();
    await expect(page.getByText(`${CODES.percent} is switched off.`)).toBeVisible();
    const client = await apiAs('client');
    try {
      expect((await quote(client, { ...one(a), couponCode: CODES.percent })).status()).toBe(422);
      await page.getByRole('button', { name: `Switch on coupon ${CODES.percent}` }).first().click();
      await expect(page.getByText(`${CODES.percent} is switched on.`)).toBeVisible();
      expect((await quote(client, { ...one(a), couponCode: CODES.percent })).status()).toBe(200);
    } finally { await client.dispose(); }
  });
});
