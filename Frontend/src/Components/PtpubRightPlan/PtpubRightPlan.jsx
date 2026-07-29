import { useState } from "react";
import "./PtpubRightPlan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC",
    oldPrice: 29999,
    price: 19999,
    services: [
      "Conversion eligibility & cap-table review",
      "Board & EGM documentation (notice, agenda, minutes)",
      "Special resolution drafting under Section 14",
      "MOA & AOA alteration (remove private restrictions)",
      "MGT-14 filing with the ROC",
      "INC-27 conversion application filing",
      "Fresh Certificate of Incorporation (new name)",
      "DSC coordination for directors",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 44999,
    price: 29999,
    services: [
      "Everything in Elemental",
      "Inducting members to reach the 7-shareholder minimum",
      "Appointing directors to reach the 3-director minimum",
      "Updated share certificates & statutory registers",
      "PAN / TAN & GST name-change updates",
      "Bank & licence record updates to the new name",
      "30-day post-conversion support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ 6-MONTH SERVICE",
    oldPrice: 66999,
    price: 44999,
    services: [
      "Everything in Enriched",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Director KYC (DIR-3 KYC) for all directors",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE 12-MONTH",
    oldPrice: 96999,
    price: 64999,
    services: [
      "Everything in Supreme",
      "Statutory Registers Pack (Members, Directors, Charges)",
      "First-year post-conversion ROC compliance calendar",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Audit Committee & governance setup advisory",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "Pre-IPO readiness consultation",
      "90-day priority CS / CA helpline",
    ],
  },
];

const PtpubRightPlan = () => {
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
              Convert your Private Limited Company into a Public Limited at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards ptpub-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-public" />
      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="private-to-public"
      />
    </>
  );
};

export default PtpubRightPlan;
