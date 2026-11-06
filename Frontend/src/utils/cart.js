import { useEffect, useState } from "react";

/**
 * The website cart (#244): services chosen to be paid for together, in ONE
 * checkout.
 *
 * Kept in this browser's localStorage, so it survives a reload and moving
 * between service pages. Every read and write is wrapped: private browsing,
 * a full quota or a corrupted value must never break a page — the cart is then
 * simply empty.
 *
 * WHAT IT HOLDS. A line is a SERVICE (`productKey`, the same value a pricing
 * card passes to the checkout as `source`) and the PLAN chosen for it. The
 * price stored here is only for display; the server prices every line again
 * from its catalogue when the order is made, and that is what is charged.
 *
 * DECISIONS
 * - One plan per service. A service's plans are tiers ("Everything in
 *   Elemental, plus…"), so adding another plan of a service already in the
 *   cart SWAPS the plan instead of adding a second line. The server refuses a
 *   repeated service too.
 * - No quantity. The catalogue has none, and each line opens one matter.
 * - At most MAX_CART_ITEMS lines — the server's limit for one order.
 */

export const MAX_CART_ITEMS = 10;
const KEY = "lt-cart-v1";
const EVENT = "lt-cart-change";

/** A price for display: the number, or the digits of "Rs.6,999". */
const priceOf = (p) => {
  if (Number.isFinite(p)) return p;
  const n = Number(String(p ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** One stored line in a known shape, or null. */
function clean(raw) {
  if (!raw || typeof raw.productKey !== "string" || !raw.productKey || typeof raw.planId !== "string" || !raw.planId) return null;
  return {
    productKey: raw.productKey.slice(0, 100),
    planId: raw.planId.slice(0, 100),
    label: typeof raw.label === "string" ? raw.label.slice(0, 200) : raw.productKey,
    planName: typeof raw.planName === "string" ? raw.planName.slice(0, 200) : raw.planId,
    price: priceOf(raw.price),
    // #221: the answer to the product's question ("prior-user"), where it asks one.
    // `price` stays the PLAN's price; `optionSurcharge` is only shown until the
    // catalogue arrives — the cart page and the server work the surcharge out themselves.
    ...(typeof raw.optionId === "string" && raw.optionId ? {
      optionId: raw.optionId.slice(0, 60),
      optionName: typeof raw.optionName === "string" ? raw.optionName.slice(0, 100) : raw.optionId,
      optionSurcharge: priceOf(raw.optionSurcharge),
    } : {}),
  };
}

export function getCart() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    const seen = new Set();
    return parsed.map(clean).filter((l) => l && !seen.has(l.productKey) && seen.add(l.productKey)).slice(0, MAX_CART_ITEMS);
  } catch {
    return [];
  }
}

function save(lines) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: the cart lasts as long as the page */
  }
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch { /* no window (prerender) */ }
}

/**
 * Add a plan. Returns what happened, for the message the page shows:
 *   "added" | "swapped" (another plan of this service was in the cart) |
 *   "already" | "full".
 */
export function addToCart(line) {
  const next = clean(line);
  if (!next) return "already";
  const lines = getCart();
  const at = lines.findIndex((l) => l.productKey === next.productKey);
  if (at >= 0) {
    // #221: the same plan with a different answer ("Prior User") is a swap too.
    if (lines[at].planId === next.planId && lines[at].optionId === next.optionId) return "already";
    lines[at] = next;
    save(lines);
    return "swapped";
  }
  if (lines.length >= MAX_CART_ITEMS) return "full";
  save([...lines, next]);
  return "added";
}

export function removeFromCart(productKey) {
  save(getCart().filter((l) => l.productKey !== productKey));
}

/** Change the plan of a service already in the cart. */
export function changePlan(productKey, plan) {
  save(getCart().map((l) => (l.productKey === productKey
    ? clean({ ...l, planId: plan.id, planName: plan.name, price: plan.price }) ?? l
    : l)));
}

/** #221: change the answer to a product's question for a service in the cart. */
export function changeOption(productKey, option) {
  save(getCart().map((l) => (l.productKey === productKey
    ? clean({ ...l, optionId: option.id, optionName: option.name, optionSurcharge: option.surcharge }) ?? l
    : l)));
}

export function clearCart() {
  save([]);
}

/** The cart, kept current across components and other tabs. */
export function useCart() {
  const [lines, setLines] = useState(() => (typeof window === "undefined" ? [] : getCart()));
  useEffect(() => {
    const refresh = () => setLines(getCart());
    const onStorage = (e) => { if (e.key === KEY) refresh(); };
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", onStorage);
    refresh();
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return lines;
}
