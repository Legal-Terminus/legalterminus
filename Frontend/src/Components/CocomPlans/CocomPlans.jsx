import { useState } from "react";
import "./CocomPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "objectchange",
    name: "Object Clause Change",
    oldPrice: 9999,
    price: 4999,
    services: [
      "Drafting of the new / amended object clause",
      "Board resolution & EGM notice drafting",
      "Special resolution preparation",
      "Form MGT-14 preparation & ROC filing",
      "Updated Memorandum of Association (MOA)",
      "Govt fee coordination at actuals",
      "Filing acknowledgement & status tracking",
    ],
  },
  {
    id: "expansion",
    name: "Object Change + Compliance",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 17999,
    price: 9999,
    services: [
      "Everything in Object Clause Change",
      "Activity-to-MOA mapping for the new business",
      "Updated AOA cross-check (if needed)",
      "GST amendment for new business activities",
      "Licence / registration impact assessment",
      "Statutory register & minutes updates",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Diversification Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 29999,
    price: 16999,
    services: [
      "Everything in Object Change + Compliance",
      "Advisory on regulated-activity approvals (RBI/SEBI/etc.)",
      "Name-change advisory if the name ties to old objects",
      "New sector licence & registration roadmap",
      "Investor / lender intimation templates",
      "Coordination of multiple consequential filings",
      "Priority support till the new objects are fully active",
    ],
  },
];

const CocomPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Change your company's object clause at pocket-friendly prices
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

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
                )}
              </article>
            ))}
          </div>

          {/* #133: one shared CTA below the plans — opens the consultation popup. */}
          <div className="consult-cta-row">
            <button
              type="button"
              className="consult-cta-button"
              onClick={() => setShowConsult(true)}
            >
              📅 Book Free Consultation
            </button>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="change-object-company" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="change-object-company"
      />
    </>
  );
};

export default CocomPlans;
