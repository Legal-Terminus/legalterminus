import { useState } from "react";
import "./AfcPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "ROC Annual Filing",
    oldPrice: 9999,
    price: 4999,
    services: [
      "AOC-4 (financial statements) filing",
      "MGT-7 / MGT-7A (annual return) filing",
      "ADT-1 (auditor appointment) filing",
      "Director's Report & board resolution drafting",
      "AGM notice & documentation support",
      "MCA government fee coordination at actuals",
      "Filing acknowledgements & compliance record",
    ],
  },
  {
    id: "standard",
    name: "Annual Compliance Pack",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 19999,
    price: 11999,
    services: [
      "Everything in ROC Annual Filing",
      "DIR-3 KYC for all directors",
      "DPT-3 (return of deposits) filing",
      "Preparation of financial statements & schedules",
      "Statutory registers & minutes book maintenance",
      "Income Tax Return (ITR-6) of the company",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "premium",
    name: "Full Secretarial + Audit",
    badge: "✦ FULL-SERVICE",
    oldPrice: 34999,
    price: 21999,
    services: [
      "Everything in Annual Compliance Pack",
      "Statutory audit coordination with CA",
      "Bookkeeping & finalisation of accounts",
      "4 board meetings + AGM full documentation",
      "MSME-1 & other event-based ROC filings",
      "Annual compliance calendar & secretarial review",
      "Priority support for notices & condonation",
    ],
  },
];

const AfcPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="annual-filing-company" />
      )}
    </>
  );
};

export default AfcPlans;
