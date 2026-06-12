import { useState } from "react";
import "./DpvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "strikeoff",
    name: "Strike-Off (STK-2)",
    oldPrice: 17999,
    price: 9999,
    services: [
      "Eligibility check for Section 248 strike-off",
      "Board resolution & special resolution drafting",
      "STK-3 indemnity bond & STK-4 affidavit drafting",
      "Statement of accounts (STK-8) coordination with CA",
      "Form STK-2 preparation & ROC filing",
      "Govt fee coordination (₹10,000) at actuals",
      "Filing acknowledgement & status tracking",
    ],
  },
  {
    id: "cleanup",
    name: "Closure + Compliance Clean-Up",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 34999,
    price: 19999,
    services: [
      "Everything in Strike-Off (STK-2)",
      "Pending annual filings (AOC-4 / MGT-7) brought up to date",
      "Final income tax return (ITR-6) of the company",
      "Bank account closure assistance",
      "DIR-3 KYC of directors (if pending)",
      "Liability extinguishment & NIL-asset confirmation",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "fullexit",
    name: "Full Exit Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 59999,
    price: 34999,
    services: [
      "Everything in Closure + Compliance Clean-Up",
      "Closure-route advisory (strike-off vs voluntary liquidation)",
      "Resolution of pending charges / ROC defaults",
      "NOC coordination with regulatory authorities (if any)",
      "Director & shareholder documentation handling",
      "Response to ROC queries till strike-off is notified",
      "Priority support till the name is struck off (STK-7)",
    ],
  },
];

const DpvtPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Close your private limited company at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="dissolve-private" />
      )}
    </>
  );
};

export default DpvtPlans;
