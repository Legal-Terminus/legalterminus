import { useState } from "react";
import "./TmoppPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "counter",
    name: "Counter-Statement (Defend)",
    oldPrice: 8999,
    price: 4999,
    services: [
      "Analysis of the Notice of Opposition (TM-O)",
      "Attorney-drafted Counter-Statement (Form TM-O)",
      "Filed within the 2-month deadline",
      "Point-by-point rebuttal of opposition grounds",
      "Defence strategy for Section 9 / 11 claims",
      "Filing on the IP India portal",
      "Status tracking after submission",
    ],
  },
  {
    id: "notice",
    name: "File Opposition (Oppose)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 9999,
    price: 5999,
    services: [
      "Journal review & conflict assessment",
      "Attorney-drafted Notice of Opposition (Form TM-O)",
      "Grounds drafted under Section 9, 11 & prior use",
      "Govt fee coordination (₹2,700 per class)",
      "Filed within the 4-month journal window",
      "Service & follow-up on the applicant",
      "Dedicated IP attorney + WhatsApp support",
    ],
  },
  {
    id: "fullcase",
    name: "Full Opposition + Hearing",
    badge: "✦ FULL-SERVICE",
    oldPrice: 24999,
    price: 14999,
    services: [
      "Everything in File / Defend Opposition",
      "Evidence affidavits (Rule 45 / 46 / 47)",
      "Compilation & filing of supporting evidence",
      "Opposition hearing preparation",
      "Representation before the Registrar (virtual)",
      "Written submissions & rebuttal arguments",
      "Priority support till the Registry's decision",
    ],
  },
];

const TmoppPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Oppose or defend a trademark at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-opposition" />
      )}
    </>
  );
};

export default TmoppPlans;
