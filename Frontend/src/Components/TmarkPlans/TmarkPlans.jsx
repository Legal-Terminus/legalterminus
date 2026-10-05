import { useState } from "react";
import "./TmarkPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";
import { usePlans, PAYMENTS_ENABLED } from "../../utils/pricing";

const DEFAULT_PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "PROPOSED-TO-BE-USED",
    oldPrice: 2249,
    price: 1499,
    services: [
      "On-Call consultation with expert",
      "Trademark search report (Upto 5 Names)",
      "Identification of Trademark Class",
      "Drafting of Power of Attorney",
      "Trademark Application Filing",
      "Lifetime updates and reminders",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ WITH OBJECTION REPLY",
    popular: true,
    oldPrice: 9749,
    price: 6499,
    services: [
      "On-Call consultation with expert",
      "Trademark search report (Upto 10 Names)",
      "Identification of Trademark Class",
      "Drafting of Power of Attorney",
      "Trademark Application Filing",
      "Lifetime updates and reminders",
      "Reply of Departmental Objections",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ WITH UNLIMITED HEARINGS",
    oldPrice: 15499,
    price: 12499,
    services: [
      "On-Call consultation with expert",
      "Trademark search report (Upto 20 Names)",
      "Identification of Trademark Class",
      "Drafting of Power of Attorney",
      "Trademark Application Filing",
      "Lifetime updates and reminders",
      "Reply of Departmental Objections",
      "Udyam Certificate Update (or fresh Udyam application)",
      "Trademark Hearing (Unlimited)",
    ],
  },
];

const TmarkPlans = () => {
  // E24-S01: prices come from the server catalogue; DEFAULT_* is the fallback.
  const PLANS = usePlans("trademark-application", DEFAULT_PLANS);
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
              Protect your brand with a trademark at pocket-friendly prices
            </p>
          </header>

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
                {PAYMENTS_ENABLED && (
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-application" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="trademark-application"
      />
    </>
  );
};

export default TmarkPlans;
