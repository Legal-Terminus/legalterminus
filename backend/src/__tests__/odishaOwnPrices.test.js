/**
 * #241 (the firm, 21 Nov): the Odisha landing pages are priced on their own.
 *
 * Their cards used to sell the India-wide products (`private-limited`,
 * `trademark-application`), so a price changed for the India page changed the
 * Odisha page too, and Website Prices had no entry the firm could recognise as
 * "the Odisha page". Each landing page now sells its own product. These tests
 * read the seed file and the pages, so a later edit cannot quietly re-join them.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findPlan, mergeSeed, normaliseProduct } from '../services/pricing.service.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '../../..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const seed = JSON.parse(read('shared/pricing/catalog.json')).products;
const pathsOf = (key) => seed[key].pages.map((p) => p.path);

const PAIRS = [
  { odisha: 'private-limited-odisha', india: 'private-limited', component: 'Frontend/src/Components/CroPlans/CroPlans.jsx',
    pages: ['/company-registration-consultancy-in-odisha', '/company-registration-odisha'] },
  { odisha: 'trademark-application-odisha', india: 'trademark-application', component: 'Frontend/src/Components/TrademarkPlans/TrademarkPlans.jsx',
    pages: ['/trademark-registration-in-odisha'] },
];

for (const { odisha, india, component, pages } of PAIRS) {
  test(`#241: ${odisha} is its own product, sold only on the Odisha pages`, () => {
    assert.ok(seed[odisha], `${odisha} is in the seed file`);
    assert.deepEqual([...pathsOf(odisha)].sort(), [...pages].sort());
    for (const p of pages) assert.ok(!pathsOf(india).includes(p), `${india} no longer lists ${p}`);
    assert.notEqual(seed[odisha].code, seed[india].code, 'a code of its own');
    assert.notEqual(seed[odisha].label, seed[india].label, 'a name of its own under Website Prices');
  });

  test(`#241: ${odisha} opens the same portal service as ${india}, with the same plans`, () => {
    assert.equal(seed[odisha].serviceKey, seed[india].serviceKey);
    assert.deepEqual(seed[odisha].plans.map((p) => p.id), seed[india].plans.map((p) => p.id));
    assert.deepEqual(seed[odisha].choice ?? null, seed[india].choice ?? null, 'the same question, if any');
  });

  test(`#241: the Odisha cards read and check out ${odisha}`, () => {
    const src = read(component);
    assert.match(src, new RegExp(`usePlans\\("${odisha}"`));
    assert.match(src, new RegExp(`source="${odisha}"`));
    assert.doesNotMatch(src, new RegExp(`"${india}"`), `no ${india} left in ${component}`);
  });
}

test('#241: a price changed on the India product does not change the Odisha product', () => {
  const products = ['private-limited', 'private-limited-odisha'].map((k) => normaliseProduct(k, seed[k]));
  products[0].plans.find((p) => p.id === 'enriched').price = 7777;
  assert.equal(findPlan(products, 'private-limited', 'enriched').price, 7777);
  assert.equal(findPlan(products, 'private-limited-odisha', 'enriched').price, seed['private-limited-odisha'].plans.find((p) => p.id === 'enriched').price);
});

test('#241: re-seeding moves the Odisha pages off the India product and keeps its prices', () => {
  // What is stored today: the India product still listing the Odisha pages, at a price the firm set.
  const stored = { ...seed['private-limited'], pages: [...seed['private-limited'].pages,
    { path: '/company-registration-odisha', title: '' }, { path: '/company-registration-consultancy-in-odisha', title: '' }],
    plans: seed['private-limited'].plans.map((p) => (p.id === 'enriched' ? { ...p, price: 9499 } : p)) };
  const { product } = mergeSeed('private-limited', stored, seed['private-limited']);
  assert.deepEqual(product.pages.map((p) => p.path), pathsOf('private-limited'));
  assert.equal(product.plans.find((p) => p.id === 'enriched').price, 9499, 'the firm\'s price stands');
  // And the Odisha product, not stored yet, is created from the seed.
  assert.equal(mergeSeed('private-limited-odisha', null, seed['private-limited-odisha']).changed, true);
});

test('#241: the heroes and the trademark terms quote live prices, not typed ones', () => {
  const hero = read('Frontend/src/Components/CroBreadcrum/CroBreadcrum.jsx');
  assert.match(hero, /useStartingPrice\("private-limited-odisha"/);
  assert.doesNotMatch(hero, /starting from ₹/);
  const tmHero = read('Frontend/src/Components/TrademarkHero/TrademarkHero.jsx');
  assert.match(tmHero, /useStartingPrice\("trademark-application-odisha"/);
  assert.doesNotMatch(tmHero, /starting from ₹/);
  const terms = read('Frontend/src/Components/TrademarkTerms/TrademarkTerms.jsx');
  assert.match(terms, /usePlanPrices\("trademark-application-odisha"/);
  assert.doesNotMatch(terms, /ELEMENTAL \(₹|ENRICHED \(₹|SUPREME \(₹|SUPREME PLUS \(₹/);
});
