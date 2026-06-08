import React, { useState } from "react";
import "./ISOplan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "iso-elemental",
    name: "Elemental",
    oldPrice: "₹17,999",
    price: 12999,
    services: [
      "ISO Standard Selection & Advisory",
      "Gap Analysis & Current State Assessment",
      "SOP & Policy Documentation Support",
      "Certification Body (CB) Selection Assistance",
      "Stage 1 & Stage 2 Audit Preparation Support",
      "CB Application Filing Support",
      "Certificate Follow-up & Delivery",
    ],
  },
  {
    id: "iso-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹32,999",
    price: 22999,
    services: [
      "Everything in Elemental",
      "Internal Audit Checklist & Preparation",
      "Corrective Action Plan (CAP) Drafting",
      "Stage 2 Audit Readiness Review",
      "Annual Surveillance Audit Advisory (Y1 & Y2)",
      "Dedicated Expert Project Manager",
      "Priority Email & Call Support",
    ],
  },
  {
    id: "iso-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹49,999",
    price: 34999,
    services: [
      "Everything in Enriched",
      "Multi-Standard ISO Support",
      "On-Site Documentation Review (1 Visit)",
      "Management Review Meeting Support",
      "MSME Subsidy Application Assistance",
      "Custom ISO Manual & Quality Policy Drafting",
      "1-Year Post-Certification Compliance Support",
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
                      <div className="plan-meta">Excluding CB &amp; govt fees</div>
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
