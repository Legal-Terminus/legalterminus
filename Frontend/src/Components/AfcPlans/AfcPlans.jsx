import { useState } from "react";
import "./AfcPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "ELEMENTAL",
    badge: "8-FORM FILING ONLY",
    oldPrice: 10499,
    price: 6999,
    services: [
      "Form AOC-4 (Financial Statements) – within 30 days from AGM",
      "Form MGT-7 / MGT-7A (Annual Return) – within 60 days from AGM",
      "Form ADT-1 (Auditor Appointment) – within 30 days from AGM",
      "Form DPT-3 (Deposits Return) – by 30 June",
      "Company ITR-6 – by 31 October",
      "DSC affixation by Directors + CA",
      "Challan + Acknowledgement to client",
      "Client provides audited financials + secretarial docs",
    ],
  },
  {
    id: "enriched",
    name: "ENRICHED",
    badge: "+ SECRETARIAL DOCS PREP",
    popular: true,
    oldPrice: 22499,
    price: 14999,
    services: [
      "Everything in Elemental",
      "Board Report drafting (Section 134)",
      "Notice for AGM drafting (Section 101)",
      "List of Directors preparation",
      "List of Shareholders / Members register",
      "Auditor appointment documents for AGM",
      "Board Meeting + AGM minutes drafting",
      "Resolutions drafting (Board + Shareholders)",
      "Client provides audited financials",
    ],
  },
  {
    id: "supreme",
    name: "SUPREME",
    badge: "+ BOOKS + AUDIT COORD. (T/o < ₹1 Cr)",
    oldPrice: 39999,
    price: 26999,
    services: [
      "Everything in Enriched",
      "For companies with turnover under ₹1 crore",
      "(Tax-audit cases > ₹1Cr – custom quote)",
      "Year-round bookkeeping (Tally / Zoho Books)",
      "Profit & Loss Account preparation",
      "Balance Sheet (Schedule III) preparation",
      "Notes to Accounts + IT computation",
      "Statutory audit coordination (Section 139 – mandatory)",
      "Audit by LT's panel CA or your existing auditor",
      "Audit fee paid directly by company to CA",
    ],
  },
];

const AfcPlans = () => {
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
              Keep your company compliant at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards afc-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="annual-filing-company" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="annual-filing-company"
      />
    </>
  );
};

export default AfcPlans;
