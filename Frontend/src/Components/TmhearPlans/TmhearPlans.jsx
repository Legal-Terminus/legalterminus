import { useState } from "react";
import "./TmhearPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "ELEMENTAL",
    badge: "SINGLE HEARING ATTENDANCE",
    oldPrice: 7459,
    price: 4999,
    services: [
      "Pre-hearing case file review",
      "Hearing prep call with client (30 min)",
      "Online video conference hearing attendance",
      "Oral arguments by LT's associated attorney",
      "Cross-questions handling by Hearing Officer",
      "Hearing minutes recorded",
      "Post-hearing 1-page summary to client",
      "Status Update Commitment (monthly + 1-2 day)",
      "Filed e-filing only (Form TM-M ₹900 adj if needed)",
      "Single hearing per engagement",
    ],
  },
  {
    id: "enriched",
    name: "ENRICHED",
    badge: "HEARING + BRIEF + FOLLOW-UP",
    popular: true,
    oldPrice: 10499,
    price: 6999,
    services: [
      "Everything in Elemental",
      "Hearing brief drafting (arguments + case-law digest)",
      "Evidence compilation in paper-book format",
      "Pre-hearing strategy call (60 min)",
      "Case-law research + precedent citations",
      "Post-hearing written submissions filing",
      "Adjournment via Form TM-M (₹900 pass-through) if needed",
      "Post-hearing follow-up till order receipt",
      "Order analysis + next-steps advisory",
      "Status Update Commitment",
    ],
  },
  {
    id: "supreme",
    name: "SUPREME",
    badge: "MULTI-HEARING + ADJOURNMENT",
    oldPrice: 14999,
    price: 9999,
    services: [
      "Everything in Enriched",
      "Up to 2 hearings attendance (initial + adjourned)",
      "Adjournment management (max 2 per matter)",
      "Form TM-M ₹900 pass-through for adjournments",
      "Detailed paper-book + bound submissions",
      "Senior IP-counsel-led representation",
      "Multiple pre-hearing strategy calls",
      "Post-order detailed advisory",
      "Section 91 appeal preliminary review (if needed)",
      "Status Update Commitment",
    ],
  },
];

const TmhearPlans = () => {
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
              Win your trademark hearing at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards tmhear-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-hearing" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="trademark-hearing"
      />
    </>
  );
};

export default TmhearPlans;
