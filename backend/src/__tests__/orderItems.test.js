/**
 * #244 — the website cart: several services in one order, paid once, priced
 * line by line from the catalogue, and opened as one matter per line on ONE
 * approval. A one-service order keeps its old shape.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlan, normaliseProduct } from '../services/pricing.service.js';
import {
  MAX_ORDER_ITEMS, isMultiItem, itemLines, linesToOpen, planLineMatters, priceOrder, publicItems, requestedItems,
  settleLineMatters,
} from '../services/orderItems.js';
import {
  canApprove, decideSettlement, matterOutcome, publicOrder,
} from '../services/orders.service.js';
import { createOrderSchema } from '../schemas/order.schema.js';

const catalog = [
  normaliseProduct('proprietorship', { label: 'Proprietorship', code: 'SVC-001', serviceKey: 'proprietorship', plans: [{ id: 'elemental', name: 'Elemental', price: 999 }, { id: 'enriched', name: 'Enriched', price: 2999 }] }),
  normaliseProduct('gst-registration', { label: 'GST Registration', code: 'SVC-002', serviceKey: 'gst-registration', plans: [{ id: 'elemental', name: 'Elemental', price: 1499 }] }),
  normaliseProduct('startup-india', { label: 'Startup India', code: 'SVC-003', serviceKey: null, plans: [{ id: 'elemental', name: 'Elemental', price: 2999 }, { id: 'old', name: 'Old', price: 10, active: false }] }),
];
const plan = (k, p) => findPlan(catalog, k, p);
const rupees = (n) => `₹${n}`;

test('a one-service order is priced exactly as before: no items, the plan’s own figures', () => {
  const one = priceOrder([plan('proprietorship', 'elemental')]);
  assert.equal('items' in one, false);
  assert.equal(isMultiItem(one), false);
  assert.deepEqual(
    [one.productKey, one.planId, one.productCode, one.label, one.planName, one.serviceKey, one.price, one.gst, one.gstPercent, one.amount],
    ['proprietorship', 'elemental', 'SVC-001', 'Proprietorship', 'Elemental', 'proprietorship', 999, 179.82, 18, 1178.82],
  );
});

test('a cart is priced line by line from the catalogue; the order is the sum, to the paisa', () => {
  const cart = priceOrder([plan('proprietorship', 'elemental'), plan('gst-registration', 'elemental'), plan('startup-india', 'elemental')]);
  assert.equal(isMultiItem(cart), true);
  assert.equal(cart.items.length, 3);
  // Each line carries the same GST the one-service path computes.
  for (const [i, k] of ['proprietorship', 'gst-registration', 'startup-india'].entries()) {
    const single = priceOrder([plan(k, 'elemental')]);
    assert.deepEqual([cart.items[i].price, cart.items[i].gst, cart.items[i].amount], [single.price, single.gst, single.amount]);
    assert.deepEqual(cart.items[i].matter, { state: 'none' });
  }
  assert.equal(cart.price, 999 + 1499 + 2999);
  assert.equal(cart.gst, 179.82 + 269.82 + 539.82);
  assert.equal(cart.amount, 1178.82 + 1768.82 + 3538.82);
  assert.equal(cart.amount, Math.round((cart.price + cart.gst) * 100) / 100);
  assert.equal(cart.gstPercent, 18);
  assert.equal(cart.productKey, null);
  assert.equal(cart.serviceKey, null, 'no single service: each line has its own');
  assert.equal(cart.label, '3 services');
  assert.match(cart.planName, /Proprietorship \(Elemental\), GST Registration \(Elemental\), Startup India \(Elemental\)/);
  // The payment check is unchanged: the charged total is what must arrive.
  assert.equal(decideSettlement({ status: 'created', ...cart }, { amount: cart.amount }).action, 'paid');
  assert.equal(decideSettlement({ status: 'created', ...cart }, { amount: cart.items[0].amount }).action, 'review', 'one line’s worth is not the order');
});

test('a plan not on sale, or unknown, makes the whole cart unavailable — nothing is charged for part of it', () => {
  assert.throws(() => priceOrder([plan('proprietorship', 'elemental'), plan('startup-india', 'old')]), (e) => e.status === 404);
  assert.throws(() => priceOrder([plan('proprietorship', 'elemental'), plan('nope', 'x')]), (e) => e.status === 404);
  assert.throws(() => priceOrder([]), (e) => e.status === 404);
});

test('requestedItems accepts the old one-plan request or a list, and guards the list', () => {
  assert.deepEqual(requestedItems({ productKey: 'a', planId: 'b' }), [{ productKey: 'a', planId: 'b' }]);
  assert.deepEqual(requestedItems({ items: [{ productKey: 'a', planId: 'b', amount: 1 }] }), [{ productKey: 'a', planId: 'b' }], 'only the plan is taken');
  assert.throws(() => requestedItems({}), (e) => e.code === 'NO_ITEMS');
  assert.throws(() => requestedItems({ items: [{ productKey: 'a', planId: 'x' }, { productKey: 'a', planId: 'y' }] }), (e) => e.code === 'DUPLICATE_ITEM');
  const many = Array.from({ length: MAX_ORDER_ITEMS + 1 }, (_, i) => ({ productKey: `p${i}`, planId: 'x' }));
  assert.throws(() => requestedItems({ items: many }), (e) => e.code === 'TOO_MANY_ITEMS');
  assert.equal(requestedItems({ items: many.slice(0, MAX_ORDER_ITEMS) }).length, MAX_ORDER_ITEMS);
});

test('the schema takes one plan or a cart — never a price, never both, at most 10 lines', () => {
  const ok = (b) => createOrderSchema.safeParse(b).success;
  assert.equal(ok({ productKey: 'a', planId: 'b' }), true);
  assert.equal(ok({ items: [{ productKey: 'a', planId: 'b' }, { productKey: 'c', planId: 'd' }] }), true);
  assert.equal(ok({ items: [{ productKey: 'a', planId: 'b', price: 1 }] }), false, 'a price on a line is refused');
  assert.equal(ok({ items: [{ productKey: 'a', planId: 'b' }], amount: 1 }), false);
  assert.equal(ok({ items: [] }), false);
  assert.equal(ok({ productKey: 'a', planId: 'b', items: [{ productKey: 'c', planId: 'd' }] }), false);
  assert.equal(ok({ items: [{ productKey: 'a', planId: 'b' }, { productKey: 'a', planId: 'c' }] }), false, 'one plan per service');
  assert.equal(ok({ items: Array.from({ length: 11 }, (_, i) => ({ productKey: `p${i}`, planId: 'x' })) }), false);
  assert.equal(ok({ productKey: 'a' }), false);
  assert.equal(ok({}), false);
});

test('after payment, each line is judged on its own service; the order waits if any line can open a matter', () => {
  const cart = priceOrder([plan('proprietorship', 'elemental'), plan('startup-india', 'elemental')]);
  const planned = planLineMatters(cart.items, [true, false], matterOutcome);
  assert.deepEqual(planned.matter, { state: 'awaiting_approval' });
  assert.deepEqual(planned.items[0].matter, { state: 'awaiting_approval' });
  assert.equal(planned.items[1].matter.state, 'not_applicable');
  assert.match(planned.items[1].matter.reason, /not linked/);
  // The order is then approvable exactly as a one-service order is.
  assert.equal(canApprove({ status: 'paid', ...planned }), null);

  const none = planLineMatters(cart.items, [false, false], matterOutcome);
  assert.equal(none.matter.state, 'not_applicable');
  assert.match(canApprove({ status: 'paid', ...none }), /not waiting/);
});

test('one approval opens a matter per waiting line; a failed line is retried alone', () => {
  const cart = priceOrder([plan('proprietorship', 'elemental'), plan('gst-registration', 'elemental'), plan('startup-india', 'elemental')]);
  const { items } = planLineMatters(cart.items, [true, true, false], matterOutcome);
  const approval = { approvedBy: 'u1', approvedByName: 'Asha', approvedAt: 't' };
  assert.deepEqual(linesToOpen(items).map((l) => l.index), [0, 1], 'the line with no workflow is not opened');

  const first = settleLineMatters(items, [{ index: 0, taskId: 't0' }, { index: 1, error: 'boom' }], approval);
  assert.equal(first.matter.state, 'failed');
  assert.match(first.matter.error, /GST Registration: boom/);
  assert.equal(first.matter.approvedBy, 'u1', 'the approval stands');
  assert.deepEqual(first.items[0].matter, { state: 'created', taskId: 't0' });
  assert.equal(first.items[2].matter.state, 'not_applicable');
  // Staff retry: only the failed line is tried again.
  assert.deepEqual(linesToOpen(first.items).map((l) => l.index), [1]);

  const second = settleLineMatters(first.items, [{ index: 1, taskId: 't1' }], approval);
  assert.equal(second.matter.state, 'created');
  assert.deepEqual(second.items.map((i) => i.matter.taskId), ['t0', 't1', undefined]);
  assert.match(canApprove({ status: 'paid', ...second }), /already been opened/);
  // A retry of planning after approval never re-opens an opened line.
  assert.equal(planLineMatters(second.items, [false, false, false], matterOutcome).items[0].matter.state, 'created');
});

test('the customer sees every line of a cart order and the first matter to follow', () => {
  const cart = priceOrder([plan('proprietorship', 'elemental'), plan('gst-registration', 'elemental')]);
  const waiting = { orderId: 'LT-1', status: 'paid', ...cart, matter: { state: 'awaiting_approval' } };
  const view = publicOrder(waiting);
  assert.equal(view.items.length, 2);
  assert.deepEqual(Object.keys(view.items[0]).sort(), ['amount', 'gst', 'label', 'matterId', 'matterIds', 'planName', 'price', 'quantity', 'unitAmount']);
  assert.equal(view.matterId, null);
  assert.equal('serviceKey' in view.items[0], false);

  const opened = { ...waiting, matter: { state: 'created' }, items: cart.items.map((it, i) => ({ ...it, matter: { state: 'created', taskId: `t${i}` } })) };
  assert.deepEqual(publicOrder(opened).items.map((i) => i.matterId), ['t0', 't1']);
  assert.equal(publicOrder(opened).matterId, 't0');
  // A one-service order's view is unchanged: no `items` key.
  assert.equal('items' in publicOrder({ orderId: 'LT-2', amount: 1 }), false);
  assert.deepEqual(publicItems({ amount: 1 }), {});
});

test('the confirmation lists each service with what it cost', () => {
  const cart = priceOrder([plan('proprietorship', 'elemental'), plan('gst-registration', 'elemental')]);
  assert.deepEqual(itemLines(cart, rupees), ['• Proprietorship — Elemental: ₹1178.82', '• GST Registration — Elemental: ₹1768.82']);
  assert.deepEqual(itemLines(priceOrder([plan('proprietorship', 'elemental')]), rupees), []);
});
