import { useState } from "react";
import "./TmhearPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "submissions",
    name: "Hearing Submissions",
    oldPrice: 5999,
    price: 2999,
    services: [
      "Review of objection / opposition on record",
      "Attorney-drafted written submissions",
      "Case-law citations supporting your mark",
      "Filing of submissions before the hearing",
      "Hearing-readiness checklist & guidance",
      "Status tracking after the hearing",
      "Email delivery of the submissions",
    ],
  },
  {
    id: "representation",
    name: "Hearing Representation",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 9999,
    price: 5499,
    services: [
      "Everything in Hearing Submissions",
      "Attorney representation at the virtual hearing",
      "Oral arguments before the Hearing Officer",
      "Real-time rebuttal of objections raised",
      "Evidence presentation & clarification",
      "Adjournment request handling (if needed)",
      "Dedicated IP attorney + WhatsApp support",
    ],
  },
  {
    id: "endtoend",
    name: "End-to-End Hearing + Follow-Up",
    badge: "✦ FULL-SERVICE",
    oldPrice: 17999,
    price: 9999,
    services: [
      "Everything in Hearing Representation",
      "Full evidence/affidavit compilation & filing",
      "Multiple / adjourned hearing appearances",
      "Post-hearing order analysis & advice",
      "Next-step strategy (acceptance / review / appeal)",
      "Coordination till journal publication",
      "Priority support till the Registry's decision",
    ],
  },
];

const TmhearPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Win your trademark hearing at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-hearing" />
      )}
    </>
  );
};

export default TmhearPlans;
