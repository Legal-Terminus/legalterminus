import { useState } from "react";
import "./GstFilingPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "Nil / Small Taxpayer",
    oldPrice: 1999,
    price: 999,
    period: "/ month",
    services: [
      "GSTR-1 + GSTR-3B filing (per month)",
      "For Nil returns & low-volume businesses",
      "Up to 25 outward invoices per month",
      "Basic ITC eligibility check",
      "Due-date reminder & filing confirmation",
      "ARN acknowledgement shared after filing",
      "Email support for filing queries",
    ],
  },
  {
    id: "standard",
    name: "Regular Business (QRMP / Monthly)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 3499,
    price: 1799,
    period: "/ month",
    services: [
      "Everything in Nil / Small Taxpayer",
      "GSTR-1 & GSTR-3B (monthly or QRMP quarterly)",
      "Full ITC reconciliation (GSTR-2B vs purchase register)",
      "Up to 200 invoices per period",
      "HSN-wise summary & tax computation",
      "Mismatch & vendor follow-up guidance",
      "Dedicated accountant + WhatsApp support",
    ],
  },
  {
    id: "annual",
    name: "Annual + Reconciliation",
    badge: "✦ FULL-SERVICE",
    oldPrice: 14999,
    price: 7999,
    period: "/ year",
    services: [
      "Everything in Regular Business",
      "Annual return GSTR-9 preparation & filing",
      "GSTR-9C reconciliation (turnover > ₹5 Cr)",
      "Full-year books-to-returns reconciliation",
      "ITC reversal, RCM & ineligible-credit review",
      "Notice & demand response support (DRC-01 etc.)",
      "Priority legal support for GST audit representation",
    ],
  },
];

const GstFilingPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              File your GST returns on time at pocket-friendly prices
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
                    <div className="opcplan-price">
                      ₹{plan.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: "0.5em", fontWeight: 500 }}> {plan.period}</span>
                    </div>
                    <div className="opcplan-meta">+ GST &amp; govt late fees extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="gst-return-filing" />
      )}
    </>
  );
};

export default GstFilingPlans;
