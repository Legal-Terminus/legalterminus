import React, { useState } from "react";
import "./Section8PlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: "Rs.13,499",
    price: 7999,
    services: [
      "Name Search & Availability Report",
      "Section 8 license + SPICe+ Part A name reservation",
      "DIN application for 2 directors (via SPICe+)",
      "MOA & AOA drafting (charitable-object template)",
      "INC-13 / Affidavit / INC-14 / INC-15 declarations drafting",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "PAN + TAN + Certificate of Incorporation delivery",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: "Rs.18,999",
    price: 12999,
    services: [
      "Everything in Elemental",
      "First Board Meeting kit (notice, agenda, minutes)",
      "1st Auditor Appointment Documents",
      "Bank account opening assistance",
      "Share Certificate",
      "Commencement of Business (INC-20A)",
      "Udyam / MSME Registration",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: "Rs.24,999",
    price: 19999,
    services: [
      "Everything in Enriched",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Auditor Appointment Filing — ADT-1 (in 1st AGM)",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE",
    oldPrice: "Rs.34,999",
    price: 29999,
    services: [
      "Everything in Supreme",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Statutory E-Register Maintenance",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "ITR Filing for 2 Directors",
      "Section 12A / 35AC / 80G strategy advisory call",
      "Form 10A application (12A registration — tax exemption)",
      "Form 10AB application (80G registration — donor benefits)",
    ],
  },
];

const Section8PlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="s8-pricing-section">
        <div className="s8-pricing-container">

          <header className="s8-pricing-header">
            <h2 className="s8-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="s8-pricing-subtitle">
              Register your Section 8 Company with pocket-friendly prices
            </p>
          </header>

          <div className="s8-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`s8-plan-card${plan.popular ? " s8-plan-card--popular" : ""}`}
              >
                {plan.badge && (
                  <span className="s8-plan-badge">{plan.badge}</span>
                )}
                <div>
                  <div className="s8-plan-header">
                    <div className="s8-plan-name">{plan.name}</div>
                    <div className="s8-plan-old-price">{plan.oldPrice}</div>
                    <div className="s8-plan-price">
                      Rs.{plan.price.toLocaleString("en-IN")}
                    </div>
                    <div className="s8-plan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="s8-plan-body">
                    <ul className="s8-plan-list">
                      {plan.services.map((svc, i) => (
                        <li key={i} className="s8-plan-list-item">{svc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="s8-plan-footer">
                  <button
                    className={`s8-plan-button${plan.popular ? " s8-plan-button--popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="section8-company" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="section8-company"
      />
    </>
  );
};

export default Section8PlanAndPricing;
