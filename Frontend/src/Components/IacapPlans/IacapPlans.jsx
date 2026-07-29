import { useState } from "react";
import "./IacapPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "increase",
    name: "Increase Authorised Capital",
    oldPrice: 7999,
    price: 3999,
    services: [
      "AOA check for capital-increase authority",
      "Board resolution & EGM notice drafting",
      "Ordinary resolution for the increase",
      "Altered MOA capital clause",
      "Form SH-7 preparation & ROC filing",
      "Govt fee & stamp-duty coordination at actuals",
      "Filing acknowledgement & status tracking",
    ],
  },
  {
    id: "aoa",
    name: "Increase + AOA Amendment",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 13999,
    price: 7499,
    services: [
      "Everything in Increase Authorised Capital",
      "AOA amendment where capital increase isn't permitted",
      "Special resolution & MGT-14 filing for AOA change",
      "Updated MOA & AOA on the MCA record",
      "Statutory register & minutes updates",
      "Capital-structure advisory before filing",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "allotment",
    name: "Increase + Share Allotment",
    badge: "✦ FULL-SERVICE",
    oldPrice: 22999,
    price: 12999,
    services: [
      "Everything in Increase + AOA Amendment",
      "Fresh share allotment (rights / preferential)",
      "Board resolution & valuation guidance",
      "Form PAS-3 (return of allotment) filing",
      "Share certificate issuance & register updates",
      "Cap-table update after the allotment",
      "Priority support till the new shares are issued",
    ],
  },
];

const IacapPlans = () => {
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
              Increase your authorised capital at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee, stamp duty &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="increase-authorised-capital" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="increase-authorised-capital"
      />
    </>
  );
};

export default IacapPlans;
