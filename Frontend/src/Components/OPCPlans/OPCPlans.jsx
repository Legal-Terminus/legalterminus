import { useState } from "react";
import "./OPCPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";
import { usePlans, PAYMENTS_ENABLED } from "../../utils/pricing";

const DEFAULT_PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 6499,
    price: 4999,
    services: [
      "Name Availability Search Report",
      "SPICe+ Part A name reservation (2 attempts)",
      "Nominee onboarding + INC-3 consent drafting",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "Certificate of Incorporation (COI) delivery",
      "e-PAN & e-TAN",
      "e-MOA & e-AOA",
      "EPF & ESI Registration",
      "1st Auditor Appointment Docs",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 11999,
    price: 8999,
    services: [
      "Everything in Elemental",
      "Bank Account Opening Documents",
      "Share Certificate",
      "Commencement of Business (INC-20A)",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 26999,
    price: 14999,
    services: [
      "Everything in Enriched",
      "Minutes of the 1st Board Meeting",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7A",
      "Auditor Appointment Filing — ADT-1",
    ],
  },
  // #209, the firm on 2 Nov: a fourth plan, as on Private Limited.
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE",
    oldPrice: 32999,
    price: 24999,
    services: [
      "Everything in Enriched",
      "Statutory Registers Pack (Members, Directors, Charges)",
      "Directors' Report Preparation",
      "Preparation of Documents regarding AGM/BM Notice, Minutes & Extracts",
      "DPT-3 (if applicable) for 1st FY",
      "MSME-1 (if applicable) for 1st FY",
      "Income Tax Filing of Director",
      "Full first-year ROC compliance + e-filing setup",
    ],
  },
];

const OPCPlan = () => {
  // E24-S01: prices come from the server catalogue; DEFAULT_* is the fallback.
  const PLANS = usePlans("opc-registration", DEFAULT_PLANS);
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your OPC with pocket-friendly prices
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
                    {plan.oldPrice ? <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div> : null}
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
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

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {PAYMENTS_ENABLED && (
                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="opc-registration" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="opc-registration"
      />
    </>
  );
};

export default OPCPlan;
