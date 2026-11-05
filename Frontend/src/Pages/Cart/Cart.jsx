import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
 */
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
      planName: live?.name || l.planName,
      price,
      plans: product?.plans ?? [],
      unavailable: !!catalog && !live,
      ...withGst(price),
    };
  });
  const sum = (k) => Math.round(view.reduce((s, l) => s + l[k], 0) * 100) / 100;
  const blocked = view.some((l) => l.unavailable);

  if (!PAYMENTS_ENABLED) {
    return (
      <div className="cart-page">
        <div className="cart-card">
          <h1 className="cart-title">Your cart</h1>
          <p className="cart-sub">Online payment is not available yet. Please book a free consultation and our team will help you.</p>
          <Link to="/contact/us" className="cart-btn-primary">Contact us</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-card">
        <h1 className="cart-title">Your cart</h1>

        {view.length === 0 ? (
          <>
            <p className="cart-sub">Your cart is empty. Choose a plan on any service page and press “Add to Cart”.</p>
            <Link to="/" className="cart-btn-primary">Browse services</Link>
          </>
        ) : (
          <>
            <p className="cart-sub">
              {view.length} service{view.length === 1 ? "" : "s"} · pay for all of them in one payment.
              One plan per service; up to {MAX_CART_ITEMS} services.
            </p>

            <ul className="cart-lines">
              {view.map((l) => (
                <li key={l.productKey} className="cart-line">
                  <div className="cart-line-main">
                    <div className="cart-line-name">{l.label}</div>
                    {l.plans.length > 1 ? (
                      <label className="cart-line-plan">
                        <span className="cart-sr">Plan for {l.label}</span>
                        <select
                          value={l.unavailable ? "" : l.planId}
                          onChange={(e) => {
                            const next = l.plans.find((p) => p.id === e.target.value);
                            if (next) changePlan(l.productKey, next);
                          }}
                        >
                          {l.unavailable && <option value="">Choose a plan</option>}
                          {l.plans.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} — {inr(p.price)}</option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <div className="cart-line-plan-text">{l.planName} plan</div>
                    )}
                    {l.unavailable && (
                      <p className="cart-line-warn" role="alert">This plan is no longer offered. Choose another plan or remove it.</p>
                    )}
                  </div>
                  <div className="cart-line-side">
                    <div className="cart-line-price">{inr(l.price)}</div>
                    <div className="cart-line-gst">+ {inr(l.gst)} GST</div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeFromCart(l.productKey)}
                      aria-label={`Remove ${l.label} from your cart`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div className="cart-summary-row"><span>Price</span><span>{inr(sum("price"))}</span></div>
              <div className="cart-summary-row"><span>GST ({view[0].gstPercent}%)</span><span>{inr(sum("gst"))}</span></div>
              <div className="cart-summary-total"><span>Total</span><span>{inr(sum("total"))}</span></div>
              <p className="cart-summary-note">+ Govt. fees where applicable. The final amount is confirmed at payment.</p>
            </div>

            <button
              type="button"
              className="cart-btn-primary"
              disabled={blocked}
              onClick={() => setCheckingOut(true)}
            >
              Checkout — pay {inr(sum("total"))}
            </button>
            <Link to="/" className="cart-btn-outline">Add more services</Link>
          </>
        )}
      </div>

      {checkingOut && view.length > 0 && (
        <ProCheckoutModal cartLines={view} onClose={() => setCheckingOut(false)} source="cart" />
      )}
    </div>
  );
};

export default Cart;
