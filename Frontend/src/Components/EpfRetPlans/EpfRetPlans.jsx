import { useState } from "react";
import "./EpfRetPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "starter",
    name: "Starter (up to 10 employees)",
    oldPrice: 1999,
    price: 999,
    period: "/ month",
    services: [
      "Monthly ECR preparation & generation",
      "PF, EPS & EDLI contribution computation",
      "Challan generation & payment guidance",
      "Up to 10 employees per month",
      "UAN generation for new joiners",
      "Due-date reminder & filing confirmation",
      "Email support for PF queries",
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
      "Up to 50 employees per month",
      "UAN KYC seeding (Aadhaar, PAN, bank)",
      "New joiner & exit (Date of Exit) updates",
      "KYC approval & member profile management",
      "Arrear & wage-revision handling",
      "Dedicated PF manager + WhatsApp support",
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
      "Annual PF return & reconciliation support",
      "EPF + ESI combined compliance option",
      "PF withdrawal & transfer claim assistance",
      "Inspection & notice (7A) response support",
      "Priority support for EPFO grievances",
    ],
  },
];

const EpfRetPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Keep your EPF compliance on track at pocket-friendly prices
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
                    <div className="opcplan-meta">+ PF contributions &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="epf-return" />
      )}
    </>
  );
};

export default EpfRetPlans;
