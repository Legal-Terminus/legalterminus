/**
 * #256, #257, #260 — coupon codes: the discount comes off before GST, fits the
 * order it is used on, is usable only while valid, and is used up (one-time)
 * or counted (period) exactly once, when the order is paid.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { findPlan, normaliseProduct } from '../services/pricing.service.js';
import { couponDiscounts, priceOrder, publicItems } from '../services/orderItems.js';
import {
  couponDefinition, couponOnPaid, couponRefusal, couponSnapshot, couponState, deleteRefusal, editRefusal, heldByOther,
  istDate, istEndOf, istStartOf, normaliseCode, quoteView, redemptionRecord,
} from '../services/coupons.js';
import { publicOrder } from '../services/orders.service.js';
import { createOrderSchema, quoteOrderSchema } from '../schemas/order.schema.js';
import { createCouponSchema, updateCouponSchema } from '../schemas/coupon.schema.js';

const catalog = [
  normaliseProduct('proprietorship', { label: 'Proprietorship', serviceKey: 'proprietorship', plans: [{ id: 'elemental', name: 'Elemental', price: 999 }] }),
  normaliseProduct('gst-registration', { label: 'GST Registration', plans: [{ id: 'elemental', name: 'Elemental', price: 1499 }] }),
  normaliseProduct('startup-india', { label: 'Startup India', plans: [{ id: 'elemental', name: 'Elemental', price: 2999 }] }),
];
const labels = Object.fromEntries(catalog.map((p) => [p.key, p.label]));
const plan = (k) => findPlan(catalog, k, 'elemental');
const coupon = (over = {}) => ({
  code: 'SAVE10', discountType: 'percent', discountValue: 10, scope: 'general', productKeys: [], minAmount: null,
  validity: 'period', startsAt: istStartOf('2026-11-01'), endsAt: istEndOf('2026-11-30'), active: true, usedCount: 0, ...over,
});
const priceWith = (plans, c) => priceOrder(plans, couponDiscounts(plans, c, labels));
const refusalCode = (fn) => { try { fn(); return null; } catch (e) { return { status: e.status, code: e.code, message: e.message }; } };

/* ───────────── Pricing: the discount comes off before GST ───────────── */

test('percent: off the price before GST; GST is then worked on the lower price', () => {
  const o = priceWith([plan('proprietorship')], coupon());
  // 999 − 10% = 899.10; GST 18% of 899.10 = 161.84 (to the paisa); total 1060.94.
  assert.deepEqual([o.listPrice, o.discount, o.price, o.gst, o.amount], [999, 99.9, 899.1, 161.84, 1060.94]);
  assert.deepEqual([o.couponCode, o.subtotalBeforeDiscount], ['SAVE10', 999]);
  assert.equal('items' in o, false, 'a one-service order keeps its old shape');
  assert.equal(o.productKey, 'proprietorship');
});

test('no coupon: the order is priced exactly as before, with no coupon field', () => {
  const o = priceOrder([plan('proprietorship')]);
  for (const k of ['couponCode', 'discount', 'listPrice', 'subtotalBeforeDiscount']) assert.equal(k in o, false, k);
  assert.equal(o.amount, 1178.82);
});

test('percent on a cart: every line is reduced; the order is the sum of the lines', () => {
  const o = priceWith([plan('proprietorship'), plan('gst-registration')], coupon());
  assert.deepEqual(o.items.map((i) => i.discount), [99.9, 149.9]);
  assert.equal(o.discount, 249.8);
  assert.equal(o.subtotalBeforeDiscount, 2498);
  assert.equal(o.price, Math.round(o.items.reduce((s, i) => s + i.price, 0) * 100) / 100);
  assert.equal(o.amount, Math.round(o.items.reduce((s, i) => s + i.amount, 0) * 100) / 100);
  for (const i of o.items) assert.equal(i.amount, Math.round((i.price + i.gst) * 100) / 100);
  // What the customer is shown of each line.
  assert.deepEqual(publicItems(o).items.map((i) => i.listPrice), [999, 1499]);
});

test('fixed: split in proportion to price; the last line takes the rounding so the parts add up', () => {
  const two = couponDiscounts([plan('proprietorship'), plan('gst-registration')], coupon({ discountType: 'fixed', discountValue: 500 }), labels);
  assert.deepEqual(two.perLine, [199.96, 300.04]);
  const three = couponDiscounts([plan('proprietorship'), plan('gst-registration'), plan('startup-india')],
    coupon({ discountType: 'fixed', discountValue: 1000 }), labels);
  assert.deepEqual(three.perLine, [181.74, 272.69, 545.57]);
  assert.equal(Math.round(three.perLine.reduce((s, d) => s + d, 0) * 100) / 100, 1000);
});

test('fixed: never more than the eligible lines cost', () => {
  const plans = [plan('proprietorship'), plan('gst-registration')];
  const d = couponDiscounts(plans, coupon({ discountType: 'fixed', discountValue: 5000, scope: 'services', productKeys: ['proprietorship'] }), labels);
  assert.deepEqual(d.perLine, [999, 0]);
  const o = priceOrder(plans, d);
  assert.deepEqual([o.items[0].price, o.items[0].gst, o.items[0].amount], [0, 0, 0]);
  assert.equal(o.items[1].amount, 1768.82, 'the other service is charged in full');
});

test('services: only the chosen services are reduced; none in the order is refused by name', () => {
  const c = coupon({ scope: 'services', productKeys: ['gst-registration'] });
  const o = priceWith([plan('proprietorship'), plan('gst-registration')], c);
  assert.deepEqual(o.items.map((i) => i.discount), [0, 149.9]);
  assert.equal(o.items[0].listPrice, 999);
  const r = refusalCode(() => couponDiscounts([plan('proprietorship')], coupon({ scope: 'services', productKeys: ['startup-india', 'gst-registration'] }), labels));
  assert.deepEqual([r.status, r.code], [422, 'COUPON_NOT_APPLICABLE']);
  assert.equal(r.message, 'This code applies only to: Startup India, GST Registration.');
});

test('minimum amount: the whole order, once its price before GST reaches the minimum', () => {
  const c = coupon({ scope: 'min_amount', minAmount: 2000 });
  const r = refusalCode(() => couponDiscounts([plan('proprietorship')], c, labels));
  assert.deepEqual([r.status, r.code], [422, 'COUPON_MIN_AMOUNT']);
  assert.equal(r.message, 'This code needs an order of at least ₹2,000 before GST — add ₹1,001 more.');
  const ok = priceWith([plan('proprietorship'), plan('gst-registration')], c); // 2,498 ≥ 2,000
  assert.deepEqual(ok.items.map((i) => i.discount), [99.9, 149.9]);
  // Exactly the minimum is enough.
  assert.equal(refusalCode(() => couponDiscounts([plan('proprietorship')], coupon({ scope: 'min_amount', minAmount: 999 }), labels)), null);
});

test('a coupon that would leave less than ₹1 to pay is refused', () => {
  for (const c of [coupon({ discountValue: 100 }), coupon({ discountType: 'fixed', discountValue: 999 })]) {
    const r = refusalCode(() => couponDiscounts([plan('proprietorship')], c, labels));
    assert.deepEqual([r.status, r.code], [422, 'COUPON_TOO_LARGE']);
  }
  // ₹998 off ₹999 leaves ₹1 + 18p GST: allowed.
  assert.equal(priceWith([plan('proprietorship')], coupon({ discountType: 'fixed', discountValue: 998 })).amount, 1.18);
});

/* ─────────────────────── Validity (#257) ─────────────────────── */

const at = (iso) => Date.parse(iso);

test('period dates are India calendar days, first to last inclusive', () => {
  assert.equal(istStartOf('2026-11-10'), '2026-11-09T18:30:00.000Z');
  assert.equal(istEndOf('2026-11-16'), '2026-11-16T18:29:59.999Z');
  assert.equal(istDate(istStartOf('2026-11-10')), '2026-11-10');
  assert.equal(istDate(istEndOf('2026-11-16')), '2026-11-16');
});

test('unknown, switched off, not started, expired, used and held codes are each refused in words', () => {
  const c = coupon({ startsAt: istStartOf('2026-11-10'), endsAt: istEndOf('2026-11-16') });
  const inWindow = at('2026-11-12T06:00:00Z');
  assert.equal(couponRefusal(c, { now: inWindow }), null);
  assert.equal(couponRefusal(null).code, 'COUPON_INVALID');
  assert.equal(couponRefusal({ ...c, active: false }, { now: inWindow }).code, 'COUPON_INVALID');
  const early = couponRefusal(c, { now: at('2026-11-09T18:00:00Z') }); // 23:30 IST on the 9th
  assert.deepEqual([early.code, early.message], ['COUPON_NOT_STARTED', 'This code can be used from 10 Nov 2026.']);
  assert.equal(couponRefusal(c, { now: at('2026-11-16T18:00:00Z') }), null, 'still usable at 23:30 IST on its last day');
  const late = couponRefusal(c, { now: at('2026-11-16T18:31:00Z') });
  assert.deepEqual([late.code, late.message], ['COUPON_EXPIRED', 'This code expired on 16 Nov 2026.']);

  const once = coupon({ validity: 'one_time', startsAt: null, endsAt: null });
  assert.equal(couponRefusal(once), null);
  const used = couponRefusal({ ...once, active: false, consumedBy: { orderId: 'LT-1', uid: 'u1' } });
  assert.deepEqual([used.code, used.message], ['COUPON_USED', 'This code has already been used.']);
});

test('a one-time code held by another checkout is refused; the same customer, or an expired hold, is not', () => {
  const now = at('2026-11-06T10:00:00Z');
  const held = coupon({ validity: 'one_time', heldBy: { orderId: 'LT-1', uid: 'u1', until: '2026-11-06T10:20:00.000Z' } });
  const r = couponRefusal(held, { now, uid: 'u2' });
  assert.deepEqual([r.status, r.code, r.message], [409, 'COUPON_HELD', 'This code is being used in another checkout. Try again in a few minutes.']);
  assert.equal(couponRefusal(held, { now, uid: 'u1' }), null, 'the customer coming back takes their own hold over');
  assert.equal(heldByOther(held, { now, orderId: 'LT-1' }), false);
  assert.equal(couponRefusal(held, { now: at('2026-11-06T10:21:00Z'), uid: 'u2' }), null, 'an abandoned checkout lets go after the hold');
  // A period code is never held.
  assert.equal(couponRefusal({ ...held, validity: 'period' }, { now, uid: 'u2' }), null);
});

test('the staff list says where each coupon stands', () => {
  const now = at('2026-11-12T06:00:00Z');
  assert.equal(couponState(coupon(), now), 'active');
  assert.equal(couponState(coupon({ active: false }), now), 'inactive');
  assert.equal(couponState(coupon({ startsAt: istStartOf('2026-11-20'), endsAt: istEndOf('2026-11-30') }), now), 'scheduled');
  assert.equal(couponState(coupon({ endsAt: istEndOf('2026-11-11') }), now), 'expired');
  assert.equal(couponState(coupon({ validity: 'one_time', heldBy: { until: '2026-11-12T06:10:00Z' } }), now), 'in_checkout');
  assert.equal(couponState(coupon({ validity: 'one_time', active: false, consumedBy: { orderId: 'x' } }), now), 'used');
});

/* ───────────────── A payment uses the coupon, once ───────────────── */

const paidOrder = (over = {}) => ({
  orderId: 'LT-1', uid: 'u1', customer: { name: 'Asha', email: 'asha@example.test' }, gateway: 'simulated',
  ...priceWith([plan('proprietorship'), plan('gst-registration')], coupon()),
  coupon: couponSnapshot({ ...coupon(), createdBy: { uid: 'a1', name: 'Admin' }, createdAt: '2026-11-01T00:00:00.000Z' }),
  ...over,
});

test('the first payment uses up a one-time code: switched off, who used it, the hold let go', () => {
  const once = coupon({ validity: 'one_time', usedCount: 0, heldBy: { orderId: 'LT-1', uid: 'u1', until: 'x' } });
  const { update, note } = couponOnPaid(once, paidOrder(), '2026-11-06T10:00:00.000Z');
  assert.deepEqual(update, {
    usedCount: 1, lastUsedAt: '2026-11-06T10:00:00.000Z', updatedAt: '2026-11-06T10:00:00.000Z',
    active: false, consumedBy: { orderId: 'LT-1', uid: 'u1', at: '2026-11-06T10:00:00.000Z' }, heldBy: null,
  });
  assert.equal(note, undefined);
});

test('a payment arriving after someone else used the one-time code is honoured, and says so', () => {
  const used = coupon({ validity: 'one_time', active: false, usedCount: 1, consumedBy: { orderId: 'LT-0', uid: 'u0' }, heldBy: { orderId: 'LT-1' } });
  const { update, note } = couponOnPaid(used, paidOrder(), 't');
  assert.equal(update.usedCount, 2);
  assert.equal('consumedBy' in update, false, 'the first use stands');
  assert.equal(update.heldBy, null);
  assert.match(note, /already been used by order LT-0/);
});

test('a period code is counted on every payment and stays on', () => {
  const { update, note } = couponOnPaid(coupon({ usedCount: 4 }), paidOrder(), 't');
  assert.deepEqual(update, { usedCount: 5, lastUsedAt: 't', updatedAt: 't' });
  assert.equal(note, undefined);
  assert.equal(couponOnPaid(null, paidOrder(), 't').update, null, 'a deleted coupon: the redemption is still written');
});

test('the redemption keeps its own figures: original − discount + GST = what was charged', () => {
  const r = redemptionRecord(paidOrder(), { amountPaid: paidOrder().amount, paidAt: 't' });
  assert.equal(r.code, 'SAVE10');
  assert.deepEqual([r.discountType, r.discountValue, r.couponCreatedBy.name], ['percent', 10, 'Admin']);
  assert.deepEqual([r.clientName, r.clientEmail], ['Asha', 'asha@example.test']);
  assert.deepEqual(r.services.map((s) => [s.label, s.listPrice, s.discount]), [['Proprietorship', 999, 99.9], ['GST Registration', 1499, 149.9]]);
  assert.equal(Math.round((r.originalAmount - r.discount + r.gst) * 100) / 100, r.amountCharged);
  assert.equal(r.amountPaid, r.amountCharged);
  // One service.
  const one = { orderId: 'LT-2', uid: 'u1', customer: {}, ...priceWith([plan('proprietorship')], coupon()), coupon: couponSnapshot(coupon()) };
  assert.deepEqual(redemptionRecord(one, { paidAt: 't' }).services.map((s) => [s.label, s.listPrice, s.price]), [['Proprietorship', 999, 899.1]]);
});

test('the customer’s view of an order shows the coupon and the discount', () => {
  const v = publicOrder({ ...paidOrder(), status: 'paid', matter: { state: 'none' } });
  assert.deepEqual([v.couponCode, v.discount, v.subtotalBeforeDiscount], ['SAVE10', 249.8, 2498]);
  assert.equal('couponCode' in publicOrder({ ...priceOrder([plan('proprietorship')]), status: 'paid', matter: { state: 'none' } }), false);
  const q = quoteView(paidOrder(), coupon());
  assert.equal(q.coupon.label, '10% off');
  assert.deepEqual([q.subtotalBeforeDiscount, q.discount, q.amount], [2498, 249.8, paidOrder().amount]);
});

/* ─────────────────────── Editing and deleting ─────────────────────── */

test('a used one-time code cannot be switched on again; a used code cannot become one-time', () => {
  const used = coupon({ validity: 'one_time', active: false, consumedBy: { orderId: 'x' }, usedCount: 1 });
  assert.match(editRefusal(used, { ...used, active: true }), /cannot be switched on again/);
  assert.equal(editRefusal(used, { ...used, active: false, description: 'x' }), null);
  assert.match(editRefusal(coupon({ usedCount: 3 }), { validity: 'one_time' }), /cannot become a one-time code/);
  assert.equal(editRefusal(coupon({ usedCount: 0 }), { validity: 'one_time' }), null);
});

test('only an unused code that is not in a checkout can be deleted', () => {
  assert.match(deleteRefusal(coupon({ usedCount: 1 })), /kept for the coupon report/);
  assert.match(deleteRefusal(coupon({ heldBy: { until: '2026-11-06T10:20:00Z' } }), at('2026-11-06T10:00:00Z')), /in a checkout/);
  assert.equal(deleteRefusal(coupon()), null);
});

test('a coupon keeps only the fields its type uses', () => {
  const g = couponDefinition({ discountType: 'percent', discountValue: 5, scope: 'general', productKeys: ['x'], minAmount: 10, validity: 'one_time', startDate: '2026-11-01', endDate: '2026-11-02' });
  assert.deepEqual([g.productKeys, g.minAmount, g.startsAt, g.endsAt], [[], null, null, null]);
  const s = couponDefinition({ discountType: 'fixed', discountValue: 500, scope: 'services', productKeys: ['a', 'a', 'b'], validity: 'period', startDate: '2026-11-01', endDate: '2026-11-07' });
  assert.deepEqual(s.productKeys, ['a', 'b']);
  assert.equal(s.startsAt, istStartOf('2026-11-01'));
  assert.equal(normaliseCode('  save10 '), 'SAVE10');
});

/* ─────────────────────────── Schemas ─────────────────────────── */

test('an order and a quote take a code, never an amount', () => {
  assert.equal(createOrderSchema.safeParse({ productKey: 'p', planId: 'e', couponCode: 'SAVE10' }).success, true);
  assert.equal(createOrderSchema.safeParse({ productKey: 'p', planId: 'e', couponCode: 'SAVE10', discount: 100 }).success, false);
  assert.equal(createOrderSchema.safeParse({ productKey: 'p', planId: 'e', amount: 1 }).success, false);
  assert.equal(quoteOrderSchema.safeParse({ items: [{ productKey: 'p', planId: 'e' }], couponCode: 'x' }).success, true);
  assert.equal(quoteOrderSchema.safeParse({ productKey: 'p', planId: 'e', amount: 1 }).success, false);
  assert.equal(quoteOrderSchema.safeParse({ couponCode: 'x' }).success, false, 'a code alone buys nothing');
});

test('the coupon form is checked: code shape, percent ≤ 100, services chosen, a minimum, dates in order', () => {
  const ok = { code: 'diwali-25', discountType: 'percent', discountValue: 25, scope: 'general', validity: 'period', startDate: '2026-11-01', endDate: '2026-11-07' };
  const parsed = createCouponSchema.safeParse(ok);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.code, 'DIWALI-25');
  const bad = (over) => createCouponSchema.safeParse({ ...ok, ...over }).success;
  assert.equal(bad({ code: 'no spaces' }), false);
  assert.equal(bad({ code: 'AB' }), false);
  assert.equal(bad({ discountValue: 101 }), false);
  assert.equal(bad({ discountType: 'fixed', discountValue: 101 }), true);
  assert.equal(bad({ discountValue: 0 }), false);
  assert.equal(bad({ discountValue: 2.5 }), false);
  assert.equal(bad({ scope: 'services' }), false);
  assert.equal(bad({ scope: 'services', productKeys: ['x'] }), true);
  assert.equal(bad({ scope: 'min_amount' }), false);
  assert.equal(bad({ scope: 'min_amount', minAmount: 5000 }), true);
  assert.equal(bad({ endDate: '2026-10-31' }), false);
  assert.equal(bad({ startDate: undefined }), false);
  assert.equal(bad({ validity: 'one_time', startDate: undefined, endDate: undefined }), true);
  assert.equal(bad({ usedCount: 0 }), false, 'strict: no unknown fields');
  const { code: _code, ...terms } = ok;
  assert.equal(updateCouponSchema.safeParse(terms).success, true);
  assert.equal(updateCouponSchema.safeParse(ok).success, false, 'the code itself cannot be edited');
  assert.equal(createCouponSchema.safeParse({ ...ok, description: '<b>Festive</b> offer' }).data.description, 'Festive offer');
});
