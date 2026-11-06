/**
 * #221 — the trademark page's "Proposed to be Used" / "Prior User" question.
 * The buyer's ANSWER is sent, never a price; the server adds the answer's
 * surcharge to the plan before GST and before any coupon, for one plan and for
 * a cart line alike. The surcharge is the firm's, edited under Website Prices.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  applyUpdate, chosenOption, findPlan, mergeChoice, mergeSeed, normaliseChoice, normaliseProduct, publicView, withGst,
  withSeedChoice,
} from '../services/pricing.service.js';
import { couponDiscounts, priceOrder, publicItems, requestedItems } from '../services/orderItems.js';
import { publicOrder } from '../services/orders.service.js';
import { quoteView, redemptionRecord } from '../services/coupons.js';
import { createOrderSchema, quoteOrderSchema } from '../schemas/order.schema.js';
import { updatePricingSchema } from '../schemas/pricing.schema.js';

const CHOICE = {
  label: 'User type',
  options: [
    { id: 'proposed', name: 'Proposed to be Used', surcharge: 0 },
    { id: 'prior-user', name: 'Prior User', surcharge: 2500 },
  ],
};
const TM = {
  code: 'SVC-054', label: 'Trademark Registration in India', serviceKey: 'trademark-application',
  plans: [
    { id: 'elemental', name: 'Elemental', price: 1499, oldPrice: 2249 },
    { id: 'enriched', name: 'Enriched', price: 4499 },
    { id: 'supreme', name: 'Supreme', price: 11999 },
    { id: 'supreme-plus', name: 'Supreme Plus', price: 21999 },
  ],
  choice: CHOICE,
};
const catalog = () => [
  normaliseProduct('trademark-application', TM),
  normaliseProduct('gst-registration', { label: 'GST Registration', code: 'SVC-002', plans: [{ id: 'elemental', name: 'Elemental', price: 1499 }] }),
];

test('Proposed to be Used is the plan’s own price; Prior User adds ₹2,500 before GST — on every plan', () => {
  for (const plan of TM.plans) {
    const proposed = findPlan(catalog(), 'trademark-application', plan.id, 'proposed');
    assert.equal(proposed.price, plan.price);
    assert.equal(proposed.amount, withGst(plan.price).total);
    assert.equal(proposed.planName, `${plan.name} (Proposed to be Used)`);
    assert.equal(proposed.surcharge, 0);

    const prior = findPlan(catalog(), 'trademark-application', plan.id, 'prior-user');
    assert.equal(prior.basePrice, plan.price);
    assert.equal(prior.surcharge, 2500);
    assert.equal(prior.price, plan.price + 2500);
    // GST is worked out on the surcharged price.
    assert.equal(prior.gst, withGst(plan.price + 2500).gst);
    assert.equal(prior.amount, withGst(plan.price + 2500).total);
    assert.equal(prior.planName, `${plan.name} (Prior User)`);
    assert.deepEqual([prior.optionId, prior.optionName, prior.optionLabel], ['prior-user', 'Prior User', 'User type']);
  }
  // Supreme, worked by hand: 11,999 + 2,500 = 14,499; GST 2,609.82; total 17,108.82.
  const s = findPlan(catalog(), 'trademark-application', 'supreme', 'prior-user');
  assert.deepEqual([s.price, s.gst, s.amount], [14499, 2609.82, 17108.82]);
});

test('no answer, an unknown answer, or an answer to a product that asks nothing is refused with a 400', () => {
  assert.throws(() => findPlan(catalog(), 'trademark-application', 'supreme'),
    (e) => e.status === 400 && e.code === 'OPTION_REQUIRED' && /Proposed to be Used or Prior User/.test(e.message));
  assert.throws(() => findPlan(catalog(), 'trademark-application', 'supreme', 'subsequent-user'),
    (e) => e.status === 400 && e.code === 'OPTION_UNKNOWN');
  assert.throws(() => findPlan(catalog(), 'gst-registration', 'elemental', 'prior-user'),
    (e) => e.status === 400 && e.code === 'OPTION_UNKNOWN');
  // A product with no question is exactly as before, with no option fields at all.
  const gst = findPlan(catalog(), 'gst-registration', 'elemental');
  assert.equal(gst.price, 1499);
  assert.equal('optionId' in gst, false);
  assert.equal('surcharge' in gst, false);
  // An unknown PLAN is still "not for sale" (null → 404), whatever the answer.
  assert.equal(findPlan(catalog(), 'trademark-application', 'no-such-plan', 'prior-user'), null);
  assert.equal(chosenOption(catalog()[1], undefined), null);
});

test('a cart line keeps its answer and its surcharge; the order is the sum', () => {
  const wanted = requestedItems({ items: [
    { productKey: 'trademark-application', planId: 'enriched', optionId: 'prior-user' },
    { productKey: 'gst-registration', planId: 'elemental' },
  ] });
  assert.deepEqual(wanted[0], { productKey: 'trademark-application', planId: 'enriched', optionId: 'prior-user' });
  assert.equal('optionId' in wanted[1], false);
  const cart = priceOrder(wanted.map((w) => findPlan(catalog(), w.productKey, w.planId, w.optionId)));
  const [tm, gst] = cart.items;
  assert.deepEqual([tm.price, tm.basePrice, tm.surcharge, tm.optionName, tm.planName], [6999, 4499, 2500, 'Prior User', 'Enriched (Prior User)']);
  assert.equal(tm.amount, withGst(6999).total);
  assert.equal('optionId' in gst, false);
  assert.equal(cart.price, 6999 + 1499);
  assert.equal(cart.amount, Math.round((withGst(6999).total + withGst(1499).total) * 100) / 100);
  assert.match(cart.planName, /Trademark Registration in India \(Enriched \(Prior User\)\)/);
  // The customer's view of the line says which answer it was.
  assert.equal(publicItems(cart).items[0].optionName, 'Prior User');
  // One-plan request: the answer is carried too.
  assert.deepEqual(requestedItems({ productKey: 'trademark-application', planId: 'supreme', optionId: 'proposed' }),
    [{ productKey: 'trademark-application', planId: 'supreme', optionId: 'proposed' }]);
});

test('a coupon comes off the surcharged price, and GST is on what is left', () => {
  const plans = [findPlan(catalog(), 'trademark-application', 'elemental', 'prior-user')]; // 1,499 + 2,500 = 3,999
  const discount = couponDiscounts(plans, { code: 'TEN', scope: 'general', discountType: 'percent', discountValue: 10 });
  const order = priceOrder(plans, discount);
  assert.equal(order.listPrice, 3999);
  assert.equal(order.discount, 399.9);
  assert.equal(order.price, 3599.1);
  assert.equal(order.amount, withGst(3599.1).total);
  assert.equal(order.surcharge, 2500, 'the surcharge is recorded as it was, before the discount');
  const q = quoteView(order, { code: 'TEN', discountType: 'percent', discountValue: 10, scope: 'general' });
  assert.equal(q.lines[0].planName, 'Elemental (Prior User)');
  assert.equal(redemptionRecord({ orderId: 'X', ...order, couponCode: 'TEN' }).services[0].planName, 'Elemental (Prior User)');
});

test('the customer and staff see the answer on the order', () => {
  const order = { orderId: 'LT-1', status: 'paid', ...priceOrder([findPlan(catalog(), 'trademark-application', 'supreme', 'prior-user')]) };
  const pub = publicOrder(order);
  assert.deepEqual([pub.planName, pub.optionLabel, pub.optionName, pub.surcharge, pub.basePrice],
    ['Supreme (Prior User)', 'User type', 'Prior User', 2500, 11999]);
  assert.equal('optionName' in publicOrder({ ...priceOrder([findPlan(catalog(), 'gst-registration', 'elemental')]) }), false);
});

test('the schemas take an answer id — on one plan or a cart line — and never a surcharge', () => {
  for (const schema of [createOrderSchema, quoteOrderSchema]) {
    const ok = (b) => schema.safeParse(b).success;
    assert.equal(ok({ productKey: 'trademark-application', planId: 'supreme', optionId: 'prior-user' }), true);
    assert.equal(ok({ items: [{ productKey: 'trademark-application', planId: 'supreme', optionId: 'prior-user' }] }), true);
    assert.equal(ok({ productKey: 'trademark-application', planId: 'supreme', optionId: 'prior-user', surcharge: 0 }), false);
    assert.equal(ok({ items: [{ productKey: 'trademark-application', planId: 'supreme', optionId: 'x', surcharge: 0 }] }), false);
    assert.equal(ok({ productKey: 'trademark-application', planId: 'supreme', optionId: '' }), false);
    assert.equal(ok({ optionId: 'prior-user', items: [{ productKey: 'a', planId: 'b' }] }), false, 'an answer beside a cart is not one plan');
  }
});

test('the public catalogue shows the question and each answer’s surcharge', () => {
  const view = publicView(catalog());
  assert.deepEqual(view['trademark-application'].choice, CHOICE);
  assert.equal('choice' in view['gst-registration'], false);
});

test('the firm edits a surcharge by answer id; an unknown answer, or a product with no question, is refused', () => {
  const tm = normaliseProduct('trademark-application', TM);
  const next = applyUpdate(tm, { choice: { options: [{ id: 'prior-user', surcharge: 3000 }] } });
  assert.equal(next.choice.options.find((o) => o.id === 'prior-user').surcharge, 3000);
  assert.equal(next.choice.options.find((o) => o.id === 'proposed').surcharge, 0);
  assert.equal(tm.choice.options[1].surcharge, 2500, 'the original is not changed in place');
  assert.equal(findPlan([next], 'trademark-application', 'elemental', 'prior-user').price, 1499 + 3000);
  assert.throws(() => applyUpdate(tm, { choice: { options: [{ id: 'nope', surcharge: 1 }] } }), (e) => e.status === 400);
  assert.throws(() => applyUpdate(catalog()[1], { choice: { options: [{ id: 'prior-user', surcharge: 1 }] } }), (e) => e.status === 400);
  assert.equal(updatePricingSchema.safeParse({ choice: { options: [{ id: 'prior-user', surcharge: 0 }] } }).success, true);
  assert.equal(updatePricingSchema.safeParse({ choice: { options: [{ id: 'prior-user', surcharge: -1 }] } }).success, false);
  assert.equal(updatePricingSchema.safeParse({ choice: { options: [{ id: 'prior-user', surcharge: 2.5 }] } }).success, false);
  assert.equal(updatePricingSchema.safeParse({ choice: { label: 'x', options: [{ id: 'a', surcharge: 1 }] } }).success, false, 'the question is not editable');
  assert.equal(updatePricingSchema.safeParse({ choice: { options: [{ id: 'a', name: 'x', surcharge: 1 }] } }).success, false, 'nor the answers’ names');
});

test('a bad question is dropped, not guessed at', () => {
  assert.equal(normaliseChoice(null), null);
  assert.equal(normaliseChoice({ options: [{ id: 'a', name: 'A', surcharge: 0 }] }), null, 'one answer is not a choice');
  assert.equal(normaliseChoice({ options: [{ id: 'a', name: 'A', surcharge: -5 }, { id: 'b', name: 'B', surcharge: 0 }] }), null);
  assert.deepEqual(normaliseChoice({ options: [
    { id: 'a', name: 'A', surcharge: 0 }, { id: 'a', name: 'Again', surcharge: 1 }, { id: 'b', name: 'B', surcharge: 2.5 }, { id: 'c', name: 'C', surcharge: 10 },
  ] }), { label: 'Option', options: [{ id: 'a', name: 'A', surcharge: 0 }, { id: 'c', name: 'C', surcharge: 10 }] });
  assert.equal('choice' in normaliseProduct('x', { plans: [{ id: 'a', price: 100 }] }), false);
});

test('the seed brings the question; the firm’s surcharge is never overwritten by it', () => {
  // A product stored before the question existed is given the seed's.
  const stored = { ...TM, choice: undefined };
  const { product, changed } = mergeSeed('trademark-application', stored, TM);
  assert.equal(changed, true);
  assert.deepEqual(product.choice, CHOICE);
  // The firm raised Prior User to ₹3,000: re-seeding keeps it.
  const priced = { ...TM, choice: { ...CHOICE, options: [CHOICE.options[0], { ...CHOICE.options[1], surcharge: 3000 }] } };
  const again = mergeSeed('trademark-application', priced, TM);
  assert.equal(again.changed, false);
  assert.equal(again.product.choice.options[1].surcharge, 3000);
  // The website renames an answer: the name follows the site, the price stays the firm's.
  const renamed = mergeChoice(priced.choice, { ...CHOICE, options: [CHOICE.options[0], { ...CHOICE.options[1], name: 'Prior user (already in use)' }] });
  assert.deepEqual(renamed.options[1], { id: 'prior-user', name: 'Prior user (already in use)', surcharge: 3000 });
  assert.equal(mergeChoice(priced.choice, null), null);
  // Until the seed runs, a stored product without the question is read with the seed's.
  const read = withSeedChoice(normaliseProduct('trademark-application', stored), normaliseChoice(CHOICE));
  assert.equal(findPlan([read], 'trademark-application', 'supreme', 'prior-user').price, 14499);
  const own = normaliseProduct('trademark-application', priced);
  assert.equal(withSeedChoice(own, normaliseChoice(CHOICE)), own, 'a stored question wins');
});

test('the seed file asks the trademark question, ₹2,500 for Prior User', () => {
  const { products } = JSON.parse(fs.readFileSync(new URL('../../../shared/pricing/catalog.json', import.meta.url), 'utf8'));
  const p = normaliseProduct('trademark-application', products['trademark-application']);
  assert.deepEqual(p.choice, CHOICE);
  assert.equal(p.plans.length, 4, 'Prior User applies to all four plans');
  for (const [key, raw] of Object.entries(products)) {
    if (key !== 'trademark-application') assert.equal(raw.choice, undefined, `${key} asks no question`);
  }
});
