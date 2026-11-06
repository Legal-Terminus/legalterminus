/**
 * Coupon codes (#256, #257, #260) — the RULES. Pure: no I/O, unit-tested in
 * __tests__/coupons.test.js. The reads and writes are in coupons.service.js;
 * how a coupon changes an order's price is `couponDiscounts` in orderItems.js.
 *
 * A coupon is `coupons/{CODE}` — the document id IS the code, upper case, so
 * two coupons can never share one.
 *
 *   discountType  percent (1–100) | fixed (whole rupees)
 *   scope         general (every service) | services (only `productKeys`) |
 *                 min_amount (the whole order, once its price before GST
 *                 reaches `minAmount`)
 *   validity      one_time (one successful payment, then inactive for
 *                 everyone) | period (`startsAt` … `endsAt`, any number of
 *                 clients in between)
 *   active        staff switch it on and off
 *   usedCount     successful payments that used it
 *   heldBy        one_time only: { orderId, uid, until } — a checkout in
 *                 progress holds the code for HOLD_MS so two people cannot
 *                 both pay with it
 *   consumedBy    one_time only: { orderId, uid, at } — the payment that used it
 *
 * Redemptions are recorded in `couponRedemptions/{orderId}`, once, when the
 * order is paid, with their own copy of every figure — so editing or switching
 * off a coupon later never changes what the report says happened.
 */

export const COUPON_COLLECTION = 'coupons';
export const REDEMPTION_COLLECTION = 'couponRedemptions';
/** How long a checkout holds a one-time code. The same as an order's own life. */
export const HOLD_MS = 30 * 60 * 1000;
export const CODE_PATTERN = /^[A-Z0-9-]{3,30}$/;
export const DISCOUNT_TYPES = ['percent', 'fixed'];
export const SCOPES = ['general', 'services', 'min_amount'];
export const VALIDITIES = ['one_time', 'period'];

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** What a customer types, as the code is stored: trimmed, upper case. */
export const normaliseCode = (s) => String(s ?? '').trim().toUpperCase();
export const isValidCode = (s) => CODE_PATTERN.test(s);

/** "6 Nov 2026", in India time. */
export const istDay = (iso) => new Date(iso).toLocaleDateString('en-IN', {
  timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric',
});

/**
 * A validity period chosen as calendar dates in India: from the START of the
 * first day to the END of the last, IST. `YYYY-MM-DD` in, ISO instants out.
 */
export const istStartOf = (day) => new Date(`${day}T00:00:00.000+05:30`).toISOString();
export const istEndOf = (day) => new Date(`${day}T23:59:59.999+05:30`).toISOString();
/** The IST calendar date of an instant, `YYYY-MM-DD` — for the edit form. */
export const istDate = (iso) => new Date(Date.parse(iso) + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

const INVALID = 'This coupon code is not valid. Check the code and try again.';

/** A one-time code someone ELSE's checkout is holding right now. */
export function heldByOther(c, { now = Date.now(), uid, orderId } = {}) {
  const h = c?.heldBy;
  if (!h || !(Date.parse(h.until) > now)) return false;
  // The same customer coming back to checkout takes their own hold over.
  if (uid && h.uid === uid) return false;
  if (orderId && h.orderId === orderId) return false;
  return true;
}

/**
 * Why this coupon cannot be used now, or null when it can. Pure. Says nothing
 * about the order — `couponDiscounts` answers whether it fits the order.
 * Returns { status, message, code } ready to throw.
 */
export function couponRefusal(c, ctx = {}) {
  const now = ctx.now ?? Date.now();
  const no = (message, code, status = 422) => ({ status, message, code });
  if (!c) return no(INVALID, 'COUPON_INVALID');
  if (c.validity === 'one_time' && c.consumedBy) return no('This code has already been used.', 'COUPON_USED');
  if (c.active !== true) return no(INVALID, 'COUPON_INVALID');
  if (c.validity === 'period') {
    if (now < Date.parse(c.startsAt)) return no(`This code can be used from ${istDay(c.startsAt)}.`, 'COUPON_NOT_STARTED');
    if (now > Date.parse(c.endsAt)) return no(`This code expired on ${istDay(c.endsAt)}.`, 'COUPON_EXPIRED');
  }
  if (c.validity === 'one_time' && heldByOther(c, { ...ctx, now })) {
    return no('This code is being used in another checkout. Try again in a few minutes.', 'COUPON_HELD', 409);
  }
  return null;
}

/** Throw `couponRefusal`'s answer, if there is one. */
export function assertUsable(c, ctx) {
  const r = couponRefusal(c, ctx);
  if (r) throw httpError(r.status, r.message, r.code);
}

/**
 * Where a coupon stands, for the staff list. Pure.
 * used → inactive → scheduled / expired → in_checkout → active.
 */
export function couponState(c, now = Date.now()) {
  if (c.validity === 'one_time' && c.consumedBy) return 'used';
  if (c.active !== true) return 'inactive';
  if (c.validity === 'period') {
    if (now < Date.parse(c.startsAt)) return 'scheduled';
    if (now > Date.parse(c.endsAt)) return 'expired';
  }
  if (c.validity === 'one_time' && c.heldBy && Date.parse(c.heldBy.until) > now) return 'in_checkout';
  return 'active';
}

/**
 * The stored definition of a coupon from what staff entered (already through
 * the Zod schema). Only the fields its type uses are kept: a `general` coupon
 * has no `productKeys`, a `one_time` one no dates. Pure.
 */
export function couponDefinition(input) {
  return {
    description: input.description ?? '',
    discountType: input.discountType,
    discountValue: input.discountValue,
    scope: input.scope,
    productKeys: input.scope === 'services' ? [...new Set(input.productKeys)] : [],
    minAmount: input.scope === 'min_amount' ? input.minAmount : null,
    validity: input.validity,
    startsAt: input.validity === 'period' ? istStartOf(input.startDate) : null,
    endsAt: input.validity === 'period' ? istEndOf(input.endDate) : null,
  };
}

/**
 * Why this edit of a stored coupon is not allowed, or null. Pure.
 * What a coupon was when it was used is in its redemptions, so most edits are
 * safe. Two are not: switching a USED one-time code back on (it would be a
 * second "one-time" use), and turning a code that has been used into a
 * one-time code (it already has more than its one use).
 */
export function editRefusal(existing, next) {
  if (existing.validity === 'one_time' && existing.consumedBy && next.active === true) {
    return 'This one-time code has already been used, so it cannot be switched on again. Create a new code instead.';
  }
  if (next.validity === 'one_time' && existing.validity !== 'one_time' && (existing.usedCount ?? 0) > 0) {
    return 'This code has already been used, so it cannot become a one-time code. Create a new code instead.';
  }
  return null;
}

/** Why a coupon cannot be deleted, or null. Used codes are history; deactivate those. */
export function deleteRefusal(c, now = Date.now()) {
  if ((c.usedCount ?? 0) > 0) return 'This code has been used, so it is kept for the coupon report. Switch it off instead.';
  if (c.heldBy && Date.parse(c.heldBy.until) > now) return 'This code is in a checkout right now. Try again in a few minutes, or switch it off.';
  return null;
}

/** What an order keeps of the coupon it was priced with: the terms on the day. */
export function couponSnapshot(c) {
  return {
    discountType: c.discountType, discountValue: c.discountValue, scope: c.scope, validity: c.validity,
    ...(c.scope === 'services' ? { productKeys: c.productKeys ?? [] } : {}),
    ...(c.scope === 'min_amount' ? { minAmount: c.minAmount } : {}),
    createdBy: c.createdBy ?? null, createdAt: c.createdAt ?? null,
  };
}

/** How a coupon reads in a sentence: "10% off" / "₹500 off". */
export const discountLabel = (c) => (c.discountType === 'percent' ? `${c.discountValue}% off` : `${rupees(c.discountValue)} off`);

/**
 * The redemption a paid order writes, with its own copy of every figure. Pure.
 * `originalAmount` is the price before the discount and before GST, so
 * originalAmount − discount + gst = amountCharged.
 */
export function redemptionRecord(order, { amountPaid, paidAt, note } = {}) {
  const lines = Array.isArray(order.items) && order.items.length ? order.items : [order];
  const c = order.coupon ?? {};
  return {
    orderId: order.orderId, code: order.couponCode,
    discountType: c.discountType ?? null, discountValue: c.discountValue ?? null,
    scope: c.scope ?? null, validity: c.validity ?? null,
    couponCreatedBy: c.createdBy ?? null, couponCreatedAt: c.createdAt ?? null,
    uid: order.uid, clientName: order.customer?.name ?? '', clientEmail: order.customer?.email ?? '',
    services: lines.map((l) => ({
      productKey: l.productKey ?? null, label: l.label, planName: l.planName,
      listPrice: l.listPrice ?? l.price, discount: l.discount ?? 0, price: l.price, gst: l.gst ?? 0, amount: l.amount,
    })),
    originalAmount: order.subtotalBeforeDiscount, discount: order.discount, gst: order.gst ?? 0,
    amountCharged: order.amount, amountPaid: amountPaid ?? order.amount,
    paidAt, gateway: order.gateway ?? null,
    ...(note ? { note } : {}),
  };
}

/**
 * What a payment does to the coupon it used — decided inside the payment's own
 * transaction, so it happens exactly once. Pure. `coupon` is the stored coupon
 * (null if it has since been deleted). Returns { update, note } where `update`
 * is the coupon's new fields (null when there is no coupon to update).
 *
 * A one-time code is consumed by the FIRST payment: switched off, `consumedBy`
 * set, the hold released. A payment that arrives after its hold expired and
 * someone else's payment consumed the code is still honoured — the customer
 * paid the price they were shown, and money taken is never refused — and the
 * redemption says so in its `note`.
 */
export function couponOnPaid(coupon, order, at) {
  if (!coupon) return { update: null, note: 'The coupon had been deleted when this order was paid.' };
  const update = { usedCount: (coupon.usedCount ?? 0) + 1, lastUsedAt: at, updatedAt: at };
  let note;
  if (coupon.validity === 'one_time') {
    if (!coupon.consumedBy) {
      Object.assign(update, { active: false, consumedBy: { orderId: order.orderId, uid: order.uid, at }, heldBy: null });
    } else if (coupon.consumedBy.orderId !== order.orderId) {
      note = `Paid after this one-time code had already been used by order ${coupon.consumedBy.orderId}. The price paid was honoured.`;
      if (coupon.heldBy?.orderId === order.orderId) update.heldBy = null;
    }
  }
  return { update, note };
}

/** The coupon's figures as the checkout shows them. */
export function quoteView(priced, coupon) {
  const lines = Array.isArray(priced.items) && priced.items.length ? priced.items : [priced];
  return {
    lines: lines.map((l) => ({
      productKey: l.productKey, label: l.label, planName: l.planName,
      listPrice: l.listPrice ?? l.price, discount: l.discount ?? 0, price: l.price, gst: l.gst, amount: l.amount,
    })),
    subtotalBeforeDiscount: priced.subtotalBeforeDiscount ?? priced.price,
    discount: priced.discount ?? 0,
    price: priced.price, gst: priced.gst, gstPercent: priced.gstPercent, amount: priced.amount,
    coupon: coupon ? {
      code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue,
      scope: coupon.scope, label: discountLabel(coupon),
    } : null,
  };
}
