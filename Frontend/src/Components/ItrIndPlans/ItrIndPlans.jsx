import { useState } from "react";
import "./ItrIndPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "salaried",
    name: "Salaried (ITR-1 Sahaj)",
    oldPrice: 999,
    price: 499,
    services: [
      "ITR-1 filing for salary & one house property",
      "Income up to ₹50 lakh from salary, pension & interest",
      "Form 16 & 26AS / AIS reconciliation",
      "Old vs new tax regime comparison",
      "Chapter VI-A deduction optimisation (80C, 80D, etc.)",
      "E-filing with e-verification support",
      "Refund tracking & ITR-V delivery",
    ],
  },
  {
    id: "capgains",
    name: "Capital Gains (ITR-2)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 2499,
    price: 1299,
    services: [
      "Everything in Salaried plan",
      "ITR-2 with capital gains (shares, MF, property)",
      "Multiple house properties & let-out income",
      "Dividend, interest & other-source income",
      "Capital-gains computation with indexation",
      "Carry-forward & set-off of capital losses",
      "Dedicated expert review + WhatsApp support",
    ],
  },
  {
    id: "complex",
    name: "Business / NRI / Foreign Income",
    badge: "✦ FULL-SERVICE",
    oldPrice: 4999,
    price: 2499,
    services: [
      "Everything in Capital Gains plan",
      "ITR-3 / ITR-4 for freelance / professional income",
      "Presumptive income (44ADA) for professionals",
      "NRI returns & DTAA relief (Section 90 / 91)",
      "Foreign assets & income (Schedule FA) reporting",
      "F&O, crypto / VDA & intraday income handling",
      "Priority support for notices & scrutiny response",
    ],
  },
];

const ItrIndPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              File your personal income tax return at pocket-friendly prices
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
                    <div className="opcplan-meta">+ GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="itr-individual" />
      )}
    </>
  );
};

export default ItrIndPlans;
