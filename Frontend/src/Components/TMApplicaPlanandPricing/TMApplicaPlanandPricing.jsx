import React, { useState } from "react";
import "./TMApplicaPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 1, services: ["Trademark Search Report", "Form TM-A Filing (1 Class)", "Government Filing Fee (Individuals/MSME: ₹4,500 | Companies: ₹9,000)", "TM Application Number", "Use of ™ Symbol Immediately After Filing"] },
  { id: "enriched", name: "Enriched", price: 7499, services: ["Elemental Plan Plus", "Reply to Examination Report (if objection)", "Hearing Representation (1 instance)", "Udyam/MSME Registration (if applicable)"] },
  { id: "supreme", name: "Supreme", price: 24499, services: ["Enriched Plan Plus", "Opposition Handling Support (1 instance)", "Opposition Hearing Representation", "Renewal Reminder before 10-year expiry", "Certificate of Trademark Registration"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="Tm-Tm-Applica-pricing-section">
      <div className="Tm-Applica-pricing-container">
        
        {/* Upper part */}
        <header className="Tm-Applica-pricing-header">
          <h2 className="Tm-Tm-Applica-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="Tm-Applica-pricing-subtitle">
            PROTECT YOUR BRAND WITH POCKET-FRIENDLY PRICES
          </p>
        </header>

        {/* Cards */}
        <div className="Tm-Applica-pricing-cards">

          {/* Elemental */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Elemental</div>
                <div className="plan-old-price">₹4,999</div>
                <div className="Applica-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="Applica-meta">Excluding gov fee</div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Trademark Search Report</li>
                  <li className="Applica-list-item">Form TM-A Filing (1 Class)</li>
                  <li className="Applica-list-item">Government Filing Fee (Individuals/MSME: ₹4,500 | Companies: ₹9,000)</li>
                  <li className="Applica-list-item">TM Application Number</li>
                  <li className="Applica-list-item">Use of ™ Symbol Immediately After Filing</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Applica-footer">
              <button className="Applica-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Enriched</div>
                <div className="plan-old-price">₹9,999</div>
                <div className="Applica-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="Applica-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Elemental Plan Plus</li>
                  <li className="Applica-list-item">Reply to Examination Report (if objection)</li>
                  <li className="Applica-list-item">Hearing Representation (1 instance)</li>
                  <li className="Applica-list-item">Udyam/MSME Registration (if applicable)</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Applica-footer">
              <button className="Applica-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Supreme */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Supreme</div>
                <div className="plan-old-price">₹19,999</div>
                <div className="Applica-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="Applica-meta">Excluding gov fee</div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Enriched Plan Plus</li>
                  <li className="Applica-list-item">Opposition Handling Support (1 instance)</li>
                  <li className="Applica-list-item">Opposition Hearing Representation</li>
                  <li className="Applica-list-item">Renewal Reminder before 10-year expiry</li>
                  <li className="Applica-list-item">Certificate of Trademark Registration</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="Applica-footer">
              <button className="Applica-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
            )}
          </article>

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

  );};

export default PricingSection;
