import { useState } from "react";
import "./DpartPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "deed",
    name: "Dissolution Deed",
    oldPrice: 9999,
    price: 4999,
    services: [
      "Drafting of the dissolution deed / agreement",
      "Mode-of-dissolution advisory (Sections 40–44)",
      "Settlement-of-accounts clause (Section 48)",
      "Mutual release & indemnity between partners",
      "Stamping & notarisation guidance",
      "Public notice draft for dissolution",
      "Email delivery of the executed documents",
    ],
  },
  {
    id: "full",
    name: "Full Dissolution + Filings",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 19999,
    price: 10999,
    services: [
      "Everything in Dissolution Deed",
      "Notice of dissolution to the Registrar of Firms",
      "Public notice publication coordination",
      "Surrender of firm PAN & GST registration",
      "Closure of the firm's bank account",
      "Final income tax return of the firm",
      "Dedicated manager + WhatsApp support",
    ],
  },
  {
    id: "advisory",
    name: "Full Exit + Settlement Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 39999,
    price: 21999,
    services: [
      "Everything in Full Dissolution + Filings",
      "Asset & liability settlement advisory",
      "Goodwill, capital & profit-share computation",
      "Cancellation of licences, Udyam &amp; other registrations",
      "Dispute-prevention drafting between partners",
      "Tax advisory on distribution & capital gains",
      "Priority support till all closures are complete",
    ],
  },
];

const DpartPlans = () => {
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
              Dissolve your partnership firm at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Stamp duty &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="dissolve-partnership" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="dissolve-partnership"
      />
    </>
  );
};

export default DpartPlans;
