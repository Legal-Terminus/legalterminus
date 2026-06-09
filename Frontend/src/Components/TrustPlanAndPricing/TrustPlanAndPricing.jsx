import React, { useState } from "react";
import "./TrustPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: "Rs.11,999",
    price: "Rs.9,999",
    services: [
      "Discovery call + Trust object lock",
      "Custom Trust Deed drafting (objects, trustees, succession)",
      "Stamp duty calculation (state-specific)",
      "Notarisation coordination",
      "Sub-Registrar / Charity Commissioner registration filing",
      "Registration Certificate handover",
      "Trust PAN application coordination",
      "Free Trust updates / changes for 1 year",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: "Rs.18,999",
    price: "Rs.14,999",
    services: [
      "Everything in Elemental",
      "Form 10A (12A registration) - income tax exemption",
      "Form 10AB (80G registration) - donor tax deduction",
      "Activity / mission write-up for IT department",
      "Bank account opening assistance (trust account)",
      "First Board / Trustees meeting kit (notice, agenda, minutes)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: "Rs.23,999",
    price: "Rs.16,999",
    services: [
      "Everything in Enriched",
      "Udyam (MSME) Registration on udyamregistration.gov.in",
      "NIC code mapping (up to 3 codes)",
      "Investment + turnover declaration",
      "Udyam Certificate delivery (PDF)",
      "GST Registration in 1 state (Regular scheme)",
      "HSN / SAC code mapping (up to 10 codes)",
      "Aadhaar e-KYC + bank validation",
      "GST certificate (REG-06) delivered as PDF",
    ],
  },
];

const TrustPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="trust-pricing-section">
        <div className="trust-pricing-container">

          <header className="trust-pricing-header">
            <h2 className="trust-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="trust-pricing-subtitle">
              Register your trust with pocket-friendly plans
            </p>
          </header>

          <div className="trust-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`trust-plan-card${plan.popular ? " trust-plan-card--popular" : ""}`}
              >
                <div>
                  <div className="trust-plan-header">
                    {plan.badge && (
                      <div className={`trust-plan-badge${plan.popular ? " trust-plan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="trust-plan-name">{plan.name}</div>
                    <div className="trust-plan-old-price">{plan.oldPrice}</div>
                    <div className="trust-plan-price">{plan.price}</div>
                    <div className="trust-plan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="trust-plan-body">
                    <ul className="trust-plan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="trust-plan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="trust-plan-footer">
                  <button
                    className={`trust-plan-button${plan.popular ? " trust-plan-button--popular" : ""}`}
                    onClick={() => setActivePlan({ ...plan, price: parseInt(plan.price.replace(/[^0-9]/g, ""), 10) })}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trust-registration" />
      )}
    </>
  );
};

export default TrustPlanAndPricing;
