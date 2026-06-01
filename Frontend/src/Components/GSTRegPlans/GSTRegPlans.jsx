import { useState } from "react";
import "./GSTRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 2999,
    price: 1999,
    services: [
      "GST Registration filing",
      "HSN / SAC code mapping",
      "ARN tracking + GSTIN delivery",
      "GST certificate (PDF)",
      "Email support during filing",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 3999,
    price: 2999,
    services: [
      "Everything in Elemental",
      "MSME / Udyam Registration",
      "GST invoice template + walkthrough",
      "Bank account validation pre-check",
      "30-day post-registration support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 9999,
    price: 7999,
    services: [
      "Everything in Enriched",
      "GSTR-1 + GSTR-3B filing (6 months)",
      "e-invoicing readiness check",
      "Composition scheme advisory",
      "Dedicated CA support",
    ],
  },
];

const GSTRegPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your GST with pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    {plan.badge && (
                      <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="opcplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="gst-registration" />
      )}
    </>
  );
};

export default GSTRegPlans;
