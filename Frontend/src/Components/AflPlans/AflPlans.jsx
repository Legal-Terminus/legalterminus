import { useState } from "react";
import "./AflPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "ELEMENTAL",
    badge: "3-FORM FILING ONLY",
    oldPrice: 7499,
    price: 4999,
    services: [
      "FORM LLP-11 (Annual Return) — by 30 May",
      "FORM LLP-8 (Statement of Account) — by 30 Oct",
      "LLP ITR-5 — by 31 Jul / 31 Oct (audit)",
      "DSC affixation by Designated Partners",
      "Govt fee payment (₹50-200 per form slab)",
      "Challan + Acknowledgement to client",
      "Late-Fee Zero promise (subject to Day-30 data)",
      "NO bookkeeping / NO financial statements drafting",
      "Client provides ready financial statements",
    ],
  },
  {
    id: "enriched",
    name: "ENRICHED",
    badge: "NON-AUDITED LLPs",
    popular: true,
    oldPrice: 22499,
    price: 14999,
    services: [
      "Everything in Elemental",
      "For NON-AUDITED LLPs only",
      "(Turnover up to ₹40L AND Contribution up to ₹25L)",
      "YEAR-ROUND BOOKKEEPING (Tally / Zoho Books)",
      "Transaction recording + bank reconciliation",
      "PROFIT & LOSS ACCOUNT preparation",
      "BALANCE SHEET preparation",
      "Income Tax COMPUTATION",
      "Statement of Account & Solvency drafting",
      "All 3 form filings (LLP-11 + LLP-8 + ITR-5)",
    ],
  },
  {
    id: "supreme",
    name: "SUPREME",
    badge: "AUDITED LLPs (T/o < ₹1 Cr)",
    oldPrice: 37499,
    price: 24999,
    services: [
      "Everything in Enriched",
      "For AUDITED LLPs (LLP Act statutory audit)",
      "Audit triggered: T/o > ₹40L OR Contribution > ₹25L",
      "Eligibility: TURNOVER UNDER ₹1 CRORE",
      "(Tax audit cases > ₹1Cr — custom quote)",
      "Statutory audit coordination (LT panel CA or your CA)",
      "Form 8 Statement of Solvency CA certification",
      "Audit fee paid DIRECTLY by client to CA",
      "DSC procurement for UP TO 2 Designated Partners",
      "Senior CA-led coordination",
    ],
  },
];

const AflPlans = () => {
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
              Keep your LLP compliant at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards afl-cards-center">
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
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
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
                {false && (
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="annual-filing-llp" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="annual-filing-llp"
      />
    </>
  );
};

export default AflPlans;
