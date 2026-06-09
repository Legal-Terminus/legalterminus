import { useState } from "react";
import "./ProfTaxPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    oldPrice: 1999,
    price: 999,
    services: [
      "Applicability check (state + business type)",
      "Employer Certificate of Registration (EC)",
      "State portal registration assistance",
      "Government fee payment coordination",
      "Registration certificate delivery",
      "First return filing guidance",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 3999,
    price: 1999,
    services: [
      "Everything in Basic",
      "Employee Certificate of Enrollment (RC) — up to 10 employees",
      "Monthly challan preparation (3 months)",
      "Salary slab mapping as per state schedule",
      "PTRC + PTEC registration (Maharashtra)",
    ],
  },
  {
    id: "comprehensive",
    name: "Comprehensive",
    badge: "✦ FULL-SERVICE",
    oldPrice: 7999,
    price: 4999,
    services: [
      "Everything in Standard",
      "RC for unlimited employees",
      "Annual PT return filing (all employees)",
      "Multi-state PT registration (up to 3 states)",
      "Salary slab revision advisory",
      "PT amendment / surrender support",
      "Dedicated compliance calendar",
      "Priority CA / CS support for 6 months",
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
              Get Professional Tax Registration at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="professional-tax" />
      )}
    </>
  );
};

export default ProfTaxPlans;
