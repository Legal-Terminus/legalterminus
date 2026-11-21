/**
 * The price catalogue (E24-S01) — what each plan on the website costs.
 *
 * WHY. Every price used to live in a component on the website, and the checkout
 * sent that number to the server to be charged — so the amount charged was
 * whatever the browser said. One (unreachable) page priced a plan at Rs 1.
 * The catalogue moves the price to the server: the website asks for a PLAN, and
 * the server decides the AMOUNT.
 *
 * Stored in `pricingCatalog/{productKey}`:
 *   { code, label, pages, serviceKey, plans: [{ id, name, price, oldPrice, active }],
 *     choice?: { label, options: [{ id, name, surcharge }] } }
 * `code` (SVC-014) is the product's permanent reference — what staff and
 * customers quote, shown on the price screen, on orders and at checkout.
 * `label` is the title of its website page and `pages` are the addresses it is
 * sold on: staff know a service by its page, not by the key the code uses.
 * `serviceKey` is the portal service the product corresponds to (or null) — it
 * is what will let a paid order open a matter (E24-S03).
 *
 * Seeded once from shared/pricing/catalog.json (built from the website by
 * scripts/build-pricing-catalog.py). After that THIS collection is the source
 * of truth; the seed never overwrites a price the firm has changed.
 *
 * CHOICE (#221). A product may ask the buyer ONE required question whose
 * answer adds a surcharge to every plan — the trademark page's "Proposed to be
 * Used" / "Prior User". The question and its answers (ids, names) are the
 * WEBSITE's and come from the seed; each answer's `surcharge` (whole rupees,
 * before GST) is the FIRM's and is edited under Website Prices. The browser
 * sends only the answer's id (`optionId`); `findPlan` adds the surcharge, so the
 * price charged — plan + surcharge, then GST — is still the server's alone.
 *
 * The functions above the I/O line are pure and unit-tested.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';

export const COLLECTION = 'pricingCatalog';
const SEED_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../shared/pricing/catalog.json');

const isAmount = (n) => Number.isInteger(n) && n > 0;

/**
 * GST added at payment (#212, decided by the firm 2026-10-12): the prices in
 * the catalogue — and on the website's cards — are EXCLUSIVE of GST.
 */
export const GST_PERCENT = 18;

/**
 * A catalogue price with its GST, to the paisa. Pure.
 * `total` is what the customer is charged. Prices are whole rupees, so
 * price × percent ÷ 100 is exact to two places — no rounding is being hidden.
 */
export function withGst(price, percent = GST_PERCENT) {
  const gst = Math.round(price * percent) / 100;
  return { price, gstPercent: percent, gst, total: Math.round((price + gst) * 100) / 100 };
}

const isSurcharge = (n) => Number.isInteger(n) && n >= 0 && n <= 10_000_000;

/**
 * #221: a product's one required question, in a known shape, or null. An
 * answer with no usable id, name or surcharge is dropped; a question with fewer
 * than two answers is not a question and is dropped whole.
 */
export function normaliseChoice(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.options)) return null;
  const seen = new Set();
  const options = raw.options
    .filter((o) => o && typeof o.id === 'string' && o.id && typeof o.name === 'string' && o.name
      && isSurcharge(o.surcharge) && !seen.has(o.id) && seen.add(o.id))
    .map((o) => ({ id: o.id, name: o.name, surcharge: o.surcharge }));
  if (options.length < 2) return null;
  return { label: typeof raw.label === 'string' && raw.label ? raw.label : 'Option', options };
}

/** One stored product in a known shape. Bad plans are dropped, not guessed at. */
export function normaliseProduct(key, raw = {}) {
  const plans = (Array.isArray(raw.plans) ? raw.plans : [])
    .filter((p) => p && typeof p.id === 'string' && p.id && isAmount(p.price))
    .map((p) => ({
      id: p.id,
      name: typeof p.name === 'string' && p.name ? p.name : p.id,
      price: p.price,
      // A strikethrough price is only meaningful when it is higher than the price.
      oldPrice: isAmount(p.oldPrice) && p.oldPrice > p.price ? p.oldPrice : null,
      active: p.active !== false,
    }));
  const pages = (Array.isArray(raw.pages) ? raw.pages : [])
    .filter((p) => p && typeof p.path === 'string' && p.path.startsWith('/'))
    .map((p) => ({ path: p.path, title: typeof p.title === 'string' ? p.title : '' }));
  const choice = normaliseChoice(raw.choice);
  return {
    key,
    code: typeof raw.code === 'string' ? raw.code : '',
    label: typeof raw.label === 'string' && raw.label ? raw.label : key,
    pages,
    serviceKey: typeof raw.serviceKey === 'string' && raw.serviceKey ? raw.serviceKey : null,
    plans,
    // #221: only a product that asks a question carries the key at all.
    ...(choice ? { choice } : {}),
  };
}

/**
 * What the website may see: active plans and their prices. No service mapping,
 * no audit fields — and a product with no active plan is left out entirely.
 */
export function publicView(products) {
  const out = {};
  for (const p of products) {
    const plans = p.plans.filter((pl) => pl.active)
      .map(({ id, name, price, oldPrice }) => ({ id, name, price, oldPrice }));
    // The product code is for staff; it is not part of what the website is given.
    // #221: the question and each answer's surcharge are shown on the page, so they are public.
    if (plans.length) out[p.key] = { label: p.label, plans, ...(p.choice ? { choice: p.choice } : {}) };
  }
  return out;
}

/**
 * The plan a customer is buying, or null. THIS is what a payment must use for
 * its amount — never a number sent by the browser. An inactive plan is not for
 * sale and returns null.
 *
 * #221: `optionId` is the buyer's answer to the product's question, if it asks
 * one. The answer is REQUIRED there, and its surcharge is added to the plan's
 * price before GST; `planName` then names the answer too ("Supreme (Prior
 * User)"), so every screen, email and matter that shows the plan shows it. A
 * missing or unknown answer — or an answer to a product that asks nothing —
 * throws a 400 with the message the customer is shown.
 */
export function findPlan(products, productKey, planId, optionId) {
  const product = products.find((p) => p.key === productKey);
  const plan = product?.plans.find((pl) => pl.id === planId && pl.active);
  if (!plan) return null;
  const option = chosenOption(product, optionId);
  const price = plan.price + (option?.surcharge ?? 0);
  const { gst, total } = withGst(price);
  return {
    productKey, productCode: product.code, planId: plan.id, label: product.label,
    planName: option ? `${plan.name} (${option.name})` : plan.name,
    // `amount` is what is CHARGED: the price plus GST (#212).
    price, gstPercent: GST_PERCENT, gst, amount: total,
    serviceKey: product.serviceKey,
    // #221: what the answer added, kept apart so staff can see how the price was made.
    ...(option ? {
      optionId: option.id, optionName: option.name, optionLabel: product.choice.label,
      basePrice: plan.price, surcharge: option.surcharge,
    } : {}),
  };
}

const badRequest = (message, code) => Object.assign(new Error(message), { status: 400, code });

/** #221: the answer chosen to a product's question, or null when it asks none. Throws 400. */
export function chosenOption(product, optionId) {
  const choice = product?.choice;
  if (!choice) {
    if (optionId) throw badRequest(`"${product?.label ?? 'This service'}" has no options to choose from.`, 'OPTION_UNKNOWN');
    return null;
  }
  const names = choice.options.map((o) => o.name).join(' or ');
  if (!optionId) throw badRequest(`Please choose ${names} for ${product.label}.`, 'OPTION_REQUIRED');
  const option = choice.options.find((o) => o.id === optionId);
  if (!option) throw badRequest(`That ${choice.label.toLowerCase()} is not offered. Please choose ${names}.`, 'OPTION_UNKNOWN');
  return option;
}

/**
 * Apply an admin's edit. Plans are matched by id: an edit can change a plan's
 * price, strikethrough price, name or whether it is on sale, but cannot invent
 * a plan the website has no card for. Throws (status 400) on an unknown plan.
 */
export function applyUpdate(existing, patch = {}) {
  const next = { ...existing, plans: existing.plans.map((p) => ({ ...p })) };
  if (patch.serviceKey !== undefined) next.serviceKey = patch.serviceKey || null;
  for (const edit of patch.plans ?? []) {
    const plan = next.plans.find((p) => p.id === edit.id);
    if (!plan) {
      const err = new Error(`"${existing.label}" has no plan "${edit.id}".`);
      err.status = 400;
      throw err;
    }
    if (edit.price !== undefined) plan.price = edit.price;
    if (edit.oldPrice !== undefined) plan.oldPrice = edit.oldPrice;
    if (edit.name !== undefined) plan.name = edit.name;
    if (edit.active !== undefined) plan.active = edit.active;
  }
  // #221: the firm edits each answer's surcharge; the question itself is the website's.
  if (patch.choice?.options?.length) {
    if (!next.choice) {
      const err = new Error(`"${existing.label}" has no options to price.`);
      err.status = 400;
      throw err;
    }
    next.choice = { ...next.choice, options: next.choice.options.map((o) => ({ ...o })) };
    for (const edit of patch.choice.options) {
      const option = next.choice.options.find((o) => o.id === edit.id);
      if (!option) {
        const err = new Error(`"${existing.label}" has no option "${edit.id}".`);
        err.status = 400;
        throw err;
      }
      if (edit.surcharge !== undefined) option.surcharge = edit.surcharge;
    }
  }
  // A product with no plan on sale drops out of the public catalogue, and the
  // website then falls back to the prices built into its pages — the opposite
  // of what switching everything off was meant to do. Refuse it instead.
  if (!next.plans.some((p) => p.active !== false)) {
    const err = new Error('Keep at least one plan on sale. To stop selling this service, ask for its page to be taken down.');
    err.status = 400;
    throw err;
  }
  for (const plan of next.plans) {
    if (plan.oldPrice != null && plan.oldPrice <= plan.price) {
      const err = new Error(`${plan.name}: the strikethrough price must be higher than the price.`);
      err.status = 400;
      throw err;
    }
  }
  return normaliseProduct(existing.key, next);
}

/**
 * #212 — five website cards had their crossed-out price typed into the page, so
 * the catalogue never knew it: the portal showed "None" while the website showed
 * a figure. Those figures are in the seed file now. For these products the seed
 * fills a still-empty cut price ONCE (marked `cutPricesFromPage` on the stored
 * product), so the portal shows what the website was showing and the firm can
 * change or clear it from there.
 */
export const CUT_PRICES_FROM_PAGES = new Set([
  'cio-registration', 'cir-registration', 'partnership-registration', 'private-limited', 'windup-plc',
]);

/**
 * Merge the seed into what is stored.
 *
 * What the FIRM owns is never overwritten: prices, crossed-out prices, whether
 * a plan is on sale, and the link to a portal service. A missing product is
 * added, and a missing plan is added to an existing product.
 *
 * What the WEBSITE owns is always refreshed: the product code, the page title
 * used as its name, and the pages it is sold on. Those describe the site; a
 * stale copy would send staff to the wrong page.
 *
 * `relink` also resets the portal-service link to the seed's — for correcting
 * links that were seeded wrongly. `force` resets everything.
 * Returns { product, changed }.
 */
export function mergeSeed(key, stored, seed, { force = false, relink = false } = {}) {
  const fresh = normaliseProduct(key, seed);
  if (!stored || force) return { product: fresh, changed: true };
  const current = normaliseProduct(key, stored);
  const missing = fresh.plans.filter((p) => !current.plans.some((c) => c.id === p.id));
  // #212: the one exception to "never overwrite", made ONCE per product. See
  // CUT_PRICES_FROM_PAGES. Only an empty cut price is filled, so a figure the
  // firm entered stands; and the marker means one it clears later stays cleared.
  const restore = CUT_PRICES_FROM_PAGES.has(key) && stored.cutPricesFromPage !== true;
  const plans = !restore ? current.plans : current.plans.map((p) => {
    const was = fresh.plans.find((f) => f.id === p.id)?.oldPrice;
    return p.oldPrice == null && was > p.price ? { ...p, oldPrice: was } : p;
  });
  const product = {
    ...current,
    code: fresh.code, label: fresh.label, pages: fresh.pages,
    serviceKey: relink ? fresh.serviceKey : current.serviceKey,
    plans: [...plans, ...missing],
  };
  // #221: the question follows the website; the surcharges stay the firm's.
  const choice = mergeChoice(current.choice, fresh.choice);
  if (choice) product.choice = choice; else delete product.choice;
  // The marker is not part of a normalised product, so it is compared apart.
  const changed = restore || JSON.stringify(product) !== JSON.stringify(current);
  if (restore || stored.cutPricesFromPage === true) product.cutPricesFromPage = true;
  return { product, changed };
}

/**
 * #221: a product's question as the website now asks it (`seed`), with the
 * surcharge the firm set (`stored`) for every answer it already priced. Pure.
 * No question in the seed → none at all.
 */
export function mergeChoice(stored, seed) {
  if (!seed) return null;
  return {
    label: seed.label,
    options: seed.options.map((o) => {
      const was = stored?.options?.find((x) => x.id === o.id);
      return was ? { ...o, surcharge: was.surcharge } : { ...o };
    }),
  };
}

/** #221: a stored product, with the seed's question if it has none of its own. Pure. */
export function withSeedChoice(product, seedChoice) {
  if (product.choice || !seedChoice) return product;
  return { ...product, choice: seedChoice };
}

/* ───────────────────────────── I/O below ───────────────────────────── */

const CACHE_MS = 60_000;
let _cache = null; // { at, products }

/** Drop the in-process cache (after a write, and in tests). */
export const invalidatePricingCache = () => { _cache = null; };

/**
 * #221: the questions in the seed file, by product. A product stored before its
 * question existed is given the seed's question — with its default surcharge —
 * until the seed is run again or the firm prices it, so a deploy never leaves
 * the website asking a question the server does not know.
 */
let _seedChoices = null;
function seedChoices() {
  if (_seedChoices) return _seedChoices;
  try {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8')).products;
    _seedChoices = Object.fromEntries(Object.entries(seed)
      .map(([key, raw]) => [key, normaliseChoice(raw.choice)]).filter(([, c]) => c));
  } catch (err) {
    logger.warn({ err }, 'pricing: could not read the seed file for options');
    _seedChoices = {};
  }
  return _seedChoices;
}

const readProduct = (id, data) => withSeedChoice(normaliseProduct(id, data), seedChoices()[id]);

/** Every product, normalised. Cached for a minute — prices change rarely. */
export async function loadCatalog({ fresh = false } = {}) {
  if (!fresh && _cache && Date.now() - _cache.at < CACHE_MS) return _cache.products;
  const snap = await getDb().collection(COLLECTION).get();
  const products = snap.docs.map((d) => readProduct(d.id, d.data()))
    .sort((a, b) => a.label.localeCompare(b.label));
  _cache = { at: Date.now(), products };
  return products;
}

/** The plan being bought, read fresh — a payment must never use a stale price. */
export async function resolvePlan(productKey, planId, optionId) {
  return findPlan(await loadCatalog({ fresh: true }), productKey, planId, optionId);
}

export async function updateProduct(productKey, patch, actorUid) {
  const ref = getDb().collection(COLLECTION).doc(productKey);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const { key: _key, ...next } = applyUpdate(readProduct(productKey, snap.data()), patch);
  await ref.set({ ...next, updatedAt: new Date().toISOString(), updatedBy: actorUid ?? null }, { merge: true });
  invalidatePricingCache();
  logger.info({ productKey, actorUid }, 'pricing: product updated');
  return { key: productKey, ...next };
}

/** Load shared/pricing/catalog.json into Firestore. Safe to re-run. */
export async function seedCatalog({ force = false, relink = false, dryRun = false } = {}) {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8')).products;
  const db = getDb();
  const created = []; const updated = []; const unchanged = [];
  for (const [key, raw] of Object.entries(seed)) {
    const ref = db.collection(COLLECTION).doc(key);
    const snap = await ref.get();
    const { product, changed } = mergeSeed(key, snap.exists ? snap.data() : null, raw, { force, relink });
    if (!changed) { unchanged.push(key); continue; }
    (snap.exists ? updated : created).push(key);
    if (dryRun) continue;
    const { key: _key, ...doc } = product;
    await ref.set({ ...doc, seededAt: new Date().toISOString() }, { merge: !force });
  }
  invalidatePricingCache();
  return { created, updated, unchanged };
}
