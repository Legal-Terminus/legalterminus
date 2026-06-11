import { useState } from "react";
import "./AflPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "ROC Annual Filing",
    oldPrice: 5999,
    price: 2999,
    services: [
      "Form 11 (Annual Return) filing",
      "Form 8 (Statement of Account & Solvency) filing",
      "Designated partner & contribution details mapping",
      "Drafting of solvency declaration",
      "MCA government fee coordination at actuals",
      "Filing acknowledgements & compliance record",
      "Due-date reminders for Form 11 & Form 8",
    ],
  },
  {
    id: "standard",
    name: "Annual Compliance Pack",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 12999,
    price: 7999,
    services: [
      "Everything in ROC Annual Filing",
      "DIR-3 KYC for all designated partners",
      "Preparation of LLP accounts & statements",
      "Income Tax Return (ITR-5) of the LLP",
      "Statement of Account & Solvency finalisation",
      "Maintenance of LLP records & registers",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "premium",
    name: "Full Compliance + Audit",
    badge: "✦ FULL-SERVICE",
    oldPrice: 22999,
    price: 14999,
    services: [
      "Everything in Annual Compliance Pack",
      "Bookkeeping & finalisation of accounts",
      "Tax audit coordination (turnover-based)",
      "Event-based filings (Form 3 / Form 4 changes)",
      "Partner remuneration & profit-share computation",
      "Annual compliance calendar & review",
      "Priority support for notices & condonation",
    ],
  },
];

const AflPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

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
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra / year</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="annual-filing-llp" />
      )}
    </>
  );
};

export default AflPlans;
