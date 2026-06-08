import React, { useState } from "react";
import "./ISOplan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "iso-elemental",
    name: "Elemental",
    oldPrice: "Rs.17,999",
    price: 12999,
    services: [
      "Single standard: ISO 9001 / 14001 / 45001 (your choice)",
      "Gap analysis + scope finalisation",
      "Quality Manual + SOP drafting (process documentation)",
      "Implementation training (1 session, on-site or virtual)",
      "Internal audit + management review facilitation",
      "Certification Body shortlisting + Stage 1 + 2 coordination",
      "Certificate handover + MSME subsidy filing assistance",
      "CB fees + travel at actuals (typically Rs.15K - 30K)",
    ],
  },
  {
    id: "iso-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "Rs.32,999",
    price: 22999,
    services: [
      "Everything in Elemental",
      "TWO standards: ISO 9001 + 14001 OR 9001 + 45001",
      "Integrated Management System (IMS) documentation",
      "Audit cycle synchronisation (one audit, two standards)",
      "Sector-specific SOPs (manufacturing / service / retail)",
      "Internal auditor training (1 staff member certified)",
      "Surveillance Year-1 audit prep included",
      "CB fees + travel at actuals (typically Rs.25K - 50K)",
    ],
  },
  {
    id: "iso-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "Rs.49,999",
    price: 34999,
    services: [
      "Everything in Enriched",
      "THREE standards: ISO 9001 + 14001 + 45001 (full QHSE)",
      "Or sector-specific: 9001 + 22000 (food) / 9001 + 27001 (IT)",
      "Risk & opportunity register (Clause 6.1)",
      "Process flow mapping + control of nonconformity SOPs",
      "Lead Auditor training certification (1 staff)",
      "Surveillance Year-1 + Year-2 audit prep included",
      "CB fees + travel at actuals (typically Rs.45K - 90K)",
    ],
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section iso-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Get ISO Certified with expert support at every step
            </p>
          </header>

          <div className="pricing-cards">

            {PLANS.map((plan) => {
              const isPopular = plan.badge === "popular";
              const isFullService = plan.badge === "fullservice";

              return (
                <article
                  key={plan.id}
                  className={`plan-card${isPopular ? " plan-card--popular" : ""}${isFullService ? " plan-card--fullservice" : ""}`}
                  style={{ position: "relative" }}
                >
                  {isPopular && (
                    <div className="plan-popular-badge">★ MOST POPULAR</div>
                  )}
                  {isFullService && (
                    <div className="plan-fullservice-badge">✦ FULL-SERVICE</div>
                  )}

                  <div>
                    <div className="plan-header">
                      <div className="plan-name">{plan.name}</div>
                      {plan.oldPrice && (
                        <div className="plan-old-price">{plan.oldPrice}</div>
                      )}
                      <div className="plan-price">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </div>
                      <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                    </div>

                    <div className="plan-body">
                      <ul className="plan-list">
                        {plan.services.map((s, i) => (
                          <li key={i} className="plan-list-item">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="plan-footer">
                    <button
                      className="plan-button"
                      onClick={() => setActivePlan(plan)}
                    >
                      Buy Now
                    </button>
                  </div>
                </article>
              );
            })}

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="iso-certification"
        />
      )}
    </>
  );
};

export default PricingSection;
