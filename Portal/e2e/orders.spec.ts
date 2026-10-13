import { test, expect } from './fixtures';
import { request, type APIRequestContext } from '@playwright/test';
import { apiAs, deleteMatter, getNotifications } from './api';
import { env } from './helpers';

/**
 * E24-S02 … S04 — a website payment, end to end, with the gateway SIMULATED.
 *
 * The simulator signs and verifies exactly as Razorpay does, so everything on
 * our side of the gateway is real: the server-owned amount, the signed return,
 * the signed webhook, settling once, opening the matter, and each failure in
 * the E24-S04 table. What is NOT covered here is Razorpay's own API and
 * checkout script.
 *
 * The buyer is the test client. Incorporation has a workflow, so a paid order
 * for it WAITS FOR APPROVAL and opens a matter once staff approve it (#212);
 * a service without one never does.
 *
 * #212 also made prices exclusive of GST: what is charged is price + GST.
 */

const API = () => process.env.E2E_API_BASE ?? 'http://localhost:5001';
type Pub = { orderId: string; status: string; price: number; gst: number; gstPercent: number; amount: number; matterId: string | null; failureReason: string | null; checkout?: { gateway: string } };
type Full = Pub & { matter: { state: string; taskId?: string; reason?: string; approvedBy?: string; approvedByName?: string }; uid: string; gatewayPaymentId?: string; reviewReason?: string };
type Product = { key: string; serviceKey: string | null; plans: { id: string; price: number; active: boolean }[] };

let withWorkflow: { productKey: string; planId: string; price: number };
let withoutWorkflow: { productKey: string; planId: string; price: number };
/** The GST rate, read from the server — never assumed here. */
let gstPercent = 0;
/** What a plan costs the customer: its price plus GST, to the paisa. */
const charged = (price: number) => Math.round(price * (100 + gstPercent)) / 100;
const matters: string[] = [];

/** A member of staff approves a paid order. Returns the response. */
const approve = async (orderId: string, role: 'admin' | 'manager' | 'team' | 'client' = 'admin') => {
  const who = await apiAs(role);
  try {
    const res = await who.post(`/api/orders/${orderId}/approve`);
    return { status: res.status(), body: await res.json() };
  } finally { await who.dispose(); }
};

const started: string[] = [];
const start = async (buyer: APIRequestContext, p: { productKey: string; planId: string }, extra: Record<string, unknown> = {}) => {
  const res = await buyer.post('/api/orders', { data: { productKey: p.productKey, planId: p.planId, ...extra } });
  // Remembered so the run can remove it: an order left behind shows on the
  // Website Orders screen linking to a matter this spec has already deleted.
  if (res.status() === 201) started.push((await res.json()).orderId);
  return res;
};
const simulate = async (buyer: APIRequestContext, orderId: string, outcome: string) =>
  (await buyer.post(`/api/orders/${orderId}/simulate`, { data: { outcome } })).json();
const mine = async (buyer: APIRequestContext, orderId: string): Promise<Pub> =>
  (await buyer.get(`/api/orders/${orderId}`)).json();
const full = async (orderId: string): Promise<Full> => {
  const admin = await apiAs('admin');
  try { return await (await admin.get(`/api/orders/${orderId}`)).json(); } finally { await admin.dispose(); }
};
const track = (o: { matterId?: string | null; matter?: { taskId?: string } }) => {
  const id = o.matterId ?? o.matter?.taskId;
  if (id && !matters.includes(id)) matters.push(id);
};
const staffTold = async (re: RegExp) => (await getNotifications('admin')).some((n) => re.test(n.title));

test.describe.serial('E24 website payments (simulated gateway)', () => {
  test.beforeAll(async () => {
    const admin = await apiAs('admin');
    const anon = await request.newContext({ baseURL: API() });
    try {
      const config = await (await anon.get('/api/orders/config')).json();
      test.skip(config.gateway !== 'simulated', 'the simulated gateway is not active in this environment');
      const products = (await (await admin.get('/api/pricing')).json()).products as Product[];
      test.skip(products.length === 0, 'the price catalogue is not seeded in this database');
      const defs = await (await admin.get('/api/workflow-definitions')).json() as { serviceKeys?: string[] }[];
      const covered = new Set(defs.flatMap((d) => d.serviceKeys ?? []));
      const pick = (p: Product) => { const plan = p.plans.find((x) => x.active)!; return { productKey: p.key, planId: plan.id, price: plan.price }; };
      const a = products.find((p) => p.serviceKey && covered.has(p.serviceKey));
      const b = products.find((p) => !p.serviceKey || !covered.has(p.serviceKey));
      test.skip(!a || !b, 'need one product with a workflow and one without');
      withWorkflow = pick(a!); withoutWorkflow = pick(b!);
      gstPercent = (await (await anon.get('/api/public/pricing')).json()).gstPercent;
      expect(gstPercent, 'the website is told the GST rate').toBeGreaterThan(0);
    } finally { await admin.dispose(); await anon.dispose(); }
  });

  test.afterAll(async () => {
    for (const id of matters) await deleteMatter(id);
    const buyer = await apiAs('client');
    try { for (const id of started) await simulate(buyer, id, 'discard'); } finally { await buyer.dispose(); }
  });

  test('the amount is the server’s: a price from the browser is refused, an unknown plan is not for sale', async () => {
    const buyer = await apiAs('client');
    const anon = await request.newContext({ baseURL: API() });
    try {
      expect((await start(buyer, withWorkflow, { amount: 1 })).status()).toBe(400);
      expect((await start(buyer, { productKey: withWorkflow.productKey, planId: 'no-such-plan' })).status()).toBe(404);
      expect((await anon.post('/api/orders', { data: withWorkflow })).status()).toBe(401);
      const res = await start(buyer, withWorkflow);
      expect(res.status()).toBe(201);
      const order = await res.json() as Pub;
      // #212: the price is exclusive of GST; the customer is charged price + GST.
      expect(order.price).toBe(withWorkflow.price);
      expect(order.gstPercent).toBe(gstPercent);
      expect(order.gst).toBe(Math.round(withWorkflow.price * gstPercent) / 100);
      expect(order.amount).toBe(charged(withWorkflow.price));
      expect(order.amount).toBeGreaterThan(order.price);
      expect(order.status).toBe('created');
      expect(order.checkout?.gateway).toBe('simulated');
    } finally { await buyer.dispose(); await anon.dispose(); }
  });

  test('a paid order waits for approval; a team member approves it and the matter opens, once', async () => {
    const buyer = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const paid = await simulate(buyer, order.orderId, 'success');
      const verify = await buyer.post(`/api/orders/${order.orderId}/verify`, { data: paid });
      expect(verify.status()).toBe(200);
      const after = await verify.json() as Pub;
      expect(after.status).toBe('paid');
      // #212: payment alone opens nothing.
      expect(after.matterId, 'no matter until staff approve').toBeNull();
      expect((await full(order.orderId)).matter.state).toBe('awaiting_approval');

      // The customer sees it in their own order history, and staff were asked to approve.
      const history = await (await buyer.get('/api/auth/me/orders')).json();
      expect(history.orders.some((o: { orderId: string; status: string }) => o.orderId === order.orderId && o.status === 'success')).toBe(true);
      await expect.poll(() => staffTold(/approve it to open the matter/), { timeout: 20_000 }).toBe(true);

      // The same confirmation again — by return AND by webhook — changes nothing,
      // and does not open a matter either.
      expect((await buyer.post(`/api/orders/${order.orderId}/verify`, { data: paid })).status()).toBe(200);
      expect((await simulate(buyer, order.orderId, 'success_webhook')).delivered.outcome).toBe('noop');
      expect((await full(order.orderId)).matter.state).toBe('awaiting_approval');

      // The customer cannot approve their own order; a team member can.
      expect((await approve(order.orderId, 'client')).status).toBe(403);
      const approved = await approve(order.orderId, 'team');
      expect(approved.status).toBe(200);
      const done = approved.body as Full;
      track(done);
      expect(done.matter.state).toBe('created');
      expect(done.matter.approvedBy, 'who approved is recorded').toBe(env('E2E_TEAM_UID'));

      const matter = await (await admin.get(`/api/tasks/${done.matter.taskId}`)).json();
      expect(matter.clientUid).toBe(env('E2E_CLIENT_UID'));
      expect(matter.paymentStatus).toBe('fully_paid');
      // What the customer paid, GST included.
      expect(matter.totalCost).toBe(charged(withWorkflow.price));
      expect(matter.amountPaid).toBe(charged(withWorkflow.price));
      expect(matter.status, 'approved on the order, so it is live — no second approval').not.toBe('pending_admin_approval');
      expect((await mine(buyer, order.orderId)).matterId, 'the customer can now follow it').toBe(done.matter.taskId);

      // Approving again is refused, and there is still the one matter.
      const again = await approve(order.orderId, 'admin');
      expect(again.status).toBe(409);
      expect(again.body.message).toMatch(/already been opened/);
      expect((await full(order.orderId)).matter.taskId).toBe(done.matter.taskId);
    } finally { await buyer.dispose(); await admin.dispose(); }
  });

  test('the customer closes the tab after paying: the webhook alone settles it', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const sim = await simulate(buyer, order.orderId, 'success_webhook');
      expect(sim.delivered.outcome).toBe('paid');
      expect((await mine(buyer, order.orderId)).status).toBe('paid');
      expect((await full(order.orderId)).matter.state).toBe('awaiting_approval');
    } finally { await buyer.dispose(); }
  });

  test('the webhook arrives twice, and two people approve at once: one payment, one matter', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const sim = await simulate(buyer, order.orderId, 'duplicate_webhook');
      expect(sim.delivered.map((d: { outcome: string }) => d.outcome)).toEqual(['paid', 'noop']);
      expect((await full(order.orderId)).matter.state).toBe('awaiting_approval');

      const both = await Promise.all([approve(order.orderId, 'admin'), approve(order.orderId, 'manager')]);
      expect(both.map((r) => r.status).sort(), 'exactly one approval goes through').toEqual([200, 409]);
      const after = await full(order.orderId);
      track(after);
      expect(after.status).toBe('paid');
      expect(after.matter.state).toBe('created');
    } finally { await buyer.dispose(); }
  });

  test('a result whose signature does not verify never marks an order paid', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const forged = await simulate(buyer, order.orderId, 'bad_signature');
      const res = await buyer.post(`/api/orders/${order.orderId}/verify`, { data: forged });
      expect(res.status()).toBe(400);
      expect((await res.json()).code).toBe('BAD_SIGNATURE');
      const after = await mine(buyer, order.orderId);
      expect(after.status).toBe('created');
      expect(after.matterId).toBeNull();
    } finally { await buyer.dispose(); }
  });

  test('an unsigned or mis-signed webhook changes nothing', async () => {
    const anon = await request.newContext({ baseURL: API() });
    try {
      const body = { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_x', order_id: 'order_x', amount: 100 } } } };
      expect((await anon.post('/api/orders/webhook', { data: body })).status()).toBe(400);
      expect((await anon.post('/api/orders/webhook', { data: body, headers: { 'x-razorpay-signature': 'nope' } })).status()).toBe(400);
    } finally { await anon.dispose(); }
  });

  test('the wrong amount is held for review: no matter, staff alerted', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const sim = await simulate(buyer, order.orderId, 'amount_mismatch');
      expect(sim.delivered.outcome).toBe('review');
      const after = await full(order.orderId);
      expect(after.status).toBe('review');
      expect(after.matter.state).toBe('none');
      // Compared with what was CHARGED — the price plus GST.
      expect(after.reviewReason).toContain(String(charged(withWorkflow.price)));
      // An order held for review cannot be approved into a matter.
      expect((await approve(order.orderId)).status).toBe(409);
      await expect.poll(() => staffTold(/Website payment needs review/), { timeout: 20_000 }).toBe(true);
    } finally { await buyer.dispose(); }
  });

  test('a declined payment is recorded with its reason; paying afterwards still works', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      const declined = await simulate(buyer, order.orderId, 'failure');
      const failed = await (await buyer.post(`/api/orders/${order.orderId}/failed`, { data: { reason: declined.error.reason } })).json() as Pub;
      expect(failed.status).toBe('failed');
      expect(failed.failureReason).toContain('declined');
      expect(failed.matterId).toBeNull();

      const paid = await simulate(buyer, order.orderId, 'success');
      const after = await (await buyer.post(`/api/orders/${order.orderId}/verify`, { data: paid })).json() as Pub;
      expect(after.status).toBe('paid');
      expect(after.failureReason).toBeNull();
      // And a paid order is never turned back into a failed one.
      expect((await (await buyer.post(`/api/orders/${order.orderId}/failed`, { data: { reason: 'late cancel' } })).json()).status).toBe('paid');
    } finally { await buyer.dispose(); }
  });

  test('a service with no workflow: the payment is recorded, no matter is opened, staff are asked to open one', async () => {
    const buyer = await apiAs('client');
    try {
      const order = await (await start(buyer, withoutWorkflow)).json() as Pub;
      const paid = await simulate(buyer, order.orderId, 'success');
      const after = await (await buyer.post(`/api/orders/${order.orderId}/verify`, { data: paid })).json() as Pub;
      expect(after.status).toBe('paid');
      expect(after.matterId).toBeNull();
      expect((await full(order.orderId)).matter.state).toBe('not_applicable');
      await expect.poll(() => staffTold(/open the matter by hand/), { timeout: 20_000 }).toBe(true);
      // There is nothing to approve: no matter can be opened for it.
      const res = await approve(order.orderId);
      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/not waiting for approval/);
    } finally { await buyer.dispose(); }
  });

  test('paid at the gateway but nothing reached us: staff reconcile it', async () => {
    const buyer = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const order = await (await start(buyer, withoutWorkflow)).json() as Pub;
      await simulate(buyer, order.orderId, 'paid_silently');
      expect((await mine(buyer, order.orderId)).status).toBe('created');
      const res = await admin.post(`/api/orders/${order.orderId}/reconcile`);
      expect(res.status()).toBe(200);
      expect((await res.json()).outcome).toBe('paid');
      expect((await mine(buyer, order.orderId)).status).toBe('paid');
      // An order that was never paid reconciles to "not paid", not to paid.
      const unpaid = await (await start(buyer, withoutWorkflow)).json() as Pub;
      expect((await (await admin.post(`/api/orders/${unpaid.orderId}/reconcile`)).json()).outcome).toBe('not_paid');
    } finally { await buyer.dispose(); await admin.dispose(); }
  });

  test('the gateway is unreachable: a clear message, and no half-made order', async () => {
    const buyer = await apiAs('client');
    try {
      const res = await start(buyer, withWorkflow, { simulate: 'gateway_down' });
      expect(res.status()).toBe(502);
      const body = await res.json();
      expect(body.code).toBe('GATEWAY_UNAVAILABLE');
      expect(body).not.toHaveProperty('orderId');
    } finally { await buyer.dispose(); }
  });

  test('a refund marks the order refunded, tells staff, and leaves the matter alone', async () => {
    const buyer = await apiAs('client');
    const admin = await apiAs('admin');
    try {
      const order = await (await start(buyer, withWorkflow)).json() as Pub;
      await simulate(buyer, order.orderId, 'success_webhook');
      const paid = (await approve(order.orderId)).body as Full;
      track(paid);
      expect(paid.matter.state).toBe('created');
      const sim = await simulate(buyer, order.orderId, 'refund');
      expect(sim.delivered.outcome).toBe('refunded');
      expect((await mine(buyer, order.orderId)).status).toBe('refunded');
      expect((await admin.get(`/api/tasks/${paid.matter.taskId}`)).status(), 'the matter is still there').toBe(200);
      await expect.poll(() => staffTold(/Website order refunded/), { timeout: 20_000 }).toBe(true);

      // Refunded BEFORE anyone approved: it can no longer be approved into a matter.
      const early = await (await start(buyer, withWorkflow)).json() as Pub;
      await simulate(buyer, early.orderId, 'success_webhook');
      expect((await simulate(buyer, early.orderId, 'refund')).delivered.outcome).toBe('refunded');
      const refused = await approve(early.orderId);
      expect(refused.status).toBe(409);
      expect(refused.body.message).toMatch(/refunded/);
      expect((await full(early.orderId)).matter.state).toBe('awaiting_approval');
    } finally { await buyer.dispose(); await admin.dispose(); }
  });

  test('an order is its owner’s: only staff can list and approve, only admins and managers retry or reconcile', async () => {
    const buyer = await apiAs('client');
    const team = await apiAs('team');
    const manager = await apiAs('manager');
    const pro = await apiAs('pro');
    try {
      const order = await (await start(buyer, withoutWorkflow)).json() as Pub;
      // Paying and confirming are the owner's alone — a member of staff cannot do them.
      expect((await team.post(`/api/orders/${order.orderId}/simulate`, { data: { outcome: 'success' } })).status()).toBe(404);
      expect((await team.post(`/api/orders/${order.orderId}/verify`, { data: { gatewayPaymentId: 'x', signature: 'y' } })).status()).toBe(404);
      // Someone who is neither the owner nor staff cannot see it at all.
      expect((await pro.get(`/api/orders/${order.orderId}`)).status()).toBe(404);
      for (const who of [buyer, pro]) {
        expect((await who.get('/api/orders')).status()).toBe(403);
        expect((await who.post(`/api/orders/${order.orderId}/approve`)).status()).toBe(403);
      }
      // #212: a team member approves orders, so they can see them — and no more.
      expect((await team.get('/api/orders?limit=5')).status()).toBe(200);
      expect((await team.get(`/api/orders/${order.orderId}`)).status()).toBe(200);
      for (const who of [buyer, team, pro]) {
        expect((await who.post(`/api/orders/${order.orderId}/retry-matter`)).status()).toBe(403);
        expect((await who.post(`/api/orders/${order.orderId}/reconcile`)).status()).toBe(403);
      }
      const list = await manager.get('/api/orders?limit=5');
      expect(list.status()).toBe(200);
      expect((await list.json()).data.length).toBeGreaterThan(0);
      // The buyer's own view leaves out the internals a staff member sees.
      const own = await mine(buyer, order.orderId);
      expect(own).not.toHaveProperty('uid');
      expect(own).not.toHaveProperty('matter');
    } finally { await buyer.dispose(); await team.dispose(); await manager.dispose(); await pro.dispose(); }
  });
  test('staff see website orders: a team member approves one, it links to its matter, and a missing payment can be checked', async ({ adminPage: page, teamPage, clientPage }) => {
    const buyer = await apiAs('client');
    try {
      const opened = await (await start(buyer, withWorkflow)).json() as Pub;
      await simulate(buyer, opened.orderId, 'success_webhook');
      const silent = await (await start(buyer, withoutWorkflow)).json() as Pub;
      await simulate(buyer, silent.orderId, 'paid_silently');

      await page.goto('website-orders');
      await expect(page.getByRole('heading', { name: 'Website orders' })).toBeVisible();
      const row = (id: string) => page.getByRole('row').filter({ hasText: id });
      await expect(row(opened.orderId).getByText('Paid', { exact: true })).toBeVisible();
      // #212: paid, and waiting for someone to approve it.
      await expect(row(opened.orderId).getByText(/Waiting for approval/)).toBeVisible();
      await expect(row(opened.orderId).getByRole('link', { name: 'Open matter' })).toHaveCount(0);

      // A team member sees the screen and approves the order — and is offered
      // nothing to do with the payment itself.
      await teamPage.goto('website-orders');
      const teamRow = teamPage.getByRole('row').filter({ hasText: opened.orderId });
      await expect(teamRow.getByText(/Waiting for approval/)).toBeVisible();
      await expect(teamPage.getByRole('button', { name: /with the payment gateway/ })).toHaveCount(0);
      await teamPage.getByRole('button', { name: `Approve order ${opened.orderId} and open its matter` }).click();
      await expect(teamPage.getByText('Order approved. The matter is open.')).toBeVisible();
      await expect(teamRow.getByText('Matter opened')).toBeVisible();
      await expect(teamPage.getByRole('button', { name: `Approve order ${opened.orderId} and open its matter` })).toHaveCount(0);
      track(await full(opened.orderId));

      await page.reload();
      await expect(row(opened.orderId).getByText('Matter opened')).toBeVisible();
      await expect(row(opened.orderId).getByRole('link', { name: 'Open matter' })).toHaveAttribute('href', new RegExp(`/tasks/${(await full(opened.orderId)).matter.taskId}$`));

      // Paid at the gateway, never reported to us: "Check payment" finds it.
      await expect(row(silent.orderId).getByText('In progress')).toBeVisible();
      await page.getByRole('button', { name: `Check order ${silent.orderId} with the payment gateway` }).click();
      await expect(page.getByText('A payment was found and the order is now paid.')).toBeVisible();
      await expect(row(silent.orderId).getByText('Paid', { exact: true })).toBeVisible();
      // No workflow for that service: it says so, and offers to try again.
      await expect(row(silent.orderId).getByText(/No matter opened\./)).toBeVisible();
      await expect(page.getByRole('button', { name: `Try to open the matter for order ${silent.orderId}` })).toBeVisible();

      // Details: the references to quote, how it was paid, and that the money matched.
      await page.getByRole('button', { name: `Show details of order ${opened.orderId}` }).click();
      const details = page.getByRole('row').filter({ hasText: 'Payment reference' });
      await expect(details.getByText('The amount received matches what was charged for this plan')).toBeVisible();
      // The price, the GST added to it, and who approved the order.
      await expect(details.getByText(`GST (${gstPercent}%)`)).toBeVisible();
      await expect(details.getByText('Total charged')).toBeVisible();
      await expect(details.getByText('Approved', { exact: true })).toBeVisible();
      await expect(details.getByText((await full(opened.orderId)).gatewayPaymentId!)).toBeVisible();
      await expect(details.getByText('The payment gateway told us directly')).toBeVisible();
      await expect(details.getByText('Test payment (no money moved)')).toBeVisible();

      // The matter is deleted afterwards: the order says so and offers no dead link.
      await deleteMatter((await full(opened.orderId)).matter.taskId!);
      await page.reload();
      await expect(row(opened.orderId).getByText('Matter opened, then deleted')).toBeVisible();
      await expect(row(opened.orderId).getByRole('link', { name: 'Open matter' })).toHaveCount(0);

      // A client has no business on this screen.
      await clientPage.goto('website-orders');
      await expect(clientPage).toHaveURL(/\/unauthorized/);
    } finally { await buyer.dispose(); }
  });
});
