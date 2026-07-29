import React, { useState } from "react";
import "./SccietyPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: "Rs.8,499",
    price: "Rs.6,999",
    services: [
      "Discovery call + Society object lock",
      "MoA (Memorandum of Association) drafting",
      "Rules & Regulations drafting (governance)",
      "7-member onboarding + affidavit preparation",
      "Registrar of Societies filing (state-specific)",
      "Registration Certificate handover",
      "Society PAN application coordination",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: "Rs.12,499",
    price: "Rs.7,999",
    services: [
      "Everything in Elemental",
      "Udyam (MSME) Registration on udyamregistration.gov.in",
      "NIC code mapping (up to 3 codes)",
      "Investment + turnover declaration",
      "Udyam Certificate delivery (PDF)",
      "30-day post-registration support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: "Rs.18,999",
    price: "Rs.9,999",
    services: [
      "Everything in Enriched",
      "GST Registration in 1 state (Regular scheme)",
      "HSN / SAC code mapping (up to 10 codes)",
      "Aadhaar e-KYC + bank validation",
      "GST certificate (REG-06) delivered as PDF",
      "GST invoice template + first-month walkthrough",
      "Society-specific GST treatment advisory (exempt vs taxable supplies)",
      "60-day post-registration support",
    ],
  },
];

const SocietyPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="Society-pricing-section">
        <div className="Society-pricing-container">

          <header className="Society-pricing-header">
            <h2 className="Society-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="Society-pricing-subtitle">
              Register your society with pocket-friendly plans
            </p>
          </header>

          <div className="Society-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`Society-plan-card${plan.popular ? " Society-plan-card--popular" : ""}`}
              >
                <div>
                  <div className="Society-plan-header">
                    {plan.badge && (
                      <div className={`Society-plan-badge${plan.popular ? " Society-plan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="Society-plan-name">{plan.name}</div>
                    <div className="Society-plan-old-price">{plan.oldPrice}</div>
                    <div className="Society-plan-price">{plan.price}</div>
                    <div className="Society-plan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="Society-plan-body">
                    <ul className="Society-plan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="Society-plan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="Society-plan-footer">
                  <button
                    className={`Society-plan-button${plan.popular ? " Society-plan-button--popular" : ""}`}
                    onClick={() => setActivePlan({ ...plan, price: parseInt(plan.price.replace(/[^0-9]/g, ""), 10) })}
                  >
                    Buy Now
                  </button>
                </div>
                )}
              </article>
            ))}
          </div>

          {/* #133: one shared CTA below the plans — opens the consultation popup. */}
          <div className="consult-cta-row">
            <button
              type="button"
              className="consult-cta-button"
              onClick={() => setShowConsult(true)}
            >
              📅 Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="society-registration" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="society-registration"
      />
    </>
  );
};

export default SocietyPlanAndPricing;
