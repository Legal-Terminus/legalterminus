import React from "react";
import "./LLPPlanandPrice.css";

const plans = [
  {
    name: "Elemental",
    oldPrice: "₹5,999",
    price: "₹3,999",
    meta: "Excluding gov fee",
    popular: false,
    features: [
      "Search Report of Name Availability",
      "1 RUN Name Approval Certificate",
      "DPIN for 2 Designated Partners",
      "Certificate of Incorporation",
      "E-PAN",
      "E-TAN",
      "LLP Agreement Drafting",
      "Documents for Bank Account Opening",
      "EPF Registration",
      "ESI Registration",
    ],
  },
  {
    name: "Enriched",
    oldPrice: "₹9,999",
    price: "₹7,999",
    meta: "Excluding gov fee",
    popular: true,
    features: [
      "Everything in Elemental Plan",
      "LLP Agreement Execution & Filing",
      "Udyam / MSME Registration",
      "GST Registration",
      "Commencement of Business Certificate",
      "Share Certificate",
    ],
  },
  {
    name: "Supreme",
    oldPrice: "₹29,999",
    price: "₹24,999",
    meta: "Excluding gov fee",
    popular: false,
    features: [
      "Everything in Enriched Plan",
      "Income Tax Filing of LLP",
      "Preparation of Annual Return",
      "Preparation of Partners Report",
      "Filing of LLP Form 8 (Statement of Accounts)",
      "Filing of LLP Form 11 (Annual Return)",
      "Preparation of Auditor Appointment Paperwork",
      "Minutes of Partners Meeting for 1st FY",
      "Maintenance of Statutory E-Registers",
      "DIR KYC (2 Designated Partners)",
      "Income Tax Filing of 2 Designated Partners",
      "Audit fees excluded — payable directly to Auditor",
    ],
  },
];

const LLPPlanandPrice = () => {
  return (
    <section className="llpplan-section">
      <div className="llpplan-container">

        <header className="llpplan-header">
          <h2 className="llpplan-title">Choose Your Plan</h2>
          <p className="llpplan-subtitle">
            Register your LLP with pocket-friendly prices
          </p>
        </header>

        <div className="llpplan-cards">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`llpplan-card ${plan.popular ? "llpplan-card--popular" : ""}`}
            >
              {plan.popular && (
                <div className="llpplan-badge">MOST POPULAR</div>
              )}

              <div className="llpplan-card-top">
                <div className="llpplan-name">{plan.name}</div>
                <div className="llpplan-old-price">{plan.oldPrice}</div>
                <div className="llpplan-price">{plan.price}</div>
                <div className="llpplan-meta">{plan.meta}</div>
              </div>

              <ul className="llpplan-list">
                {plan.features.map((f, i) => (
                  <li key={i} className="llpplan-list-item">{f}</li>
                ))}
              </ul>

              <div className="llpplan-footer">
                <button className={`llpplan-btn ${plan.popular ? "llpplan-btn--popular" : ""}`}>
                  Get Started
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LLPPlanandPrice;
