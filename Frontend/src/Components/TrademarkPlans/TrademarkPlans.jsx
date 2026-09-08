import { useState } from "react";
import "../PubpvtPlans/PubpvtPlans.css";
import "../CompanyRegPlans/CompanyRegPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    displayName: "ELEMENTAL",
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
    displayName: "ENRICHED",
    popular: true,
    price: 6499,
    services: [
      "On-Call consultation with expert",
      "Trademark search report (Upto 10 Names)",
      "Identification of Trademark Class",
      "Drafting of Power of Attorney",
      "Trademark Application Filing",
      "Lifetime updates and reminders",
      "Reply of Departmental Objections (unlimited)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    displayName: "SUPREME",
    price: 12499,
    services: [
      "On-Call consultation with expert",
      "Trademark search report (Upto 20 Names)",
      "Identification of Trademark Class",
      "Drafting of Power of Attorney",
      "Trademark Application Filing",
      "Lifetime updates and reminders",
      "Reply of Departmental Objections (unlimited)",
      "Trademark Hearing (Unlimited)",
    ],
  },
];

const TrademarkPlans = () => {
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

          <div className="opcpricing-cards pubpvt-cards-center">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    <div className="opcplan-name">{plan.displayName}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}/-</div>
                    <div className="opcplan-meta">Excluding govt fee</div>
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
                {false && (
                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
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
          plan={activePlan}
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
