import { useState } from "react";
import "./DllpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "strikeoff",
    name: "LLP Strike-Off (Form 24)",
    oldPrice: 14999,
    price: 7999,
    services: [
      "Eligibility check for Form 24 strike-off",
      "Partners' consent & dissolution resolution drafting",
      "Affidavit & indemnity bond from designated partners",
      "Statement of accounts coordination with CA",
      "Form 24 preparation & ROC filing",
      "Govt / out-of-pocket fee coordination at actuals",
      "Filing acknowledgement & status tracking",
    ],
  },
  {
    id: "cleanup",
    name: "Closure + Compliance Clean-Up",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 27999,
    price: 15999,
    services: [
      "Everything in LLP Strike-Off (Form 24)",
      "Pending Form 8 & Form 11 brought up to date",
      "Final income tax return (ITR-5) of the LLP",
      "Bank account closure assistance",
      "DIR-3 KYC of designated partners (if pending)",
      "Liability extinguishment & NIL-asset confirmation",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "fullexit",
    name: "Full Exit Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 49999,
    price: 27999,
    services: [
      "Everything in Closure + Compliance Clean-Up",
      "Closure-route advisory (strike-off vs voluntary winding-up)",
      "Resolution of ROC defaults & overdue filings",
      "Creditor NOC / consent coordination (if any)",
      "Partner & contribution documentation handling",
      "Response to ROC queries till strike-off is notified",
      "Priority support till the LLP name is struck off",
    ],
  },
];

const DllpPlans = () => {
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
              Close your LLP at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="dissolve-llp" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="dissolve-llp"
      />
    </>
  );
};

export default DllpPlans;
