import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./EPFRegPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "epf-elemental",
    name: "Elemental",
    oldPrice: "₹3,999",
    price: 2999,
    services: [
      "EPF Registration via EPFO unified portal",
      "Form 5A filing for establishment registration",
      "Establishment Code (Employer ID) allotment",
      "DSC coordination for authorized signatory/e-sign approvals",
    ],
  },
  {
    id: "epf-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹7,999",
    price: 5999,
    services: [
      "Everything in Elemental",
      "UAN activation for up to 10-15 employees",
      "3 Month ECR (Electronic Challan-cum-Return) walkthrough",
    ],
  },
  {
    id: "epf-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹10,999",
    price: 8999,
    services: [
      "Everything in Enriched",
      "UAN activation for up to 15-30 employees",
      "6 Month ECR (Electronic Challan-cum-Return) walkthrough",
      "Free EPF updates / changes for 3 Months",
      "90-day priority payroll-expert helpline",
    ],
  },
];

const EPFRegPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section epf-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your EPF with expert support at every step
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
          source="epf-registration"
        />
      )}
    </>
  );
};

export default EPFRegPricing;
