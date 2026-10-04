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
 *   { label, serviceKey, plans: [{ id, name, price, oldPrice, active }] }
 * `serviceKey` is the portal service the product corresponds to (or null) — it
 * is what will let a paid order open a matter (E24-S03).
 *
 * Seeded once from shared/pricing/catalog.json (built from the website by
 * scripts/build-pricing-catalog.py). After that THIS collection is the source
 * of truth; the seed never overwrites a price the firm has changed.
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
  return {
    key,
    label: typeof raw.label === 'string' && raw.label ? raw.label : key,
    serviceKey: typeof raw.serviceKey === 'string' && raw.serviceKey ? raw.serviceKey : null,
    plans,
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
    if (plans.length) out[p.key] = { label: p.label, plans };
  }
  return out;
}

/**
 * The plan a customer is buying, or null. THIS is what a payment must use for
 * its amount — never a number sent by the browser. An inactive plan is not for
 * sale and returns null.
 */
export function findPlan(products, productKey, planId) {
  const product = products.find((p) => p.key === productKey);
  const plan = product?.plans.find((pl) => pl.id === planId && pl.active);
  if (!plan) return null;
  return {
    productKey, planId: plan.id, label: product.label, planName: plan.name,
    amount: plan.price, serviceKey: product.serviceKey,
  };
}

/**
 * Apply an admin's edit. Plans are matched by id: an edit can change a plan's
 * price, strikethrough price, name or whether it is on sale, but cannot invent
 * a plan the website has no card for. Throws (status 400) on an unknown plan.
 */
export function applyUpdate(existing, patch = {}) {
  const next = { ...existing, plans: existing.plans.map((p) => ({ ...p })) };
  if (patch.label !== undefined) next.label = patch.label;
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
 * Merge the seed into what is stored, WITHOUT touching anything already there:
 * a missing product is added, and a missing plan is added to an existing
 * product. Existing prices are left alone — the firm may have changed them.
 * Returns { product, changed } — `changed` false means nothing to write.
 */
export function mergeSeed(key, stored, seed, { force = false } = {}) {
  const fresh = normaliseProduct(key, seed);
  if (!stored || force) return { product: fresh, changed: true };
  const current = normaliseProduct(key, stored);
  const missing = fresh.plans.filter((p) => !current.plans.some((c) => c.id === p.id));
  if (!missing.length) return { product: current, changed: false };
  return { product: { ...current, plans: [...current.plans, ...missing] }, changed: true };
}

/* ───────────────────────────── I/O below ───────────────────────────── */

const CACHE_MS = 60_000;
let _cache = null; // { at, products }

/** Drop the in-process cache (after a write, and in tests). */
export const invalidatePricingCache = () => { _cache = null; };

/** Every product, normalised. Cached for a minute — prices change rarely. */
export async function loadCatalog({ fresh = false } = {}) {
  if (!fresh && _cache && Date.now() - _cache.at < CACHE_MS) return _cache.products;
  const snap = await getDb().collection(COLLECTION).get();
  const products = snap.docs.map((d) => normaliseProduct(d.id, d.data()))
    .sort((a, b) => a.label.localeCompare(b.label));
  _cache = { at: Date.now(), products };
  return products;
}

/** The plan being bought, read fresh — a payment must never use a stale price. */
export async function resolvePlan(productKey, planId) {
  return findPlan(await loadCatalog({ fresh: true }), productKey, planId);
}

export async function updateProduct(productKey, patch, actorUid) {
  const ref = getDb().collection(COLLECTION).doc(productKey);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const { key: _key, ...next } = applyUpdate(normaliseProduct(productKey, snap.data()), patch);
  await ref.set({ ...next, updatedAt: new Date().toISOString(), updatedBy: actorUid ?? null }, { merge: true });
  invalidatePricingCache();
  logger.info({ productKey, actorUid }, 'pricing: product updated');
  return { key: productKey, ...next };
}

/** Load shared/pricing/catalog.json into Firestore. Safe to re-run. */
export async function seedCatalog({ force = false, dryRun = false } = {}) {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8')).products;
  const db = getDb();
  const created = []; const updated = []; const unchanged = [];
  for (const [key, raw] of Object.entries(seed)) {
    const ref = db.collection(COLLECTION).doc(key);
    const snap = await ref.get();
    const { product, changed } = mergeSeed(key, snap.exists ? snap.data() : null, raw, { force });
    if (!changed) { unchanged.push(key); continue; }
    (snap.exists ? updated : created).push(key);
    if (dryRun) continue;
    const { key: _key, ...doc } = product;
    await ref.set({ ...doc, seededAt: new Date().toISOString() }, { merge: !force });
  }
  invalidatePricingCache();
  return { created, updated, unchanged };
}
