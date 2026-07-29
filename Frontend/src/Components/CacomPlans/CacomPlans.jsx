import { useState } from "react";
import "./CacomPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "local",
    name: "Within City / Local Limits",
    oldPrice: 5999,
    price: 2999,
    services: [
      "Board resolution drafting for the address change",
      "New registered-office address-proof verification",
      "Rent agreement / NOC review",
      "Form INC-22 preparation & ROC filing",
      "Govt fee coordination at actuals",
      "Filing acknowledgement & status tracking",
      "Updated registered office on MCA record",
    ],
  },
  {
    id: "instate",
    name: "Within State (Different City / ROC)",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 11999,
    price: 6499,
    services: [
      "Everything in Within City plan",
      "Special resolution & EGM notice drafting",
      "Form MGT-14 filing for the special resolution",
      "Regional Director approval (where ROC changes)",
      "Form INC-22 filing with the new address",
      "PAN & GST address-update assistance",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "interstate",
    name: "State-to-State (MOA Change)",
    badge: "✦ FULL-SERVICE",
    oldPrice: 29999,
    price: 17999,
    services: [
      "Everything in Within State plan",
      "Special resolution to alter the MOA clause",
      "Newspaper advertisement (Form INC-26)",
      "Application to Regional Director (Form INC-23)",
      "Filing of RD order (Form INC-28) & INC-22",
      "Coordination with both old & new ROCs",
      "Priority support till the new state office is on record",
    ],
  },
];

const CacomPlans = () => {
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
              Change your registered office at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="change-address-company" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="change-address-company"
      />
    </>
  );
};

export default CacomPlans;
