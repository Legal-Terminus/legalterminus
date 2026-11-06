/**
 * Coupon codes (#256, #257, #260) — reads and writes. The rules are pure, in
 * coupons.js; the discount itself is `couponDiscounts` in orderItems.js. What
 * a payment does to a coupon happens inside the payment's own transaction, in
 * orders.service.js (`settlePaid`), so it happens once.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { loadCatalog } from './pricing.service.js';
import {
  COUPON_COLLECTION, REDEMPTION_COLLECTION, couponDefinition, couponState, deleteRefusal, editRefusal,
  isValidCode, normaliseCode,
} from './coupons.js';

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const col = () => getDb().collection(COUPON_COLLECTION);
const redemptions = () => getDb().collection(REDEMPTION_COLLECTION);
const nowIso = () => new Date().toISOString();

const fromSnap = (snap) => (snap.exists ? { code: snap.id, ...snap.data() } : null);

/** The stored coupon for what a customer typed, or null. A badly formed code is simply not found. */
export async function findCoupon(typed) {
  const code = normaliseCode(typed);
  if (!isValidCode(code)) return null;
  return fromSnap(await col().doc(code).get());
}

/** Staff view of one coupon: the stored fields plus where it stands now. */
const staffView = (c, now = Date.now()) => ({ ...c, state: couponState(c, now) });

/** Every product a `services` coupon names must be on the price list. */
async function checkProducts(def) {
  if (def.scope !== 'services') return;
  const known = new Set((await loadCatalog({ fresh: true })).map((p) => p.key));
  const unknown = def.productKeys.filter((k) => !known.has(k));
  if (unknown.length) throw httpError(400, 'One of the chosen services is no longer on the price list. Choose again.', 'UNKNOWN_SERVICE');
}

/** Staff list, newest first, one page. One ordered query — no composite index. */
export async function listCoupons({ limit = 25, cursor } = {}) {
  let q = col().orderBy('createdAt', 'desc').limit(limit + 1);
  if (cursor) {
    const after = await col().doc(cursor).get();
    if (after.exists) q = q.startAfter(after);
  }
  const snap = await q.get();
  const rows = snap.docs.map(fromSnap);
  const now = Date.now();
  return { data: rows.slice(0, limit).map((c) => staffView(c, now)), nextCursor: rows.length > limit ? rows[limit - 1].code : null };
}

export async function getCoupon(code) {
  const c = fromSnap(await col().doc(normaliseCode(code)).get());
  return c ? staffView(c) : null;
}

/** Create a coupon. The code is its document id, so a second one with the same code is refused. */
export async function createCoupon(input, actor) {
  const code = normaliseCode(input.code);
  const def = couponDefinition(input);
  await checkProducts(def);
  const doc = {
    ...def, active: input.active ?? true, usedCount: 0, heldBy: null, consumedBy: null,
    createdBy: { uid: actor.uid, name: actor.name ?? '' }, createdAt: nowIso(), updatedAt: nowIso(),
    updatedBy: { uid: actor.uid, name: actor.name ?? '' },
  };
  try {
    await col().doc(code).create(doc);
  } catch (err) {
    if (err?.code === 6 || /already exists/i.test(err?.message ?? '')) {
      throw httpError(409, `A coupon with the code ${code} already exists. Choose another code.`, 'COUPON_EXISTS');
    }
    throw err;
  }
  logger.info({ code, actorUid: actor.uid }, 'coupons: created');
  return staffView({ code, ...doc });
}

/**
 * Change a coupon's terms. Its redemptions keep their own figures, so what has
 * already happened is not rewritten. The hold, the use count and who used a
 * one-time code are the payments' — an edit never touches them.
 */
export async function updateCoupon(code, input, actor) {
  const ref = col().doc(normaliseCode(code));
  const def = couponDefinition(input);
  await checkProducts(def);
  const saved = await getDb().runTransaction(async (tx) => {
    const existing = fromSnap(await tx.get(ref));
    if (!existing) throw httpError(404, 'Coupon not found.', 'NOT_FOUND');
    const next = { ...def, active: input.active ?? existing.active };
    const why = editRefusal(existing, next);
    if (why) throw httpError(409, why, 'COUPON_EDIT_REFUSED');
    const patch = { ...next, updatedAt: nowIso(), updatedBy: { uid: actor.uid, name: actor.name ?? '' } };
    tx.update(ref, patch);
    return { ...existing, ...patch };
  });
  logger.info({ code: saved.code, actorUid: actor.uid }, 'coupons: updated');
  return staffView(saved);
}

/** Switch a coupon on or off. */
export async function setCouponActive(code, active, actor) {
  const ref = col().doc(normaliseCode(code));
  const saved = await getDb().runTransaction(async (tx) => {
    const existing = fromSnap(await tx.get(ref));
    if (!existing) throw httpError(404, 'Coupon not found.', 'NOT_FOUND');
    const why = editRefusal(existing, { ...existing, active });
    if (why) throw httpError(409, why, 'COUPON_EDIT_REFUSED');
    const patch = { active, updatedAt: nowIso(), updatedBy: { uid: actor.uid, name: actor.name ?? '' } };
    tx.update(ref, patch);
    return { ...existing, ...patch };
  });
  logger.info({ code: saved.code, active, actorUid: actor.uid }, 'coupons: switched');
  return staffView(saved);
}

/** Delete a coupon nobody has used (a mistyped one). A used coupon is history: switch it off. */
export async function deleteCoupon(code) {
  const ref = col().doc(normaliseCode(code));
  await getDb().runTransaction(async (tx) => {
    const existing = fromSnap(await tx.get(ref));
    if (!existing) throw httpError(404, 'Coupon not found.', 'NOT_FOUND');
    const why = deleteRefusal(existing);
    if (why) throw httpError(409, why, 'COUPON_IN_USE');
    tx.delete(ref);
  });
  logger.info({ code: normaliseCode(code) }, 'coupons: deleted');
}

/* ───────────────────────────── The report ───────────────────────────── */

/** The report's date filter: IST calendar days, inclusive. */
const range = ({ from, to }) => ({
  from: from ? new Date(`${from}T00:00:00.000+05:30`).toISOString() : null,
  to: to ? new Date(`${to}T23:59:59.999+05:30`).toISOString() : null,
});

/**
 * Redemptions, newest payment first, one page. Filtering and ordering on the
 * same field (`paidAt`) needs no composite index.
 */
function redemptionQuery(filters) {
  const { from, to } = range(filters);
  let q = redemptions().orderBy('paidAt', 'desc');
  if (from) q = q.where('paidAt', '>=', from);
  if (to) q = q.where('paidAt', '<=', to);
  return q;
}

export async function listRedemptions({ limit = 25, cursor, from, to } = {}) {
  let q = redemptionQuery({ from, to }).limit(limit + 1);
  if (cursor) {
    const after = await redemptions().doc(cursor).get();
    if (after.exists) q = q.startAfter(after);
  }
  const snap = await q.get();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return { data: rows.slice(0, limit), nextCursor: rows.length > limit ? rows[limit - 1].id : null };
}

/** At most this many rows go into one CSV — narrow the dates for more. */
export const CSV_LIMIT = 5000;

export async function redemptionsCsv({ from, to } = {}) {
  const snap = await redemptionQuery({ from, to }).limit(CSV_LIMIT).get();
  const headers = [
    'Coupon code', 'Discount type', 'Discount value', 'Created by', 'Coupon created', 'Client name', 'Client email',
    'Services purchased', 'Original amount (before GST)', 'Discount', 'GST', 'Final paid amount', 'Used on', 'Order', 'Note',
  ];
  const escape = (v) => {
    // A cell starting with = + - @ would run as a formula in a spreadsheet.
    const s = String(v ?? '');
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const lines = snap.docs.map((d) => {
    const r = d.data();
    return [
      r.code, r.discountType === 'percent' ? 'Percentage' : 'Fixed amount', r.discountValue,
      r.couponCreatedBy?.name ?? '', r.couponCreatedAt ?? '', r.clientName, r.clientEmail,
      (r.services ?? []).map((s) => `${s.label} (${s.planName})`).join('; '),
      r.originalAmount, r.discount, r.gst, r.amountPaid, r.paidAt, r.orderId, r.note ?? '',
    ].map(escape).join(',');
  });
  return [headers.map(escape).join(','), ...lines].join('\r\n');
}
