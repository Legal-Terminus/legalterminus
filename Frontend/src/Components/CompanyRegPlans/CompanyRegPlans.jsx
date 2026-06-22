import { useState } from "react";
import "./CompanyRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    displayName: "Elemental Plan",
    badge: "STARTER",
    oldPrice: 5999,
    price: 3999,
    services: [
      "Search Report of Name Availability",
      "1 RUN Name Approval Certificate",
      "Director Identification Number for 2 Individuals",
      "Certificate of Incorporation",
      "E-PAN",
      "E-TAN",
      "E-MOA",
      "E-AOA",
      "Documents for Bank Account Opening",
      "Documents for 1st Auditor Appointment",
      "EPF Registrations",
      "ESI Registrations",
    ],
  },
  {
    id: "elemental-plus",
    name: "Elemental Plus",
    displayName: "Elemental Plan Plus",
    badge: "★ MOST POPULAR",
    popular: true,
    inherits: "Everything in the Elemental Plan",
    oldPrice: 7999,
    price: 5999,
    services: [
      "Everything in Elemental Plan",
      "Share Certificate",
      "Commencement of Business",
      "MSME Registration",
    ],
    extras: [
      "Share Certificate",
      "Commencement of Business",
      "MSME Registration",
    ],
  },
  {
    id: "enriched-plus",
    name: "Enriched Plus",
    displayName: "Enriched Plan Plus",
    badge: "✦ FULL FIRST-YEAR COMPLIANCE",
    inherits: "Everything in the Elemental Plan Plus",
    oldPrice: 29999,
    price: 24999,
    services: [
      "Everything in Elemental Plan Plus",
      "Income tax filing of Company",
      "Preparation of Directors Report",
      "Preparation of Annual Return",
      "Preparation of Auditor Appointment Paperwork",
      "Preparation of List of Share Holders",
      "Preparation of Notice of AGM",
      "Preparation of Notice of BM",
      "Preparation of Extracts of AGM",
      "Filing of AOC – 4 (Financial Statements)",
      "Filing of MGT – 7 (Annual Return)",
      "Filing of ADT – 1 (Auditor Appointment)",
      "Minutes of Board Meeting for 1st FY",
      "Minutes of General Meeting for 1st FY",
      "Maintenance of Statutory E-Registers",
      "Filing of DPT – 3 Annual (If Applicable)",
      "Filing of MSME – 1 (If Applicable) for 1st FY",
      "DIR KYC (2 Directors)",
      "Income Tax Filing of 2 Directors",
    ],
    extras: [
      "Income tax filing of Company",
      "Preparation of Directors Report",
      "Preparation of Annual Return",
      "Preparation of Auditor Appointment Paperwork",
      "Preparation of List of Share Holders",
      "Preparation of Notice of AGM",
      "Preparation of Notice of BM",
      "Preparation of Extracts of AGM",
      "Filing of AOC – 4 (Financial Statements)",
      "Filing of MGT – 7 (Annual Return)",
      "Filing of ADT – 1 (Auditor Appointment)",
      "Minutes of Board Meeting for 1st FY",
      "Minutes of General Meeting for 1st FY",
      "Maintenance of Statutory E-Registers",
      "Filing of DPT – 3 Annual (If Applicable)",
      "Filing of MSME – 1 (If Applicable) for 1st FY",
      "DIR KYC (2 Directors)",
      "Income Tax Filing of 2 Directors",
    ],
    note: "Audit fees are excluded and to be paid directly to the Auditor’s account.",
  },
];

const Check = () => (
  <svg className="crp-check" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CompanyRegPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="crp-section">
        <div className="crp-container">
          <header className="crp-header">
            <span className="crp-eyebrow">Transparent Pricing</span>
            <h2 className="crp-title">Choose Your Company Registration Plan</h2>
            <p className="crp-subtitle">
              Pick the plan that fits your stage — from incorporation essentials to complete
              first-year compliance. All prices exclude government fees &amp; GST.
            </p>
          </header>

          <div className="crp-grid">
            {PLANS.map((plan) => {
              const list = plan.extras || plan.services;
              return (
                <article
                  key={plan.id}
                  className={`crp-card${plan.popular ? " crp-card--popular" : ""}`}
                >
                  {plan.badge && (
                    <div className={`crp-badge${plan.popular ? " crp-badge--popular" : ""}`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="crp-card-head">
                    <h3 className="crp-plan-name">{plan.displayName}</h3>
                    <div className="crp-price-row">
                      <span className="crp-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</span>
                      <span className="crp-price">₹{plan.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="crp-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <button className="crp-button" onClick={() => setActivePlan(plan)}>
                    Buy Now
                  </button>

                  <div className="crp-body">
                    {plan.inherits && (
                      <div className="crp-inherits">{plan.inherits}, plus:</div>
                    )}
                    <ul className="crp-list">
                      {list.map((s, i) => (
                        <li key={i} className="crp-list-item">
                          <Check />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.note && <p className="crp-note">* {plan.note}</p>}
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
          source="company-registration-odisha"
        />
      )}
    </>
  );
};

export default CompanyRegPlans;
