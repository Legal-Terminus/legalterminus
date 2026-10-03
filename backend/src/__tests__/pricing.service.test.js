/**
 * E24-S01 — the price catalogue: the server, not the browser, decides what a
 * plan costs.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  applyUpdate, findPlan, mergeSeed, normaliseProduct, publicView,
} from '../services/pricing.service.js';
import { updatePricingSchema } from '../schemas/pricing.schema.js';

const RAW = {
  label: 'Trademark Application', serviceKey: 'trademark-application',
  plans: [
    { id: 'elemental', name: 'Elemental', price: 1499, oldPrice: 2249 },
    { id: 'enriched', name: 'Enriched', price: 6499, oldPrice: 9749 },
    { id: 'supreme', name: 'Supreme', price: 12499, oldPrice: 15499, active: false },
  ],
};
const product = () => normaliseProduct('trademark-application', RAW);

test('normaliseProduct drops plans with no usable price and bad strikethroughs', () => {
  const p = normaliseProduct('x', { plans: [
    { id: 'a', price: 100, oldPrice: 50 },      // strikethrough below the price is meaningless
    { id: 'b', price: 0 }, { id: 'c', price: '999' }, { id: '', price: 5 }, { price: 5 }, null,
    { id: 'd', price: 250.5 },
  ] });
  assert.deepEqual(p.plans, [{ id: 'a', name: 'a', price: 100, oldPrice: null, active: true }]);
  assert.equal(p.label, 'x');
  assert.equal(p.serviceKey, null);
});

test('publicView shows active plans and prices only — no service link, no inactive plan', () => {
  const view = publicView([product(), normaliseProduct('gone', { plans: [{ id: 'a', price: 5, active: false }] })]);
  assert.deepEqual(Object.keys(view), ['trademark-application']);
  assert.deepEqual(view['trademark-application'].plans.map((p) => p.id), ['elemental', 'enriched']);
  assert.equal('serviceKey' in view['trademark-application'], false);
  assert.equal('active' in view['trademark-application'].plans[0], false);
});

test('findPlan is the amount a payment must use; unknown and inactive plans are not for sale', () => {
  const products = [product()];
  assert.deepEqual(findPlan(products, 'trademark-application', 'enriched'), {
    productKey: 'trademark-application', planId: 'enriched', label: 'Trademark Application',
    planName: 'Enriched', amount: 6499, serviceKey: 'trademark-application',
  });
  assert.equal(findPlan(products, 'trademark-application', 'supreme'), null, 'inactive');
  assert.equal(findPlan(products, 'trademark-application', 'nope'), null);
  assert.equal(findPlan(products, 'nope', 'elemental'), null);
});

test('applyUpdate changes prices by plan id and refuses a plan that does not exist', () => {
  const next = applyUpdate(product(), { plans: [{ id: 'elemental', price: 1999, oldPrice: null }, { id: 'supreme', active: true }] });
  assert.deepEqual(next.plans.find((p) => p.id === 'elemental'), { id: 'elemental', name: 'Elemental', price: 1999, oldPrice: null, active: true });
  assert.equal(next.plans.find((p) => p.id === 'supreme').active, true);
  assert.equal(next.plans.find((p) => p.id === 'enriched').price, 6499, 'untouched plans keep their price');
  assert.equal(applyUpdate(product(), { serviceKey: null }).serviceKey, null);
  assert.throws(() => applyUpdate(product(), { plans: [{ id: 'platinum', price: 1 }] }), (e) => e.status === 400);
});

test('mergeSeed never overwrites a price the firm changed, but adds what is missing', () => {
  const stored = { ...RAW, plans: [{ id: 'elemental', name: 'Elemental', price: 2999 }] };
  const { product: merged, changed } = mergeSeed('trademark-application', stored, RAW);
  assert.equal(changed, true);
  assert.equal(merged.plans.find((p) => p.id === 'elemental').price, 2999, 'the firm’s price survives');
  assert.deepEqual(merged.plans.map((p) => p.id), ['elemental', 'enriched', 'supreme']);
  assert.equal(mergeSeed('trademark-application', RAW, RAW).changed, false);
  assert.equal(mergeSeed('trademark-application', null, RAW).changed, true);
  assert.equal(mergeSeed('trademark-application', stored, RAW, { force: true }).product.plans[0].price, 1499);
});

test('the update schema rejects unknown fields, zero and absurd prices', () => {
  assert.equal(updatePricingSchema.safeParse({ plans: [{ id: 'a', price: 4999 }] }).success, true);
  assert.equal(updatePricingSchema.safeParse({ plans: [{ id: 'a', price: 0 }] }).success, false);
  assert.equal(updatePricingSchema.safeParse({ plans: [{ id: 'a', price: 49.5 }] }).success, false);
  assert.equal(updatePricingSchema.safeParse({ plans: [{ id: 'a', price: 99_000_000 }] }).success, false);
  assert.equal(updatePricingSchema.safeParse({ plans: [{ id: 'a', amountPaid: 1 }] }).success, false);
  assert.equal(updatePricingSchema.safeParse({ collection: 'users' }).success, false);
});

test('the seed file: every plan has a real price, ids are unique, nothing is under Rs 100', () => {
  const { products } = JSON.parse(fs.readFileSync(new URL('../../../shared/pricing/catalog.json', import.meta.url), 'utf8'));
  const keys = Object.keys(products);
  assert.ok(keys.length >= 50, 'the catalogue covers the website');
  for (const key of keys) {
    const p = normaliseProduct(key, products[key]);
    assert.equal(p.plans.length, products[key].plans.length, `${key}: a plan was dropped as unusable`);
    assert.equal(new Set(p.plans.map((x) => x.id)).size, p.plans.length, `${key}: duplicate plan ids`);
    for (const plan of p.plans) assert.ok(plan.price >= 100, `${key}/${plan.id} is priced ${plan.price}`);
  }
});
