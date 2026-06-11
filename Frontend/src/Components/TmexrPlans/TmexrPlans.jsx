import { useState } from "react";
import "./TmexrPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "reply",
    name: "Objection Reply",
    oldPrice: 3999,
    price: 1999,
    services: [
      "Analysis of the examination report",
      "Attorney-drafted reply (Section 9 / 11 grounds)",
      "Case-law citations supporting your mark",
      "Filing of the reply on the IP India portal",
      "Filed within the 30-day deadline",
      "Status tracking after submission",
      "Email delivery of the filed reply",
    ],
  },
  {
    id: "reply-evidence",
    name: "Reply + Evidence of Use",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 7999,
    price: 4499,
    services: [
      "Everything in Objection Reply",
      "Affidavit of use (Form TM-U) drafting",
      "Compilation of use evidence (invoices, ads, packaging)",
      "Distinctiveness / acquired-secondary-meaning argument",
      "Stronger reply for Section 9 descriptiveness objections",
      "Coexistence / consent argument for Section 11",
      "Dedicated IP attorney + WhatsApp support",
    ],
  },
  {
    id: "hearing",
    name: "Reply + Hearing Representation",
    badge: "✦ FULL-SERVICE",
    oldPrice: 14999,
    price: 8999,
    services: [
      "Everything in Reply + Evidence of Use",
      "Show-cause hearing preparation",
      "Representation before the Examiner (virtual hearing)",
      "Written submissions & rebuttal arguments",
      "Follow-up till acceptance / journal publication",
      "Strategy for review if needed",
      "Priority support till the mark is accepted",
    ],
  },
];

const TmexrPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Overcome your trademark objection at pocket-friendly prices
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
                    <div className="opcplan-meta">+ GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-exam-reply" />
      )}
    </>
  );
};

export default TmexrPlans;
