import React, { useState } from "react";
import "../OPCPlans/OPCPlans.css";
import "./StartupOdishaPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 3999,
    price: 2499,
    services: [
      "Eligibility check (Odisha-based, entity type, age / 5-yr cap, turnover / Rs.25 cr cap)",
      "Innovation pitch drafting + senior expert review",
      "Documents preparation, curation + upload (if any)",
      "Application filing for recognition",
      "Startup Cell query response handling",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 7999,
    price: 5999,
    services: [
      "Everything in Elemental",
      "Central DPIIT Startup India recognition (startupindia.gov.in)",
      "DPIIT eligibility analysis + pitch alignment",
      "Application filing on Startup India portal",
      "DPIIT query response handling (until recognition issued)",
      "Class 3 Organizational DSC procurement",
      "DSC pairing with both portals (state + central)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL BUNDLE",
    oldPrice: 10999,
    price: 7999,
    services: [
      "Everything in Enriched",
      "Trademark application - in 1 class",
      "Trademark search across IP India + WIPO databases",
      "Class selection + goods/services description drafting",
      "TM document preparation + application filing",
      "Application acknowledgement + TM number delivery",
    ],
  },
];

const StartupOdishaPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Get your Startup Odisha recognition with pocket-friendly plans
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
                    <div className="opcplan-old-price">Rs.{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">Rs.{plan.price.toLocaleString("en-IN")}</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="startup-odisha" />
      )}
    </>
  );
};

export default StartupOdishaPricing;
