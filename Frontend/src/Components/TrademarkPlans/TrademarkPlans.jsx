import { useRef, useState } from "react";
import "../TmarkPlans/TmarkPlans.css";
import "../CompanyRegPlans/CompanyRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";
import { usePlans, inr, PAYMENTS_ENABLED } from "../../utils/pricing";
import PlanChoice from "../PlanChoice/PlanChoice";
import { usePlanChoice } from "../PlanChoice/usePlanChoice";
import { TRADEMARK_CHOICE, TRADEMARK_CHOICE_HINTS } from "../TmarkPlans/trademarkChoice";

const DEFAULT_PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "★ PROPOSED-TO-BE-USED",
    oldPrice: 2249,
    price: 1499,
    services: [
      "Name search up to 5 names (IP India database)",
      "Preparing objects / goods + services descriptions",
      "Preparing Power of Attorney (Form TM-48)",
      "Filing TM-A application on IP India portal",
      "Monthly status update of the application (lifetime)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ WITH DEPT QUERY HANDLING",
    popular: true,
    oldPrice: 9999,
    price: 4499,
    services: [
      "Everything in Elemental Plus",
      "Udyam certificate update (or fresh Udyam application)",
      "Departmental Query Handling – Preparation and Filing of Response to the Examination Report (Limited to One Objection)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ ATTEND DEPARTMENTAL HEARING",
    oldPrice: 22499,
    price: 11999,
    services: [
      "Everything in Enriched",
      "Trademark Departmental Hearing Representation (Unlimited)",
    ],
  },
  // #209, the firm on 2 Nov: a fourth plan, as on Private Limited.
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FILE OPPOSITION",
    oldPrice: 32499,
    price: 21999,
    services: [
      "Everything in Supreme",
      "Trademark Opposition – Filing of Counter-Statement / Reply to Opposition and Submission of Evidence (Limited to One Opponent; Excludes Opposition Hearing)",
    ],
  },
];

const TrademarkPlans = () => {
  // E24-S01: prices come from the server catalogue; DEFAULT_* is the fallback.
  const LIVE_PLANS = usePlans("trademark-application", DEFAULT_PLANS);
  // #221: "Proposed to be Used" / "Prior User", asked above the cards. The cards
  // show the plan price plus the answer's surcharge; the server charges it.
  const choiceRef = useRef(null);
  const pc = usePlanChoice("trademark-application", TRADEMARK_CHOICE, choiceRef);
  const PLANS = pc.priced(LIVE_PLANS);
  const [activePlan, setActivePlan] = useState(null);
  // Payment (Register Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="opc-pricing-section crp-pricing">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Protect your brand with a trademark at pocket-friendly prices
            </p>
          </header>

          <PlanChoice
            ref={choiceRef}
            choice={pc.choice}
            value={pc.optionId}
            onChange={pc.choose}
            hints={TRADEMARK_CHOICE_HINTS}
            error={pc.error}
            idPrefix="tm-user-type"
          />

          <div className="opcpricing-cards tmark-cards-center">
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
                    {plan.oldPrice ? <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div> : null}
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    {pc.surcharge > 0 && (
                      <div className="plan-choice-card-note">Includes {inr(pc.surcharge)} for {pc.option.name}</div>
                    )}
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

                {/* Per-card "Register Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {PAYMENTS_ENABLED && (
                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => {
                      // #221: no answer yet → ask for one; never pick a default for the customer.
                      const { ok, option } = pc.requireChoice();
                      if (ok) setActivePlan({ plan, option });
                    }}
                  >
                    Register Now
                  </button>
                </div>
                )}
              </article>
            ))}
          </div>

          {/* One shared CTA below the plans — opens the consultation popup. */}
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
        <CheckoutModal
          plan={activePlan.plan}
          option={activePlan.option}
          onClose={() => setActivePlan(null)}
          source="trademark-application"
        />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="trademark-registration-odisha"
        locationField="city"
        fixedState="Odisha"
      />
    </>
  );
};

export default TrademarkPlans;
