/**
 * #244 — a website order for SEVERAL services (the website's cart), paid in one
 * checkout. Pure: no I/O, unit-tested in __tests__/orderItems.test.js. The
 * order lifecycle itself stays in orders.service.js; this module only answers
 * "what does this cart cost" and "what became of each line".
 *
 * SHAPE. A one-service order is stored EXACTLY as before (#212): productKey,
 * planId, label, planName, serviceKey, price, gst, amount — and no `items`.
 * An order of two or more services adds `items`, one per service:
 *
 *   items: [{ productKey, productCode, planId, label, planName, serviceKey,
 *             price, gst, gstPercent, amount,
 *             matter: { state, taskId?, reason?, error? } }]
 *
 * and its top-level price / gst / amount are the SUMS of the lines — so every
 * check that compares a payment with `order.amount` (decideSettlement, the
 * review hold) works unchanged. Its top-level `matter.state` is the one the
 * staff screen and `canApprove` already read; each line's own state says which
 * matter it opened.
 *
 * DECISIONS
 * - One plan per SERVICE in an order. A service's plans are tiers ("Everything
 *   in Elemental, plus…"), so two of them in one order is almost always a
 *   mistake; the cart swaps the plan instead of adding a second. No quantity
 *   either: the catalogue has none, and one line opens one matter.
 * - At most MAX_ORDER_ITEMS lines: one checkout, one approval, a bounded number
 *   of matters opened by one click.
 *
 * QUANTITIES (#244, the firm's request of 2026-11-12). A cart line may ask for
 * several UNITS of its plan ("3 Trademark Registrations"): `quantity`, an
 * integer 1..MAX_LINE_QUANTITY, at most MAX_ORDER_UNITS units in the order.
 * The server EXPANDS a line into one stored item per unit (`expandUnits`), so
 * each unit is priced, discounted and GST'd exactly as a line always was, and
 * opens its own matter with its own share — the matter machinery below is
 * unchanged and stays idempotent per stored item. A unit of a line of 2+
 * carries `quantity` (the line's) and `unitNo` (1-based); an item without
 * them is a quantity of 1, which is every order stored before quantities.
 * `groupUnits` puts the units back together for anything a person reads
 * (the checkout quote, the customer's order, the email, the redemption).
 * A line of quantity 1 is stored exactly as before.
 * - ONE approval opens every line's matter. The staff screen has one Approve
 *   button per order, and the customer paid once — splitting the approval
 *   would leave a paid order half-started with nothing on screen to say why.
 */

import { withGst } from './pricing.service.js';

export const MAX_ORDER_ITEMS = 10;
/** #244: units of one service on one line, and units in one order (= matters one approval opens). */
export const MAX_LINE_QUANTITY = 10;
export const MAX_ORDER_UNITS = 20;

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const paise = (n) => Math.round(n * 100) / 100;

/** The order has several lines (a cart). A one-service order has no `items`. */
export const isMultiItem = (o) => Array.isArray(o?.items) && o.items.length > 0;

/**
 * What is being bought, as a list of { productKey, planId }. Accepts the old
 * one-plan request or a list. Throws (400) on an empty, oversized or
 * repeated list — the schema refuses these too; this is the service's own guard.
 */
export function requestedItems({ productKey, planId, optionId, items } = {}) {
  // #221: a line may carry the answer to its product's question; the catalogue checks it.
  const withOption = (l, o) => (o ? { ...l, optionId: o } : l);
  // #244: and how many units of it. Missing is 1; 1 is not stored on the line.
  const withQuantity = (l, q) => {
    if (q === undefined || q === null) return l;
    if (!Number.isInteger(q) || q < 1 || q > MAX_LINE_QUANTITY) {
      throw httpError(400, `Choose a quantity from 1 to ${MAX_LINE_QUANTITY} for each service.`, 'BAD_QUANTITY');
    }
    return q > 1 ? { ...l, quantity: q } : l;
  };
  const list = Array.isArray(items) && items.length
    ? items.map((i) => withQuantity(withOption({ productKey: i.productKey, planId: i.planId }, i.optionId), i.quantity))
    : (productKey && planId ? [withOption({ productKey, planId }, optionId)] : []);
  if (!list.length) throw httpError(400, 'Choose a service to buy.', 'NO_ITEMS');
  if (list.length > MAX_ORDER_ITEMS) {
    throw httpError(400, `An order can hold at most ${MAX_ORDER_ITEMS} services. Please pay for the rest separately.`, 'TOO_MANY_ITEMS');
  }
  const seen = new Set();
  for (const i of list) {
    if (seen.has(i.productKey)) throw httpError(400, 'Each service can be in an order only once. Choose one plan for it.', 'DUPLICATE_ITEM');
    seen.add(i.productKey);
  }
  if (unitCount(list) > MAX_ORDER_UNITS) {
    throw httpError(400, `An order can hold at most ${MAX_ORDER_UNITS} services in all. Please lower a quantity, or pay for the rest separately.`, 'TOO_MANY_UNITS');
  }
  return list;
}

/** #244: how many units a list of lines (or stored items) holds. Missing quantity is 1. */
const qty = (l) => (Number.isInteger(l?.quantity) && l.quantity > 1 ? l.quantity : 1);
export const unitCount = (lines) => lines.reduce((s, l) => s + qty(l), 0);

/**
 * #244: one entry per UNIT — `[plan, plan, plan]` for a line of 3 — each
 * marked with the line's quantity and its own number when the line has more
 * than one. `plans[i]` is the `findPlan` result for `lines[i]` (null when not
 * on sale: kept, so `priceOrder` refuses the whole order as before).
 */
export function expandUnits(lines, plans) {
  return lines.flatMap((l, i) => {
    const q = qty(l);
    const p = plans[i];
    if (q === 1 || !p) return [p];
    return Array.from({ length: q }, (_, n) => ({ ...p, quantity: q, unitNo: n + 1 }));
  });
}

/**
 * #244: the units of an order put back into the lines the customer chose — one
 * per service (an order holds a service once), in order, with `quantity` and
 * the line's sums. `units` keeps the stored items, with their index in
 * `items`. An item with no quantity is a line of one, so an order stored
 * before quantities groups into exactly its old lines.
 */
export function groupUnits(items) {
  const lines = [];
  const at = new Map();
  items.forEach((it, index) => {
    const key = it.productKey ?? `#${index}`;
    let line = at.get(key);
    if (!line) {
      line = { ...it, quantity: 0, price: 0, gst: 0, amount: 0, listPrice: 0, discount: 0, units: [] };
      delete line.unitNo;
      delete line.matter;
      at.set(key, line);
      lines.push(line);
    }
    line.quantity += 1;
    line.price = paise(line.price + it.price);
    line.gst = paise(line.gst + (it.gst ?? 0));
    line.amount = paise(line.amount + it.amount);
    line.listPrice = paise(line.listPrice + (it.listPrice ?? it.price));
    line.discount = paise(line.discount + (it.discount ?? 0));
    line.units.push({ ...it, index });
  });
  // A unit's own figures; when a fixed coupon split unevenly, the first unit's.
  return lines.map((l) => ({
    ...l, unitPrice: l.units[0].price, unitAmount: l.units[0].amount,
    sameUnits: l.units.every((u) => u.amount === l.units[0].amount),
  }));
}
/**
 * Price an order from the catalogue's plans (`findPlan` results, null for a
 * plan not on sale). Each line's GST is the catalogue's own (`findPlan` →
 * `withGst`); the order's figures are the sums, to the paisa. One plan →
 * the order fields exactly as a one-service order has always had them.
 *
 * COUPONS (#256, #257, #260). With `discount` — the result of
 * `couponDiscounts(plans, coupon)` — each discounted line keeps its catalogue
 * price as `listPrice`, records its `discount`, and its `price` becomes the
 * price AFTER the discount. GST is then worked out again on that price
 * (`withGst`), so the discount comes off before GST and `amount` stays
 * "price + GST" for every line. The order adds `couponCode`, `discount` (the
 * sum) and `subtotalBeforeDiscount`; its price / gst / amount are the
 * discounted sums — so every check against `order.amount` and every matter's
 * total (a line's `amount`) works unchanged. Without a coupon nothing here
 * changes: no coupon field is written.
 */
export function priceOrder(plans, discount = null) {
  if (!plans.length || plans.some((p) => !p)) throw httpError(404, 'That plan is not available.', 'PLAN_NOT_FOUND');
  const line = (p, i) => {
    const base = {
      productKey: p.productKey, productCode: p.productCode ?? '', planId: p.planId,
      label: p.label, planName: p.planName, serviceKey: p.serviceKey ?? null,
      price: p.price, gst: p.gst, gstPercent: p.gstPercent, amount: p.amount,
      // #221: the answer and the surcharge it added — `price` already includes it.
      ...(p.optionId ? {
        optionId: p.optionId, optionName: p.optionName, optionLabel: p.optionLabel,
        basePrice: p.basePrice, surcharge: p.surcharge,
      } : {}),
      // #244: one unit of a line of several (see expandUnits).
      ...(p.quantity > 1 ? { quantity: p.quantity, unitNo: p.unitNo } : {}),
    };
    if (!discount) return base;
    const off = discount.perLine[i] ?? 0;
    const after = withGst(paise(p.price - off), p.gstPercent);
    return { ...base, listPrice: p.price, discount: off, price: after.price, gst: after.gst, amount: after.total };
  };
  const coupon = discount ? {
    couponCode: discount.code,
    discount: paise(discount.perLine.reduce((s, d) => s + d, 0)),
    subtotalBeforeDiscount: paise(plans.reduce((s, p) => s + p.price, 0)),
  } : {};
  if (plans.length === 1) return { ...line(plans[0], 0), ...coupon };
  const items = plans.map((p, i) => ({ ...line(p, i), matter: { state: 'none' } }));
  return {
    // No single product: staff and the customer read the lines.
    productKey: null, productCode: '', planId: null, serviceKey: null,
    // #244: every unit is a service bought ("3 services" for 3 Trademark Registrations).
    label: `${items.length} services`,
    planName: groupUnits(items).map((l) => `${l.label} (${l.planName})${l.quantity > 1 ? ` × ${l.quantity}` : ''}`).join(', '),
    price: paise(items.reduce((s, i) => s + i.price, 0)),
    gst: paise(items.reduce((s, i) => s + i.gst, 0)),
    gstPercent: items[0].gstPercent,
    amount: paise(items.reduce((s, i) => s + i.amount, 0)),
    ...coupon,
    items,
  };
}

/**
 * After payment: which lines can open a matter. `hasWorkflow[i]` answers for
 * line i; `matterOutcome` is orders.service's own rule, passed in so there is
 * one rule. The order waits for approval when ANY line can open a matter.
 */
export function planLineMatters(items, hasWorkflow, matterOutcome) {
  const lines = items.map((it, i) => {
    if (it.matter?.state === 'created') return it; // already opened: a retry leaves it alone
    const plan = matterOutcome(it, !!hasWorkflow[i]);
    return { ...it, matter: plan.open ? { state: 'awaiting_approval' } : { state: 'not_applicable', reason: plan.why } };
  });
  const any = lines.some((l) => l.matter.state === 'awaiting_approval');
  return {
    items: lines,
    matter: any ? { state: 'awaiting_approval' } : { state: 'not_applicable', reason: 'None of these services opens a matter by itself.' },
  };
}

/** The lines an approval opens a matter for: waiting, or tried and failed. */
export const linesToOpen = (items) => items
  .map((it, index) => ({ it, index }))
  .filter(({ it }) => ['awaiting_approval', 'pending', 'failed'].includes(it.matter?.state));

/**
 * The order's matter state once its lines have been tried. Pure.
 * `opened` is [{ index, taskId } | { index, error }], one per line tried.
 * Lines not tried (opened before, or not_applicable) keep their state.
 */
export function settleLineMatters(items, opened, approval) {
  const next = items.map((it) => ({ ...it }));
  for (const { index, taskId, error } of opened) {
    next[index].matter = taskId ? { state: 'created', taskId } : { state: 'failed', error };
  }
  const failed = next.filter((it) => it.matter?.state === 'failed');
  const matter = failed.length
    ? { state: 'failed', error: failed.map((f) => `${f.label}: ${f.matter.error}`).join(' '), ...approval }
    : { state: 'created', ...approval };
  return { items: next, matter };
}

/** The customer's view of each line, and the first matter they can follow. */
export function publicItems(o) {
  if (!isMultiItem(o)) return {};
  // #244: one entry per line the customer chose, with its quantity and the
  // line's totals; `matterIds` has one entry per matter opened for it.
  const items = groupUnits(o.items).map((l) => {
    const matterIds = l.units.map((u) => (u.matter?.state === 'created' ? (u.matter.taskId ?? null) : null)).filter(Boolean);
    return {
      label: l.label, planName: l.planName, quantity: l.quantity,
      unitAmount: l.unitAmount, price: l.price, gst: l.gst, amount: l.amount,
      ...(l.optionId ? { optionLabel: l.optionLabel, optionName: l.optionName } : {}), // #221
      // #256: a line a coupon reduced shows what it cost before, and by how much.
      ...(l.discount ? { listPrice: l.listPrice, discount: l.discount } : {}),
      matterId: matterIds[0] ?? null,
      matterIds,
    };
  });
  return { items, matterId: items.find((i) => i.matterId)?.matterId ?? null };
}

/**
 * Lines for a message or an email: "Proprietorship — Elemental: ₹1,178.82".
 * #244: a line of several units: "Trademark — Supreme × 3: ₹21,237.64 (₹7,079.21 each)".
 */
export const itemLines = (o, rupees) => (isMultiItem(o)
  ? groupUnits(o.items).map((l) => `• ${l.label} — ${l.planName}${l.quantity > 1 ? ` × ${l.quantity}` : ''}: ${rupees(l.amount)}`
    + `${l.quantity > 1 && l.sameUnits ? ` (${rupees(l.unitAmount)} each)` : ''}`
    + `${l.discount ? ` (after a discount of ${rupees(l.discount)})` : ''}`)
  : []);

/** #244: "Startup India × 2, GST Registration" — a sentence's list of lines. */
export const linesSentence = (items) => groupUnits(items)
  .map((l) => `${l.label}${l.quantity > 1 ? ` × ${l.quantity}` : ''}`).join(', ');

/* ─────────────────────── Coupons (#256, #257, #260) ─────────────────────── */

/**
 * How much a coupon takes off each line, BEFORE GST. Pure. `plans` are the
 * `findPlan` results of the order; `coupon` is a stored coupon already found
 * valid for use (coupons.js decides that). Returns
 *   { code, perLine: [rupees off line i], eligible: [line indexes] }
 * or throws (422) with the message the customer is shown.
 *
 * - Eligible lines: all of them for `general` and `min_amount`; for `services`
 *   only lines whose product is in `productKeys`.
 * - `percent`: each eligible line's price × percent, to the paisa.
 * - `fixed`: never more than the eligible lines cost; split across them in
 *   proportion to price, the last eligible line taking the rounding remainder
 *   so the parts add up to the discount exactly.
 * - A coupon that would leave less than ₹1 to pay is refused.
 * `labels` maps productKey → the service's name, for the "applies only to" message.
 */
export const MIN_PAYABLE = 1;
export function couponDiscounts(plans, coupon, labels = {}) {
  const refuse = (message, code) => { throw httpError(422, message, code); };
  const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  const subtotal = paise(plans.reduce((s, p) => s + p.price, 0));

  if (coupon.scope === 'min_amount' && subtotal < coupon.minAmount) {
    refuse(`This code needs an order of at least ${rupees(coupon.minAmount)} before GST — add ${rupees(paise(coupon.minAmount - subtotal))} more.`, 'COUPON_MIN_AMOUNT');
  }
  const eligible = plans.map((p, i) => i).filter((i) => coupon.scope !== 'services'
    || (coupon.productKeys ?? []).includes(plans[i].productKey));
  if (!eligible.length) {
    const names = (coupon.productKeys ?? []).map((k) => labels[k] || k);
    refuse(`This code applies only to: ${names.join(', ')}.`, 'COUPON_NOT_APPLICABLE');
  }

  const perLine = plans.map(() => 0);
  if (coupon.discountType === 'percent') {
    for (const i of eligible) perLine[i] = paise(plans[i].price * coupon.discountValue / 100);
  } else {
    const base = paise(eligible.reduce((s, i) => s + plans[i].price, 0));
    const total = Math.min(coupon.discountValue, base);
    let given = 0;
    eligible.forEach((i, n) => {
      if (n === eligible.length - 1) {
        perLine[i] = Math.min(plans[i].price, Math.max(0, paise(total - given)));
      } else {
        perLine[i] = paise(total * plans[i].price / base);
        given = paise(given + perLine[i]);
      }
    });
  }

  // What would be left to pay, GST included, line by line as priceOrder does it.
  const payable = paise(plans.reduce((s, p, i) => s + withGst(paise(p.price - perLine[i]), p.gstPercent).total, 0));
  if (payable < MIN_PAYABLE) {
    refuse(`This code would bring the total below ${rupees(MIN_PAYABLE)}, so it cannot be used on this order.`, 'COUPON_TOO_LARGE');
  }
  return { code: coupon.code, perLine, eligible };
}
