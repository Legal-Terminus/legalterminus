import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaTrashAlt, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import ProCheckoutModal from "../../Components/ProCheckoutModal/ProCheckoutModal";
import { useCart, removeFromCart, changePlan, MAX_CART_ITEMS } from "../../utils/cart.js";
import { loadPricing, withGst, inr, PAYMENTS_ENABLED } from "../../utils/pricing.js";
import "./Cart.css";

/**
 * The cart (#244): review the services chosen, change a plan or remove a
 * service, and pay for all of them in ONE checkout.
 *
 * Prices shown are the catalogue's, refreshed when the page opens; what is
 * charged is worked out again by the server from the plans alone. A plan that
 * is no longer on sale has to be changed or removed before paying.
 *
 * Layout: the services on the left and a sticky order summary on the right
 * from 992px; one column below that, the summary after the list.
 */

/** "ENRICHED" → "Enriched": some catalogue plans are named in capitals. */
const planLabel = (name) => (name && name === name.toUpperCase() ? name.charAt(0) + name.slice(1).toLowerCase() : name);

const Cart = () => {
  const lines = useCart();
  const [catalog, setCatalog] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let alive = true;
    loadPricing().then((c) => { if (alive && c) setCatalog(c); });
    return () => { alive = false; };
  }, []);

  // The live price of each line, and whether its plan is still for sale.
  const view = lines.map((l) => {
    const product = catalog?.[l.productKey];
    const live = product?.plans?.find((p) => p.id === l.planId);
    const price = live?.price ?? l.price;
    return {
      ...l,
      label: product?.label || l.label,
      planName: planLabel(live?.name || l.planName),
      price,
      // Only a higher figure is a cut price — the same rule as the pricing cards.
      oldPrice: live?.oldPrice > price ? live.oldPrice : null,
      plans: product?.plans ?? [],
      unavailable: !!catalog && !live,
      ...withGst(price),
    };
  });
  const sum = (k) => Math.round(view.reduce((s, l) => s + l[k], 0) * 100) / 100;
  const saved = Math.round(view.reduce((s, l) => s + (l.oldPrice ? l.oldPrice - l.price : 0), 0));
  const blocked = view.some((l) => l.unavailable);
  const count = `${view.length} service${view.length === 1 ? "" : "s"}`;

  if (!PAYMENTS_ENABLED || view.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="cart-empty-icon" aria-hidden="true"><FaShoppingCart /></span>
          <h1 className="cart-title">{PAYMENTS_ENABLED ? "Your cart is empty" : "Your cart"}</h1>
          <p className="cart-sub">
            {PAYMENTS_ENABLED
              ? "Choose a plan on any service page and press “Add to Cart”. You can pay for several services in one payment."
              : "Online payment is not available yet. Please book a free consultation and our team will help you."}
          </p>
          {PAYMENTS_ENABLED
            ? <Link to="/" className="cart-btn-primary">Browse services</Link>
            : <Link to="/contact/us" className="cart-btn-primary">Contact us</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <header className="cart-head">
          <h1 className="cart-title">Your cart</h1>
          <p className="cart-sub">{count} · one payment for all of them</p>
        </header>

        <section className="cart-items" aria-label="Services in your cart">
          <ul className="cart-lines">
            {view.map((l) => (
              <li key={l.productKey} className={`cart-line${l.unavailable ? " is-unavailable" : ""}`}>
                <div className="cart-line-main">
                  <h2 className="cart-line-name">{l.label}</h2>
                  {l.plans.length > 1 ? (
                    <label className="cart-plan">
                      <span className="cart-plan-label">Plan</span>
                      <select
                        value={l.unavailable ? "" : l.planId}
                        aria-label={`Plan for ${l.label}`}
                        onChange={(e) => {
                          const next = l.plans.find((p) => p.id === e.target.value);
                          if (next) changePlan(l.productKey, next);
                        }}
                      >
                        {l.unavailable && <option value="">Choose a plan</option>}
                        {l.plans.map((p) => (
                          // The name only: the line's price, beside it, follows the plan chosen.
                          <option key={p.id} value={p.id}>{planLabel(p.name)}</option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="cart-plan cart-plan-text"><span className="cart-plan-label">Plan</span>{l.planName}</p>
                  )}
                  {l.unavailable && (
                    <p className="cart-line-warn" role="alert">This plan is no longer offered. Choose another plan or remove it.</p>
                  )}
                </div>

                <div className="cart-line-price">
                  {l.oldPrice && <s className="cart-line-was"><span className="cart-sr">Was </span>{inr(l.oldPrice)}</s>}
                  <span className="cart-line-now">{inr(l.price)}</span>
                  <span className="cart-line-gst">+ {inr(l.gst)} GST</span>
                </div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(l.productKey)}
                  aria-label={`Remove ${l.label} from your cart`}
                >
                  <FaTrashAlt aria-hidden="true" /><span>Remove</span>
                </button>
              </li>
            ))}
          </ul>

          <Link to="/" className="cart-continue">
            <FaArrowLeft aria-hidden="true" /> Add more services
          </Link>
          {view.length >= MAX_CART_ITEMS && (
            <p className="cart-note">One payment covers up to {MAX_CART_ITEMS} services.</p>
          )}
        </section>

        <aside className="cart-summary" aria-label="Order summary">
          <h2 className="cart-summary-title">Order summary</h2>
          <dl className="cart-summary-rows">
            <div><dt>Price ({count})</dt><dd>{inr(sum("price"))}</dd></div>
            <div><dt>GST ({view[0].gstPercent}%)</dt><dd>{inr(sum("gst"))}</dd></div>
            <div className="cart-summary-total"><dt>Total</dt><dd>{inr(sum("total"))}</dd></div>
          </dl>
          {saved > 0 && <p className="cart-saved">You save {inr(saved)} on list prices</p>}

          <button
            type="button"
            className="cart-btn-primary"
            disabled={blocked}
            onClick={() => setCheckingOut(true)}
          >
            <FaLock aria-hidden="true" /> Checkout · pay {inr(sum("total"))}
          </button>
          {blocked && <p className="cart-note">Choose a plan for every service to continue.</p>}
          <p className="cart-summary-note">
            Secure online payment. Government fees, where applicable, are extra; the final amount is confirmed at payment.
          </p>
        </aside>
      </div>

      {checkingOut && (
        <ProCheckoutModal cartLines={view} onClose={() => setCheckingOut(false)} source="cart" />
      )}
    </div>
  );
};

export default Cart;
