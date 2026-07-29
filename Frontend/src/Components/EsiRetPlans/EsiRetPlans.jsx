import { useState } from "react";
import "./EsiRetPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const ESI_SERVICES = [
  "Employee addition in ESI portal (new IP creation)",
  "Employee exit marking in ESI portal",
  "Monthly ESI return filing (Contribution upload)",
  "ESI contribution payment coordination",
  "Challan emailed to client",
  "Contribution history emailed to client",
  "Filing-by-15th guarantee (Late-fee ZERO promise)",
  "Filed on https://www.esic.gov.in",
  "Monthly due-date by 15TH OF NEXT MONTH",
  "Govt interest (Sec 39 12% pa) + damages (85B 5-25% pa) at actuals",
];

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "UP TO 10 EMPLOYEES",
    oldPrice: 1499,
    price: 999,
    yearly: "₹10,500 / yr",
    services: ESI_SERVICES,
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ 10 TO 25 EMPLOYEES",
    popular: true,
    oldPrice: 2199,
    price: 1999,
    yearly: "₹21,500 / yr",
    services: ESI_SERVICES,
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ 25 TO 50 EMPLOYEES",
    oldPrice: 3499,
    price: 2999,
    yearly: "₹31,500 / yr",
    services: ESI_SERVICES,
  },
];

const EsiRetPlans = () => {
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
              Keep your ESI compliance on track at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards esiret-cards-center">
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
                    {plan.oldPrice && plan.oldPrice !== plan.price && (
                      <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")} / mo</div>
                    )}
                    <div className="opcplan-price">
                      ₹{plan.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: "0.5em", fontWeight: 500 }}> / mo</span>
                    </div>
                    <div className="esiret-plan-yearly">{plan.yearly}</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="esi-return" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="esi-return"
      />
    </>
  );
};

export default EsiRetPlans;
