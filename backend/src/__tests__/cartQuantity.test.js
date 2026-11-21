/**
 * #244 — quantities in the website cart (the firm's request of 2026-11-12):
 * "3 Trademark Registrations" is ONE cart line of quantity 3, priced by the
 * server unit by unit from the catalogue, paid once, and opened as THREE
 * matters by one approval. Orders stored before quantities keep working.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlan, normaliseProduct } from '../services/pricing.service.js';
import {
  MAX_LINE_QUANTITY, MAX_ORDER_UNITS, couponDiscounts, expandUnits, groupUnits, isMultiItem, itemLines, linesSentence,
  linesToOpen, planLineMatters, priceOrder, publicItems, requestedItems, settleLineMatters, unitCount,
} from '../services/orderItems.js';
import { canApprove, decideSettlement, matterOutcome, publicOrder } from '../services/orders.service.js';
import { quoteView, redemptionRecord } from '../services/coupons.js';
import { createOrderSchema, quoteOrderSchema } from '../schemas/order.schema.js';

const catalog = [
  normaliseProduct('proprietorship', { label: 'Proprietorship', code: 'SVC-001', serviceKey: 'proprietorship', plans: [{ id: 'elemental', name: 'Elemental', price: 999 }] }),
  normaliseProduct('gst-registration', { label: 'GST Registration', code: 'SVC-002', serviceKey: 'gst-registration', plans: [{ id: 'elemental', name: 'Elemental', price: 1499 }] }),
  normaliseProduct('startup-india', { label: 'Startup India', code: 'SVC-003', serviceKey: null, plans: [{ id: 'elemental', name: 'Elemental', price: 2999 }, { id: 'old', name: 'Old', price: 10, active: false }] }),
];
/** What orders.service's priceWanted does: request → lines → units → plans. */
const priced = (body, discountFor = null) => {
  const wanted = requestedItems(body);
  const plans = expandUnits(wanted, wanted.map((w) => findPlan(catalog, w.productKey, w.planId, w.optionId)));
  return priceOrder(plans, discountFor ? couponDiscounts(plans, discountFor) : null);
};
const rupees = (n) => `₹${n}`;
const coupon = (over = {}) => ({ code: 'SAVE', discountType: 'percent', discountValue: 10, scope: 'general', productKeys: [], minAmount: null, ...over });

test('caps: 1 to 10 of a service, at most 20 units in an order', () => {
  assert.equal(MAX_LINE_QUANTITY, 10);
  assert.equal(MAX_ORDER_UNITS, 20);
});

test('the schema takes a whole-number quantity per line, never a price; caps per line and per order', () => {
  const ok = (b) => createOrderSchema.safeParse(b).success;
  const line = (quantity, k = 'a') => ({ productKey: k, planId: 'x', ...(quantity === undefined ? {} : { quantity }) });
  assert.equal(ok({ items: [line(3)] }), true);
  assert.equal(ok({ items: [line(undefined)] }), true, 'missing quantity is 1');
  assert.equal(ok({ items: [line(10)] }), true);
  for (const bad of [0, -1, 11, 2.5, '3', null]) assert.equal(ok({ items: [line(bad)] }), false, `quantity ${bad} refused`);
  // 10 + 10 = 20 units is the most; 21 is refused.
  assert.equal(ok({ items: [line(10, 'a'), line(10, 'b')] }), true);
  assert.equal(ok({ items: [line(10, 'a'), line(10, 'b'), line(1, 'c')] }), false);
  assert.equal(ok({ items: [{ ...line(2), price: 1 }] }), false, 'still no price on a line');
  assert.equal(ok({ items: [{ ...line(2), amount: 1 }] }), false);
  assert.equal(ok({ productKey: 'a', planId: 'x', quantity: 2 }), false, 'the one-plan request has no quantity: the cart does');
  assert.equal(quoteOrderSchema.safeParse({ items: [line(3)], couponCode: 'X' }).success, true);
  assert.equal(quoteOrderSchema.safeParse({ items: [line(11)] }).success, false);
});

test('the service guards the quantity too, in words', () => {
  const code = (b) => { try { requestedItems(b); return null; } catch (e) { return [e.status, e.code]; } };
  assert.deepEqual(code({ items: [{ productKey: 'a', planId: 'x', quantity: 0 }] }), [400, 'BAD_QUANTITY']);
  assert.deepEqual(code({ items: [{ productKey: 'a', planId: 'x', quantity: 11 }] }), [400, 'BAD_QUANTITY']);
  assert.deepEqual(code({ items: [{ productKey: 'a', planId: 'x', quantity: 1.5 }] }), [400, 'BAD_QUANTITY']);
  assert.deepEqual(code({ items: [{ productKey: 'a', planId: 'x', quantity: 10 }, { productKey: 'b', planId: 'x', quantity: 10 }, { productKey: 'c', planId: 'x' }] }), [400, 'TOO_MANY_UNITS']);
  // Quantity 1 is not stored on the line: the request is exactly the old one.
  assert.deepEqual(requestedItems({ items: [{ productKey: 'a', planId: 'x', quantity: 1 }] }), [{ productKey: 'a', planId: 'x' }]);
  assert.deepEqual(requestedItems({ items: [{ productKey: 'a', planId: 'x', quantity: 3 }] }), [{ productKey: 'a', planId: 'x', quantity: 3 }]);
  assert.equal(unitCount([{ quantity: 3 }, {}, { quantity: 1 }]), 5);
});

test('quantity N: the server prices N units from the catalogue; the total is the sum, to the paisa', () => {
  const o = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] });
  assert.equal(isMultiItem(o), true, 'three units are three services');
  assert.equal(o.items.length, 3);
  for (const [n, it] of o.items.entries()) {
    assert.deepEqual([it.price, it.gst, it.amount, it.quantity, it.unitNo], [999, 179.82, 1178.82, 3, n + 1]);
    assert.deepEqual(it.matter, { state: 'none' });
  }
  assert.deepEqual([o.price, o.gst, o.amount], [2997, 539.46, 3536.46]);
  assert.equal(o.label, '3 services');
  assert.equal(o.planName, 'Proprietorship (Elemental) × 3');

  const mixed = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 2 }, { productKey: 'gst-registration', planId: 'elemental' }] });
  assert.equal(mixed.items.length, 3);
  assert.deepEqual([mixed.price, mixed.gst, mixed.amount], [999 * 2 + 1499, 179.82 * 2 + 269.82, Math.round((1178.82 * 2 + 1768.82) * 100) / 100]);
  assert.equal('quantity' in mixed.items[2], false, 'a line of one is stored as before');
  assert.equal(mixed.planName, 'Proprietorship (Elemental) × 2, GST Registration (Elemental)');
});

test('a cart of one line of quantity 1 is a one-service order, stored exactly as before', () => {
  const one = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 1 }] });
  assert.equal('items' in one, false);
  assert.equal('quantity' in one, false);
  assert.deepEqual([one.price, one.gst, one.amount], [999, 179.82, 1178.82]);
});

test('a plan not on sale refuses the whole order, whatever its quantity', () => {
  assert.throws(() => priced({ items: [{ productKey: 'startup-india', planId: 'old', quantity: 3 }] }), (e) => e.status === 404);
  assert.throws(() => priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 2 }, { productKey: 'nope', planId: 'x' }] }), (e) => e.status === 404);
});

test('settlement compares the payment with the server’s quantity-aware total', () => {
  const o = { status: 'created', ...priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] }) };
  assert.equal(decideSettlement(o, { amount: 3536.46 }).action, 'paid');
  assert.equal(decideSettlement(o, { amount: 1178.82 }).action, 'review', 'one unit’s worth is not the order');
  assert.equal(decideSettlement(o, { amount: 3536.45 }).action, 'review', 'a paisa short is not the order');
  // An order stored before quantities (no quantity anywhere) settles exactly as it did.
  const old = { status: 'created', amount: 2947.64, items: [{ productKey: 'proprietorship', amount: 1178.82 }, { productKey: 'gst-registration', amount: 1768.82 }] };
  assert.equal(decideSettlement(old, { amount: 2947.64 }).action, 'paid');
});

test('coupons on quantities: percent off every unit, fixed split across units, minimum counts units', () => {
  const pct = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] }, coupon());
  // 999 − 10% = 899.10; GST 161.84; 1060.94 a unit.
  assert.deepEqual(pct.items.map((i) => i.amount), [1060.94, 1060.94, 1060.94]);
  assert.deepEqual([pct.discount, pct.subtotalBeforeDiscount, pct.amount], [299.7, 2997, 3182.82]);

  const fixed = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] }, coupon({ discountType: 'fixed', discountValue: 500 }));
  assert.equal(Math.round(fixed.items.reduce((s, i) => s + i.discount, 0) * 100) / 100, 500, 'the parts add up to the discount exactly');
  assert.equal(fixed.discount, 500);

  const min = coupon({ scope: 'min_amount', minAmount: 2500 });
  assert.throws(() => priced({ items: [{ productKey: 'proprietorship', planId: 'elemental' }, { productKey: 'gst-registration', planId: 'elemental' }] }, min), (e) => e.code === 'COUPON_MIN_AMOUNT');
  assert.equal(priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] }, min).discount, 299.7);
});

test('one approval opens ONE MATTER PER UNIT; a retry or re-approval never opens another', () => {
  const o = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }, { productKey: 'startup-india', planId: 'elemental', quantity: 2 }] });
  // Startup India has no portal service: its two units are left for staff, one entry each.
  const planned = planLineMatters(o.items, o.items.map((it) => !!it.serviceKey), matterOutcome);
  assert.deepEqual(planned.items.map((i) => i.matter.state), ['awaiting_approval', 'awaiting_approval', 'awaiting_approval', 'not_applicable', 'not_applicable']);
  assert.equal(canApprove({ status: 'paid', ...planned }), null);
  assert.deepEqual(linesToOpen(planned.items).map((l) => l.index), [0, 1, 2], 'three matters, one per unit');
  assert.equal(linesSentence(planned.items.filter((i) => i.matter.state === 'not_applicable')), 'Startup India × 2');

  const approval = { approvedBy: 'u1', approvedAt: 't' };
  // Each unit's matter is fully paid with ITS share: the unit's own amount.
  const shares = linesToOpen(planned.items).map(({ it }) => it.amount);
  assert.deepEqual(shares, [1178.82, 1178.82, 1178.82]);
  const first = settleLineMatters(planned.items, [{ index: 0, taskId: 't0' }, { index: 1, error: 'boom' }, { index: 2, taskId: 't2' }], approval);
  assert.equal(first.matter.state, 'failed');
  assert.deepEqual(linesToOpen(first.items).map((l) => l.index), [1], 'a retry opens only the unit that failed');
  const second = settleLineMatters(first.items, [{ index: 1, taskId: 't1' }], approval);
  assert.equal(second.matter.state, 'created');
  assert.deepEqual(linesToOpen(second.items), [], 'nothing left to open');
  assert.match(canApprove({ status: 'paid', ...second }), /already been opened/, 're-approval is refused');
  // Re-planning (a staff "look again") never reopens an opened unit.
  assert.deepEqual(planLineMatters(second.items, [true, true, true, true, true], matterOutcome).items.slice(0, 3).map((i) => i.matter.state), ['created', 'created', 'created']);
});

test('people read lines with a quantity and a line total: customer, quote, email, redemption', () => {
  const o = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }, { productKey: 'gst-registration', planId: 'elemental' }] });
  const opened = { orderId: 'LT-1', status: 'paid', ...o, matter: { state: 'created' }, items: o.items.map((it, i) => ({ ...it, matter: { state: 'created', taskId: `t${i}` } })) };
  const view = publicOrder(opened);
  assert.equal(view.items.length, 2, 'one entry per line, not per unit');
  assert.deepEqual([view.items[0].quantity, view.items[0].unitAmount, view.items[0].amount], [3, 1178.82, 3536.46]);
  assert.deepEqual(view.items[0].matterIds, ['t0', 't1', 't2']);
  assert.equal(view.items[1].quantity, 1);
  assert.equal(view.matterId, 't0');
  assert.equal(JSON.stringify(view).includes('SVC-'), false, 'no product codes for the customer');

  assert.deepEqual(itemLines(o, rupees), ['• Proprietorship — Elemental × 3: ₹3536.46 (₹1178.82 each)', '• GST Registration — Elemental: ₹1768.82']);

  const q = quoteView(o, null);
  assert.deepEqual(q.lines.map((l) => [l.label, l.quantity, l.amount]), [['Proprietorship', 3, 3536.46], ['GST Registration', 1, 1768.82]]);
  assert.equal(q.amount, o.amount);

  const withCode = priced({ items: [{ productKey: 'proprietorship', planId: 'elemental', quantity: 3 }] }, coupon());
  const r = redemptionRecord({ orderId: 'LT-2', ...withCode }, { amountPaid: withCode.amount, paidAt: 't' });
  assert.deepEqual(r.services.map((s) => [s.quantity, s.listPrice, s.discount, s.amount]), [[3, 2997, 299.7, 3182.82]]);
});

test('an order stored before quantities groups into exactly its old lines', () => {
  const old = { items: [
    { productKey: 'proprietorship', label: 'Proprietorship', planName: 'Elemental', price: 999, gst: 179.82, amount: 1178.82, matter: { state: 'created', taskId: 'a' } },
    { productKey: 'gst-registration', label: 'GST Registration', planName: 'Elemental', price: 1499, gst: 269.82, amount: 1768.82, matter: { state: 'not_applicable' } },
  ] };
  const g = groupUnits(old.items);
  assert.deepEqual(g.map((l) => [l.quantity, l.amount, l.units.map((u) => u.index)]), [[1, 1178.82, [0]], [1, 1768.82, [1]]]);
  assert.deepEqual(publicItems(old).items.map((i) => [i.quantity, i.matterId]), [[1, 'a'], [1, null]]);
});
