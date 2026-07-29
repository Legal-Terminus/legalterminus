import { useState } from "react";
import "./TmexrPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "STANDARD REPLY FILING FOR 1 CITED MARK",
    oldPrice: 4499,
    price: 2999,
    services: [
      "Examination Report review + objection analysis",
      "Reply letter drafting (Section 9 / 11 responses)",
      "Citation of distinguishing marks + case law",
      "Affidavit of use / prior use (if needed)",
      "Filing on IP India portal under Misc head",
      "DSC affixation by LT's associated Attorney",
      "Government fee payment (if any — usually NIL)",
      "Challan + Acknowledgement emailed to client",
      "STATUS UPDATE COMMITMENT (monthly + 1–2 day)",
      "Add'l cited marks: ₹999/mark + GST",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ ATTORNEY CHANGE + REPLY FOR 1 CITED MARK",
    popular: true,
    oldPrice: 5999,
    price: 3999,
    services: [
      "ATTORNEY CHANGE PROCEDURE end-to-end",
      "Form TM-48 POA drafted in LT Attorney's name",
      "Authorisation Letter drafting + signature flow",
      "POA stamping + execution coordination",
      "Filing change-of-attorney on IP India portal",
      "Then FULL REPLY PROCESS per Elemental",
      "Reply drafted + filed + DSC affixed",
      "Challan + Acknowledgement + status alerts",
      "STATUS UPDATE COMMITMENT",
      "Add'l cited marks: ₹999/mark + GST",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ REPLY x2 + HEARING x2  |  1 CITED MARK",
    oldPrice: 14999,
    price: 9999,
    services: [
      "FULL REPLY PROCESS (per Elemental OR Enriched)",
      "Attorney Change inclusive (if needed)",
      "UP TO 2 REPLY FILINGS (initial + responsive)",
      "Re-examination response handling",
      "UP TO 2 SHOW CAUSE HEARINGS attendance",
      "Online (video conference) representation",
      "Hearing brief drafting + evidence compilation",
      "Adjournment management (Form TM-M ₹900 — pass-through)",
      "Senior IP-counsel-led case management",
      "Add'l cited marks: ₹999/mark + GST",
    ],
  },
];

const TmexrPlans = () => {
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
              Overcome your trademark objection at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards tmexr-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-exam-reply" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="trademark-exam-reply"
      />
    </>
  );
};

export default TmexrPlans;
