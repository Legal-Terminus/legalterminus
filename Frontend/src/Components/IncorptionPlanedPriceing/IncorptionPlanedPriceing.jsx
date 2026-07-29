import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./IncorporationPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const TRACK_A_PLANS = [
  {
    id: "wos-a-elemental",
    name: "Elemental",
    oldPrice: "₹10,999",
    price: 7999,
    services: [
      "Name Search & Availability Report",
      "SPICe+ Part A name reservation (2 attempts)",
      "DIN application for 2 directors (via SPICe+)",
      "MOA & AOA drafting (Indian-parent WOS template)",
      "Parent Board Resolution + Authorised Signatory drafting",
      "Nominee shareholder declaration (Section 187)",
      "Other documents preparation for Incorporation of WOS",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "PAN + TAN + Certificate of Incorporation delivery",
      "ESIC + EPFO registration",
      "Govt fees, DSC, stamp duty at actuals",
    ],
  },
  {
    id: "wos-a-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹17,999",
    price: 14999,
    services: [
      "Everything in Elemental",
      "1st Board Resolution documentation",
      "Bank account opening assistance",
      "1st Auditor Appointment Documents",
      "Share Certificate",
      "Commencement of Business (INC-20A)",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
    ],
  },
  {
    id: "wos-a-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹29,999",
    price: 26999,
    services: [
      "Everything in Enriched",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Statutory E-Register Maintenance",
      "Preparation of Auditor Appointment Paperwork",
      "Preparation of List of Share Holders",
      "Preparation of Extracts of AGM",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7A",
      "Auditor Appointment Filing — ADT-1",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "ITR Filing for 2 Directors",
    ],
  },
];

const TRACK_B_PLANS = [
  {
    id: "wos-b-elemental",
    name: "Elemental",
    oldPrice: "₹26,999",
    price: 19999,
    services: [
      "Sectoral FDI eligibility check (auto vs approval route)",
      "Name Search & Availability Report",
      "SPICe+ Part A name reservation (2 attempts)",
      "DIN application for 2 directors (via SPICe+)",
      "MOA & AOA drafting (foreign-parent WOS template)",
      "Apostille / notarisation coordination (parent docs)",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "PAN + TAN + Certificate of Incorporation delivery",
      "ESIC + EPFO registration",
      "Govt fees, DSC, apostille, AD-Bank at actuals",
    ],
  },
  {
    id: "wos-b-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹47,999",
    price: 34999,
    services: [
      "Everything in Elemental",
      "1st Board Resolution documentation",
      "1st Auditor Appointment Documents",
      "AD-Bank coordination (FIRC + KYC pull-out)",
      "Form FC-GPR filing within 30 days of allotment",
      "UDYAM / MSME Registration",
      "GST Registration Assistance",
      "INC-20A (commencement) filing",
      "30-day post-incorporation FEMA support",
    ],
  },
  {
    id: "wos-b-supreme",
    name: "Supreme",
    badge: "fullservice",
    oldPrice: "₹74,999",
    price: 54999,
    services: [
      "Everything in Enriched",
      "Transfer pricing structure advisory (parent-WOS)",
      "First-year FLA Return filing (by July 15)",
      "ESOP / sweat equity scheme review (cross-border)",
      "Statutory Registers Pack + share certificates printed",
      "Trademark search + Class application (1 class)",
      "IEC registration",
      "Section 115BAA / 115BAB tax-regime advisory call",
      "90-day priority CA / CS / FEMA-counsel helpline",
    ],
  },
];

const PlanCard = ({ plan, onBuy }) => {
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
    <article className={cardClass}>
      {isPopular && (
        <div className="plan-popular-badge">★ MOST POPULAR</div>
      )}
      {isFullService && (
        <div className="plan-fullservice-badge">✦ FULL-SERVICE</div>
      )}
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
            {plan.services.map((service, i) => (
              <li key={i} className="plan-list-item">
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
          place (not deleted) so it can be re-enabled later. */}
      {false && (
      <div className="plan-footer">
        <button className="plan-button" onClick={() => onBuy(plan)}>
          Buy Now
        </button>
      </div>
      )}
    </article>
  );
};

const IncorporationPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      {/* ====== TRACK A : INDIAN-PARENT WOS ====== */}
      <section className="pvtltd-pricing-section wos-pricing-section">
        <div className="pricing-container">
          <header className="pricing-header">
            <div className="wos-track-label wos-track-label--a">
              TRACK A &bull; INDIAN-PARENT WOS
            </div>
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Standard WOS incorporation with complete ROC compliance support
            </p>
          </header>
          <div className="pricing-cards wos-pricing-cards">
            {TRACK_A_PLANS.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} onBuy={setActivePlan} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== TRACK B : FOREIGN-PARENT WOS ====== */}
      <section className="pvtltd-pricing-section wos-pricing-section wos-pricing-section--b">
        <div className="pricing-container">
          <header className="pricing-header">
            <div className="wos-track-label wos-track-label--b">
              TRACK B &bull; FOREIGN-PARENT WOS
            </div>
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Cross-border WOS with complete FEMA, FC-GPR &amp; RBI compliance
              coverage
            </p>
          </header>
          <div className="pricing-cards wos-pricing-cards">
            {TRACK_B_PLANS.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} onBuy={setActivePlan} />
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
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="incorporation"
        />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="incorporation"
      />
    </>
  );
};

export default IncorporationPlanAndPricing;
