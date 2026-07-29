import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./ESICRegPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "esic-elemental",
    name: "Elemental",
    oldPrice: "₹3,999",
    price: 2999,
    services: [
      "Form 1 (Employer Registration) filing",
      "ESIC Registration via ESIC unified portal",
      "Employer Code (17-digit ESIC ID) allotment",
      "Insured Person (IP) Number generation for up to 10 employees",
      "Basic family declaration capture per employee",
    ],
  },
  {
    id: "esic-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹6,999",
    price: 5499,
    services: [
      "Everything in Elemental",
      "IP generation for up to 10–30 employees",
      "Detailed family declaration (spouse + parents + children)",
      "Nominee declaration for dependants' benefit",
      "First month's ESIC contribution filing assistance (by 15th of next month)",
      "Dispensary mapping for employees + family members",
      "30-day post-registration support",
    ],
  },
  {
    id: "esic-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹10,999",
    price: 8999,
    services: [
      "Everything in Enriched",
      "IP generation for up to 30–50 employees",
      "First 3 months ESIC contribution filing assistance",
      "e-Pehchan Card coordination for employee + family members",
      "ESIC half-yearly return (RC) preparation guidance",
      "90-day priority payroll-CA helpline",
    ],
  },
];

const ESICRegPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

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
                  {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                      place (not deleted) so it can be re-enabled later. */}
                  {false && (
                  <div className="plan-footer">
                    <button className="plan-button" onClick={() => setActivePlan(plan)}>
                      Buy Now
                    </button>
                  </div>
                  )}
                </article>
              );
            })}
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
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="esic-registration"
        />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="esic-registration"
      />
    </>
  );
};

export default ESICRegPricing;
