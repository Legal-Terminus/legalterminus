import { useState } from "react";
import "./IECPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 1999,
    price: 1499,
    services: [
      "IEC application on DGFT portal (dgft.gov.in)",
      "Form ANF 2A filing",
      "Aadhaar OTP + DSC coordination",
      "Document validation + upload",
      "IEC certificate delivery in 1-2 working days",
      "Annual update reminder (every April-June)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 3999,
    price: 2999,
    services: [
      "All features of Elemental Plan",
      "ICEGATE registration assistance",
      "ICEGATE ID & password activation support",
      "Digital Signature (DSC) mapping on ICEGATE",
      "Importer/Exporter profile configuration support",
      "Basic guidance for customs portal access",
      "Email support for ICEGATE login issues",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 5499,
    price: 4999,
    services: [
      "All features of Enriched Plan",
      "AD Code registration on ICEGATE portal",
      "Coordination for bank-issued AD Code letter",
      "Port-wise AD Code submission support",
      "Document validation & customs portal upload",
      "Assistance in activation of AD Code at customs location",
      "Priority processing & dedicated compliance support",
    ],
  },
];

const IECPlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (
    <>
      <section className="iec-pricing-section">
        <div className="iecpricing-container">

          <header className="iecpricing-header">
            <h2 className="iecpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="iecpricing-subtitle">
              Register your importer exporter code with pocket friendly-prices
            </p>
          </header>

          <div className="iecpricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`iecplan-card${plan.popular ? " iecplan-card--popular" : ""}`}
              >
                <div>
                  <div className="iecplan-header">
                    {plan.badge && (
                      <div className="iecplan-badge">{plan.badge}</div>
                    )}
                    <div className="iecplan-name">{plan.name}</div>
                    <div className="iecplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="iecplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="iecplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="iecplan-body">
                    <ul className="iecplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="iecplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                    place (not deleted) so it can be re-enabled later. */}
                {false && (
                <div className="iecplan-footer">
                  <button
                    className={`iecplan-button${plan.popular ? " iecplan-button--popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="iec-registration" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="iec-registration"
      />
    </>
  );
};

export default IECPlans;
