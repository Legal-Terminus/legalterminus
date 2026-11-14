import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaTrashAlt, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import ProCheckoutModal from "../../Components/ProCheckoutModal/ProCheckoutModal";
import {
  useCart, removeFromCart, changePlan, changeOption, setQuantity, maxQuantityFor, unitsIn,
  MAX_CART_ITEMS, MAX_CART_UNITS, MAX_LINE_QUANTITY,
} from "../../utils/cart.js";
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
 * Headings below the page title are h3 on purpose: the site theme centres
 * every h2 as a section headline (theme/typography.css), and these are a
 * list's and a panel's headings.
 *
 * QUANTITY (#244, 2026-11-12): each line has − and + to buy several units of
 * the service ("3 Trademark Registrations"); every unit is a service of its
 * own. A unit's price and GST are worked out once and multiplied — the same
 * sum the server does unit by unit — so the line, the summary and the amount
 * charged agree to the paisa. − stops at 1; Remove takes the line out.
 *
 * Layout: the services on the left and a sticky order summary on the right
 * from 992px; one column below that, the summary after the list.
 */

const r2 = (n) => Math.round(n * 100) / 100;

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
  // #221: a product that asks a question (the trademark "Proposed to be Used" /
  // "Prior User") shows the answer, lets it be changed, and adds its surcharge
  // to the line. A line with no answer — or one no longer offered — must be
  // answered before paying; nothing is chosen for the customer.
  const view = lines.map((l) => {
    const product = catalog?.[l.productKey];
    const live = product?.plans?.find((p) => p.id === l.planId);
    const choice = product?.choice ?? null;
    const option = choice?.options?.find((o) => o.id === l.optionId) ?? null;
    const surcharge = option ? option.surcharge : (catalog ? 0 : (l.optionSurcharge ?? 0));
    const price = (live?.price ?? l.price) + surcharge;
    const unit = withGst(price);
    const quantity = l.quantity ?? 1;
    const oldPrice = live?.oldPrice + surcharge > price ? live.oldPrice + surcharge : null;
    return {
      ...l,
      label: product?.label || l.label,
      planName: planLabel(live?.name || l.planName),
      optionName: option?.name ?? l.optionName,
      price,
      surcharge,
      // Only a higher figure is a cut price — the same rule as the pricing cards.
      oldPrice,
      plans: product?.plans ?? [],
      choice,
      unavailable: !!catalog && !live,
      needsOption: !!choice && !option,
      // An answer to a question the product no longer asks is not sent.
      ...(catalog && !choice ? { optionId: undefined, optionName: undefined } : {}),
      // One unit (`price` is a unit's), then the line: the unit's figures × quantity.
      gstPercent: unit.gstPercent,
      unitGst: unit.gst,
      unitTotal: unit.total,
      quantity,
      maxQuantity: maxQuantityFor(lines, l.productKey),
      linePrice: r2(price * quantity),
      lineGst: r2(unit.gst * quantity),
      lineTotal: r2(unit.total * quantity),
      lineOldPrice: oldPrice ? r2(oldPrice * quantity) : null,
    };
  });
  const sum = (k) => r2(view.reduce((s, l) => s + l[k], 0));
  const saved = Math.round(view.reduce((s, l) => s + (l.lineOldPrice ? l.lineOldPrice - l.linePrice : 0), 0));
  const blocked = view.some((l) => l.unavailable || l.needsOption);
  // Every unit is a service bought: "3 services" for 3 Trademark Registrations.
  const units = unitsIn(view);
  const count = `${units} service${units === 1 ? "" : "s"}`;

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
                  <h3 className="cart-line-name">{l.label}</h3>
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
                  {/* #221: the answer to the product's question, kept from the plan card and changeable here. */}
                  {l.choice && (
                    <label className="cart-plan cart-option">
                      <span className="cart-plan-label">{l.choice.label}</span>
                      <select
                        value={l.needsOption ? "" : l.optionId}
                        aria-label={`${l.choice.label} for ${l.label}`}
                        onChange={(e) => {
                          const next = l.choice.options.find((o) => o.id === e.target.value);
                          if (next) changeOption(l.productKey, next);
                        }}
                      >
                        {l.needsOption && <option value="">Choose one</option>}
                        {l.choice.options.map((o) => (
                          <option key={o.id} value={o.id}>{o.name}{o.surcharge > 0 ? ` (+ ${inr(o.surcharge)})` : ""}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {l.needsOption && (
                    <p className="cart-line-warn" role="alert">
                      Choose {l.choice.options.map((o) => o.name).join(" or ")} to see the price of this service.
                    </p>
                  )}
                  {l.unavailable && (
                    <p className="cart-line-warn" role="alert">This plan is no longer offered. Choose another plan or remove it.</p>
                  )}
                </div>

                <div className="cart-line-price">
                  {l.lineOldPrice && <s className="cart-line-was"><span className="cart-sr">Was </span>{inr(l.lineOldPrice)}</s>}
                  <span className="cart-line-now">{inr(l.linePrice)}</span>
                  {l.quantity > 1 && <span className="cart-line-gst cart-line-each">{inr(l.price)} each</span>}
                  {l.surcharge > 0 && <span className="cart-line-gst">Includes {inr(l.surcharge)}{l.quantity > 1 ? " each" : ""} for {l.optionName}</span>}
                  <span className="cart-line-gst">+ {inr(l.lineGst)} GST</span>
                </div>

                {/* #244: how many of this service — − and +, Flipkart-style. */}
                <div className="cart-qty" role="group" aria-label={`Quantity of ${l.label}`}>
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={() => setQuantity(l.productKey, l.quantity - 1)}
                    disabled={l.quantity <= 1}
                    aria-label={`One fewer ${l.label}`}
                  ><FaMinus aria-hidden="true" /></button>
                  <output className="cart-qty-value" aria-live="polite">{l.quantity}</output>
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={() => setQuantity(l.productKey, l.quantity + 1)}
                    disabled={l.quantity >= l.maxQuantity}
                    aria-label={`One more ${l.label}`}
                  ><FaPlus aria-hidden="true" /></button>
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
            <p className="cart-note">One payment covers up to {MAX_CART_ITEMS} different services.</p>
          )}
          {(units >= MAX_CART_UNITS || view.some((l) => l.quantity >= MAX_LINE_QUANTITY)) && (
            <p className="cart-note">
              One payment covers up to {MAX_LINE_QUANTITY} of a service and {MAX_CART_UNITS} services in all. For more, please pay separately or contact us.
            </p>
          )}
        </section>

        <aside className="cart-summary" aria-label="Order summary">
          <h3 className="cart-summary-title">Order summary</h3>
          <dl className="cart-summary-rows">
            <div><dt>Price ({count})</dt><dd>{inr(sum("linePrice"))}</dd></div>
            <div><dt>GST ({view[0].gstPercent}%)</dt><dd>{inr(sum("lineGst"))}</dd></div>
            <div className="cart-summary-total"><dt>Total</dt><dd>{inr(sum("lineTotal"))}</dd></div>
          </dl>
          {saved > 0 && <p className="cart-saved">You save {inr(saved)} on list prices</p>}

          <button
            type="button"
            className="cart-btn-primary"
            disabled={blocked}
            onClick={() => setCheckingOut(true)}
          >
            <FaLock aria-hidden="true" /> Checkout · pay {inr(sum("lineTotal"))}
          </button>
          {blocked && <p className="cart-note">Choose a plan{view.some((l) => l.needsOption) ? " and the options asked for" : ""} for every service to continue.</p>}
          {/* #256: codes are checked and applied by the server, at checkout. */}
          <p className="cart-summary-note cart-coupon-note">Have a coupon code? You can apply it at checkout.</p>
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
