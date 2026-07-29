import { useState } from "react";
import "./BCplanandpricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 11999,
    price: 9999,
    services: [
      "Eligibility check + GS1 India pack recommendation",
      "100-barcode pack, 1-year tenure (right-sized for SME / D2C)",
      "GS1 India membership application drafting",
      "Document curation: PAN, GST, business proof, turnover dec.",
      "Filing on www.gs1india.org",
      "GS1 Company Prefix (GCP) + GTIN range delivery",
      "Barcode image generation guidance (EAN-13 format)",
      "30-day post-issuance support",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 15999,
    price: 11999,
    services: [
      "Everything in Elemental",
      "100 or 1,000-barcode pack",
      "GS1 India membership application drafting",
      "Document curation: PAN, GST, business proof, turnover dec.",
      "Filing on www.gs1india.org",
      "GS1 Company Prefix (GCP) + GTIN range delivery",
      "Barcode image generation guidance (EAN-13 format)",
      "30-day post-issuance support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ ENTERPRISE",
    oldPrice: 17999,
    price: 13999,
    services: [
      "Everything in Enriched (extended to large packs)",
      "1000 or 100,000-barcode pack",
      "GS1 India membership application drafting",
      "Document curation: PAN, GST, business proof, turnover dec.",
      "Filing on www.gs1india.org",
      "GS1 Company Prefix (GCP) + GTIN range delivery",
      "Barcode image generation guidance (EAN-13 format)",
      "30-day post-issuance support",
    ],
  },
];

const BCPricingSection = () => {
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
              Get GS1 Barcode Registration at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="bc-registration" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="bc-registration"
      />
    </>
  );
};

export default BCPricingSection;
