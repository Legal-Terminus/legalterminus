import { useState } from "react";
import "./PubpvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC",
    oldPrice: 22999,
    price: 14999,
    services: [
      "Conversion eligibility & shareholding review",
      "Board & EGM documentation (notice, agenda, minutes)",
      "Special resolution drafting under Section 14",
      "MOA & AOA alteration (add private restrictions)",
      "MGT-14 filing with the ROC",
      "Form RD-1 application to the Regional Director",
      "INC-28 (RD order) + fresh Certificate of Incorporation",
      "DSC coordination for directors",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 33999,
    price: 21999,
    services: [
      "Everything in Elemental",
      "Newspaper advertisement (Form INC-25A) drafting & coordination",
      "Individual notice to creditors, ROC & Regional Director",
      "Rationalising directors / members to private-company limits",
      "Updated share certificates & statutory registers",
      "PAN / TAN & GST name-change updates",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL TRANSITION + 6-MONTH",
    oldPrice: 49999,
    price: 31999,
    services: [
      "Everything in Enriched",
      "Bank & licence record updates to the new name",
      "Section 115BAA concessional-tax structuring advisory",
      "Statutory registers, minutes & first-year compliance calendar",
      "Annual ITR Filing — Company (1st FY)",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7 (private-company format)",
      "90-day priority CS / CA helpline",
    ],
  },
];

const PubpvtPlans = () => {
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
              Convert your Public Limited Company into a Private Limited at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="public-to-private" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="public-to-private"
      />
    </>
  );
};

export default PubpvtPlans;
