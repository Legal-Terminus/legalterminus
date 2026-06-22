import { useState } from "react";
import "../PubpvtPlans/PubpvtPlans.css";
import "./CompanyRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    displayName: "Elemental Plan",
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
    oldPrice: 7999,
    price: 5999,
    services: [
      "Everything in Elemental Plan",
      "Share Certificate",
      "Commencement of Business",
      "MSME Registration",
    ],
  },
  {
    id: "enriched-plus",
    name: "Enriched Plus",
    displayName: "Enriched Plan Plus",
    badge: "✦ FULL COMPLIANCE",
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
    note: "Audit fees are excluded and to be paid directly to the Auditor’s account.",
  },
];

const CompanyRegPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your company in Odisha with pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards pubpvt-cards-center">
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
                    <div className="opcplan-name">{plan.displayName}</div>
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

                    {plan.note && <p className="opcplan-note">* {plan.note}</p>}
                  </div>
                </div>

                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
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
