import { useState } from "react";
import "./ItrBizPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    badge: "ELEMENTAL",
    name: "ITR Filing Only",
    oldPrice: 3749,
    price: 2499,
    services: [
      "PROPRIETORSHIP FIRM OR PARTNERSHIP FIRM",
      "BUSINESS INCOME",
      "TURNOVER UP TO Rs.50 LAKH",
      "ITR-3 / ITR-4 (proprietor) OR ITR-5 / ITR-4 (firm)",
      "IT portal account verification",
      "ITR filling + submission + e-Verification",
      "Tax payment coordination (if applicable)",
      "Challan + Acknowledgement (ITR-V) delivery",
      "Client provides ready Balance Sheet + P&L",
    ],
  },
  {
    id: "enriched",
    badge: "ENRICHED",
    name: "+ Balance Sheet Preparation",
    popular: true,
    oldPrice: 7499,
    price: 4999,
    services: [
      "Everything in Elemental",
      "PROPRIETORSHIP FIRM OR PARTNERSHIP FIRM",
      "BUSINESS INCOME, TURNOVER UP TO Rs.50 LAKH",
      "BALANCE SHEET PREPARATION (by LT)",
      "Profit & Loss Account preparation",
      "Income Tax Computation (detailed)",
      "Depreciation schedule + Section 32 working",
      "Partner remuneration computation (Sec 40(b)) - if PF",
      "Partner interest computation (12% cap) - if PF",
      "Old vs New regime (Proprietor) / Flat 30% (Firm)",
    ],
  },
  {
    id: "supreme",
    badge: "SUPREME",
    name: "+ Accounting in Tally",
    oldPrice: 22499,
    price: 14999,
    services: [
      "Everything in Enriched",
      "PROPRIETORSHIP FIRM OR PARTNERSHIP FIRM",
      "BUSINESS INCOME, TURNOVER UP TO Rs.50 LAKH",
      "YEAR-ROUND ACCOUNTING IN TALLY ERP / Prime",
      "Monthly transaction recording + bank reconciliation",
      "Section 44AA books of account compliance",
      "Partner ledgers + capital account reconciliation (PF)",
      "Section 194T TDS on partner payments (FY 25-26 NEW)",
      "GST reconciliation (if registered)",
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
