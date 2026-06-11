import { useState } from "react";
import "./ItrBizPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "presumptive",
    name: "Presumptive (ITR-4)",
    oldPrice: 2999,
    price: 1499,
    services: [
      "ITR-4 filing under presumptive scheme (44AD / 44ADA / 44AE)",
      "For proprietors & professionals declaring presumptive income",
      "Business / professional income computation",
      "Form 26AS & AIS reconciliation",
      "Eligible deduction (Chapter VI-A) optimisation",
      "E-filing with e-verification support",
      "Acknowledgement (ITR-V) delivery",
    ],
  },
  {
    id: "regular",
    name: "Business with Books (ITR-3)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 5999,
    price: 2999,
    services: [
      "Everything in Presumptive plan",
      "ITR-3 with full Profit & Loss and Balance Sheet",
      "Books of accounts & financial statement review",
      "Depreciation, partner remuneration & interest computation",
      "Capital gains, F&O / speculative income handling",
      "GST turnover reconciliation with ITR",
      "Dedicated CA review + WhatsApp support",
    ],
  },
  {
    id: "firm",
    name: "Firm / LLP / Company",
    badge: "✦ FULL-SERVICE",
    oldPrice: 12999,
    price: 6999,
    services: [
      "Everything in Business with Books",
      "ITR-5 (Partnership / LLP) or ITR-6 (Company) filing",
      "Computation of firm income & partner distribution",
      "Tax audit (Sec 44AB) coordination where applicable",
      "MAT / AMT & carry-forward of losses review",
      "Director / partner ITR alignment",
      "Priority support for scrutiny & notice response",
    ],
  },
];

const ItrBizPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              File your business income tax return at pocket-friendly prices
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
                    <div className="opcplan-meta">+ GST &amp; tax audit fee (if any) extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="itr-business" />
      )}
    </>
  );
};

export default ItrBizPlans;
