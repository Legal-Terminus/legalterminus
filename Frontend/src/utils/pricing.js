import { useEffect, useMemo, useState } from "react";

/**
 * Live prices for the pricing cards (E24-S01).
 *
 * Every pricing component still carries its plans in a `DEFAULT_PLANS` array —
 * the features, the badges, and a price. That price is now only the FALLBACK:
 * the real one comes from the server's catalogue, which is also what a payment
 * is charged from. So the page and the charge cannot disagree, and the firm can
 * change a price without a new build.
 *
 * The defaults render immediately (and are what the prerendered HTML contains);
 * the live prices replace them as soon as they arrive. If the request fails the
 * page simply keeps the defaults — a pricing page must never be blank.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Whether "Buy Now" is shown (E24-S02). OFF unless the build sets
 * VITE_PAYMENTS_ENABLED=true — which only the QA build does, until the payment
 * flow has been approved there and the gateway's live keys are in place.
 * Trunk delivery means this code is on `main` before it is ready; the switch is
 * what keeps it out of sight on the live site.
 */
export const PAYMENTS_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === "true";

let cached = null;      // { [productKey]: { label, plans: [{ id, name, price, oldPrice }] } }
let pending = null;     // one request for the whole site, however many cards ask

export function loadPricing() {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = fetch(`${API_BASE}/api/public/pricing`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`pricing ${res.status}`))))
      .then((body) => {
        cached = body?.products ?? {};
        return cached;
      })
      .catch(() => {
        pending = null; // let a later page try again
        return null;
      });
  }
  return pending;
}

/** A catalogue amount in the shape the component's default used ("Rs.6,999" or 6999). */
function like(defaultValue, amount) {
  return typeof defaultValue === "string" ? `Rs.${amount.toLocaleString("en-IN")}` : amount;
}

/**
 * Put the catalogue's prices onto a component's default plans.
 *
 * - No catalogue, or the product is not in it: the defaults, unchanged.
 * - Price AND cut price both come from the catalogue.
 * - A plan the catalogue does not list is not on sale and is left out — unless
 *   that would leave no plan at all, in which case the defaults stand.
 */
export function withLivePrices(defaults, product) {
  if (!product || !Array.isArray(product.plans)) return defaults;
  const byId = new Map(product.plans.map((p) => [p.id, p]));
  const plans = defaults
    .filter((d) => byId.has(d.id))
    .map((d) => {
      const live = byId.get(d.id);
      // The cut price follows the catalogue too — added where the card's
      // default had none, and removed when the firm clears it. (It used to be
      // applied only where the default already carried one, so a cut price
      // set in the portal never reached most cards.) Only a higher figure is
      // a cut price; anything else is not shown.
      const cut = live.oldPrice > live.price ? live.oldPrice : null;
      return { ...d, price: like(d.price, live.price), oldPrice: cut ? like(d.oldPrice ?? d.price, cut) : null };
    });
  return plans.length ? plans : defaults;
}

/**
 * `const PLANS = usePlans("trademark-application", DEFAULT_PLANS);`
 *
 * `productKey` is the same value the component passes to the checkout as `source`.
 */
export function usePlans(productKey, defaults) {
  const [catalog, setCatalog] = useState(cached);
  useEffect(() => {
    if (cached) return undefined;
    let alive = true;
    loadPricing().then((c) => { if (alive && c) setCatalog(c); });
    return () => { alive = false; };
  }, []);
  return useMemo(() => withLivePrices(defaults, catalog?.[productKey]), [defaults, catalog, productKey]);
}
