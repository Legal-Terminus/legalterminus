import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./ESICRegPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "esic-elemental",
    name: "Elemental",
    oldPrice: "₹2,999",
    price: 1999,
    services: [
      "ESIC employer registration on the ESIC portal",
      "Employer Registration Form-1 filing",
      "17-digit ESIC Employer Code allotment",
      "DSC coordination for e-sign / authorised signatory",
    ],
  },
  {
    id: "esic-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹4,999",
    price: 3499,
    services: [
      "Everything in Elemental",
      "Employee IP number generation (up to 10 employees)",
      "First monthly ESI contribution challan walkthrough",
      "ESI Pehchan card facilitation for covered employees",
    ],
  },
  {
    id: "esic-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹7,999",
    price: 5999,
    services: [
      "Everything in Enriched",
      "Employee IP number generation (up to 30 employees)",
      "3-month ESI return filing support",
      "Free ESIC updates / changes for 1 year",
      "90-day priority compliance-expert helpline",
    ],
  },
];

const ESICRegPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section esic-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your establishment with ESIC and protect your workforce
            </p>
          </header>

          <div className="pricing-cards">
            {PLANS.map((plan) => {
              const isPopular = plan.badge === "popular";
              const isFullService = plan.badge === "fullservice";
              const cardClass = [
                "plan-card",
                isPopular ? "plan-card--popular" : "",
                isFullService ? "plan-card--fullservice" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article key={plan.id} className={cardClass}>
                  {isPopular && <div className="plan-popular-badge">★ MOST POPULAR</div>}
                  {isFullService && <div className="plan-fullservice-badge">✦ FULL-SERVICE</div>}
                  <div>
                    <div className="plan-header">
                      <div className="plan-name">{plan.name}</div>
                      <div className="plan-old-price">{plan.oldPrice}</div>
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
                    <button className="plan-button" onClick={() => setActivePlan(plan)}>
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
          source="esic-registration"
        />
      )}
    </>
  );
};

export default ESICRegPricing;
