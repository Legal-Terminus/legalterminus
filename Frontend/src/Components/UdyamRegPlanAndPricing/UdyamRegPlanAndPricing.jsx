import React, { useState } from "react";
import "./UdyamRegPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 1499,
    price: 999,
    services: [
      "Udyam Registration on udyamregistration.gov.in",
      "Aadhaar OTP + PAN verification coordination",
      "NIC code mapping",
      "Udyam Number + Certificate delivery (PDF)",
      "Email support during filing window",
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
      "GST Registration filing for 1 GSTIN (Regular scheme)",
      "HSN / SAC code mapping",
      "ARN tracking + GSTIN delivery",
      "GST invoice template + first-month walkthrough",
      "Bank account validation pre-check",
      "30-day post-registration support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 9999,
    price: 5999,
    services: [
      "Everything in Enriched",
      "Trademark search across MCA + IPR + WIPO databases",
      "Trademark application drafting & filing (1 class)",
      "UDYAM/MSME 50% govt-fee subsidy on Trademark applied",
      "Class selection + goods/services description drafting",
      "Shop & Establishment registration for 1 state (state-specific)",
    ],
  },
];

const UdyamRegPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="udyam-pricing-section">
        <div className="udyam-pricing-container">
          <header className="udyam-pricing-header">
            <h2 className="udyam-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="udyam-pricing-subtitle">
              Get your Udyam / MSME Registration done with pocket-friendly prices
            </p>
          </header>

          <div className="udyam-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`udyam-plan-card${plan.popular ? " udyam-plan-card--popular" : ""}`}
              >
                <div>
                  <div className="udyam-plan-header">
                    {plan.badge && (
                      <div className={`udyam-plan-badge${plan.popular ? " udyam-plan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="udyam-plan-name">{plan.name}</div>
                    <div className="udyam-plan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="udyam-plan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="udyam-plan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="udyam-plan-body">
                    <ul className="udyam-plan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="udyam-plan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="udyam-plan-footer">
                  <button
                    className={`udyam-plan-button${plan.popular ? " udyam-plan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="udyam-registration" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="udyam-registration"
      />
    </>
  );
};

export default UdyamRegPlanAndPricing;
