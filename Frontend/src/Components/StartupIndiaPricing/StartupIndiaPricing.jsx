import React, { useState } from "react";
import "../OPCPlans/OPCPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 4999,
    price: 2999,
    services: [
      "Eligibility check (entity type, age, turnover, innovation)",
      "Innovation pitch / business write-up checking",
      "DPIIT application filing",
      "Document curation + upload (incorporation, business plan, IP)",
      "DPIIT recognition certificate delivery (3-5 days)",
      "Innovation-tag mapping (IT / DeepTech / Social etc.)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 8999,
    price: 5999,
    services: [
      "Everything in Elemental",
      "Preparation of Authorization letter for organizational DSC",
      "Processing of Organizational DSC",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL SERVICE",
    oldPrice: 10999,
    price: 7499,
    services: [
      "Everything in Enriched",
      "Trademark Search Report",
      "Form TM-A Filing (1 Class)",
      "Government Filing Fee (Individuals/MSME/Startups: ₹4,500 | Companies: ₹9,000)",
      "TM Application Challan and acknowledgement provided",
    ],
  },
];

const StartupIndiaPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Get your Startup India recognition with pocket-friendly plans
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="startup-india" />
      )}
    </>
  );
};

export default StartupIndiaPricing;
