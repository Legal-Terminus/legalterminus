import { useState } from "react";
import "../OPCPlans/OPCPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 1999,
    price: 999,
    services: [
      "Eligibility & state applicability check",
      "Employer PT Registration (1 state)",
      "Registration Certificate delivery",
      "Challan generation guidance",
      "Employee slab chart (state-specific)",
      "Monthly deduction template (Excel)",
      "Compliance calendar for first year",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 5999,
    price: 2999,
    services: [
      "Everything in Elemental",
      "PT Return Filing — 12 months (monthly/quarterly)",
      "Challan payment coordination",
      "Employee headcount updates — unlimited",
      "Penalty notice response (1 notice)",
      "Annual compliance report",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 12999,
    price: 6999,
    services: [
      "Everything in Enriched",
      "Multi-state PT registration (up to 3 states)",
      "PT Return Filing — 36 months",
      "New employee onboarding PT mapping",
      "Penalty notices — unlimited responses",
      "Self-employed PT registration (1 person)",
      "Director / Partner PT compliance",
      "Annual PT reconciliation statement",
      "Priority support via WhatsApp & email",
    ],
  },
];

const ProfTaxPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Manage Professional Tax compliance with pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="professional-tax-registration" />
      )}
    </>
  );
};

export default ProfTaxPlans;
