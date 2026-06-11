import { useState } from "react";
import "./TmrnwPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "renewal",
    name: "Standard Renewal",
    oldPrice: 3999,
    price: 1999,
    services: [
      "Form TM-R renewal filing (1 class)",
      "Renewal of registration for another 10 years",
      "Govt fee coordination (₹9,000 per class)",
      "Deadline verification against the register",
      "Power of Attorney drafting (TM-48)",
      "Filing acknowledgement & renewal status",
      "Next-renewal reminder set for you",
    ],
  },
  {
    id: "grace",
    name: "Grace-Period Renewal",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 6999,
    price: 3999,
    services: [
      "Everything in Standard Renewal",
      "Renewal within 6-month grace window after expiry",
      "Surcharge filing & fee handling (Form TM-R)",
      "Status check to confirm mark is still on register",
      "Risk assessment before deadline lapses fully",
      "Priority filing to avoid removal",
      "Dedicated IP expert + WhatsApp support",
    ],
  },
  {
    id: "restoration",
    name: "Restoration + Renewal",
    badge: "✦ FULL-SERVICE",
    oldPrice: 14999,
    price: 8999,
    services: [
      "Everything in Grace-Period Renewal",
      "Restoration of a removed mark (within 1 year)",
      "Form TM-R with restoration + renewal fee",
      "Drafting of restoration justification",
      "Register-status reconciliation & follow-up",
      "Multi-class / portfolio renewal support",
      "Priority support till mark is restored",
    ],
  },
];

const TmrnwPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Renew and protect your trademark at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra / class</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-renewal" />
      )}
    </>
  );
};

export default TmrnwPlans;
