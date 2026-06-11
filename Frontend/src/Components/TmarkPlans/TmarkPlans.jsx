import { useState } from "react";
import "./TmarkPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "Trademark Search & File",
    oldPrice: 2999,
    price: 1499,
    services: [
      "Comprehensive trademark search (public TM register)",
      "Class selection guidance (1 class)",
      "TM-A application drafting & filing",
      "Govt fee coordination (₹4,500 for individual/startup/MSME)",
      "Right to use the ™ symbol immediately",
      "Application number & filing receipt",
      "Email delivery of acknowledgement",
    ],
  },
  {
    id: "standard",
    name: "File + Examination Support",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 5999,
    price: 3499,
    services: [
      "Everything in Trademark Search & File",
      "Examination report monitoring & analysis",
      "Reply to objection under Section 9 / 11",
      "Drafting & filing of examination response",
      "Hearing preparation guidance (if scheduled)",
      "Status tracking till journal publication",
      "Dedicated IP expert + WhatsApp support",
    ],
  },
  {
    id: "premium",
    name: "End-to-End Registration",
    badge: "✦ FULL-SERVICE",
    oldPrice: 12999,
    price: 7999,
    services: [
      "Everything in File + Examination Support",
      "Multi-class / multiple-mark filing support",
      "Opposition monitoring during 4-month window",
      "Reply to third-party opposition (basic)",
      "Registration certificate follow-up",
      "Brand-protection & ® usage advisory",
      "Priority support till certificate issuance",
    ],
  },
];

const TmarkPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Protect your brand with a trademark at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-application" />
      )}
    </>
  );
};

export default TmarkPlans;
