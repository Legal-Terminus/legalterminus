import { useState } from "react";
import "./EsiRetPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "starter",
    name: "Starter (up to 10 employees)",
    oldPrice: 1999,
    price: 999,
    period: "/ month",
    services: [
      "Monthly ESI contribution return filing",
      "Employee (0.75%) & employer (3.25%) computation",
      "Challan generation & payment guidance",
      "Up to 10 covered employees per month",
      "IP (Insured Person) registration for new joiners",
      "Due-date reminder & filing confirmation",
      "Email support for ESI queries",
    ],
  },
  {
    id: "growth",
    name: "Growth (up to 50 employees)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 3999,
    price: 2199,
    period: "/ month",
    services: [
      "Everything in Starter plan",
      "Up to 50 covered employees per month",
      "e-Pehchaan card generation & dependant details",
      "New joiner & exit (Date of Leaving) updates",
      "Wage-ceiling (₹21,000) eligibility tracking",
      "Contribution-period continuation handling",
      "Dedicated ESI manager + WhatsApp support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise + Returns",
    badge: "✦ FULL-SERVICE",
    oldPrice: 8999,
    price: 4999,
    period: "/ month",
    services: [
      "Everything in Growth plan",
      "Unlimited employees (custom-priced above 100)",
      "Half-yearly contribution return reconciliation",
      "EPF + ESI combined compliance option",
      "Accident reporting (Form 12) & benefit assistance",
      "Inspection & notice (45A / 85) response support",
      "Priority support for ESIC grievances",
    ],
  },
];

const EsiRetPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Keep your ESI compliance on track at pocket-friendly prices
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
                    <div className="opcplan-meta">+ ESI contributions &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="esi-return" />
      )}
    </>
  );
};

export default EsiRetPlans;
