import React, { useState } from "react";
import "./PartnershipLLPPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4", "Filing of MGT - 7", "Filing of ADT - 1", "Minutes of Board Meeting", "Minutes of General Meeting", "Maintenance of Statutory E- Registers", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors"] }
];

const PartnershipLLPPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="llp-plan-pricing-section">
      <div className="llp-plan-pricing-container">

        {/* Upper part */}
        <header className="llp-plan-pricing-header">
          <h2 className="llp-plan-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="llp-plan-pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="llp-plan-pricing-cards">

          {/* Elemental */}
          <article className="llp-plan-card">
            <div>
              <div className="llp-plan-header">
                <div className="llp-plan-name">Elemental</div>
                <div className="llp-plan-old-price">₹5,999</div>
                <div className="llp-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="llp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="llp-plan-body">
                <ul className="llp-plan-list">
                  <li className="llp-plan-list-item">Search Report of Name Availability</li>
                  <li className="llp-plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="llp-plan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="llp-plan-list-item">Certificate of Incorporation</li>
                  <li className="llp-plan-list-item">E-PAN</li>
                  <li className="llp-plan-list-item">E-TAN</li>
                  <li className="llp-plan-list-item">E-MOA</li>
                  <li className="llp-plan-list-item">E-AOA</li>
                  <li className="llp-plan-list-item">Documents for Bank Account Opening</li>
                  <li className="llp-plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="llp-plan-list-item">EPF Registrations</li>
                  <li className="llp-plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="llp-plan-footer">
              <button className="llp-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched */}
          <article className="llp-plan-card">
            <div>
              <div className="llp-plan-header">
                <div className="llp-plan-name">Enriched</div>
                <div className="llp-plan-old-price">₹7,999</div>
                <div className="llp-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="llp-plan-meta">
                  Excluding gov fee <span className="llp-plan-popular">(Popular)</span>
                </div>
              </div>

              <div className="llp-plan-body">
                <ul className="llp-plan-list">
                  <li className="llp-plan-list-item">Elemental Plan Plus</li>
                  <li className="llp-plan-list-item">Share Certificate</li>
                  <li className="llp-plan-list-item">Commencement of Business</li>
                  <li className="llp-plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="llp-plan-footer">
              <button className="llp-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Supreme */}
          <article className="llp-plan-card">
            <div>
              <div className="llp-plan-header">
                <div className="llp-plan-name">Supreme</div>
                <div className="llp-plan-old-price">₹29,999</div>
                <div className="llp-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="llp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="llp-plan-body">
                <ul className="llp-plan-list">
                  <li className="llp-plan-list-item">Enriched Plan Plus</li>
                  <li className="llp-plan-list-item">Income tax filing of Company</li>
                  <li className="llp-plan-list-item">Preparation of Directors Report</li>
                  <li className="llp-plan-list-item">Preparation of Annual Return</li>
                  <li className="llp-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="llp-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="llp-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="llp-plan-list-item">Preparation of Notice of BM</li>
                  <li className="llp-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="llp-plan-list-item">Filing of AOC - 4</li>
                  <li className="llp-plan-list-item">Filing of MGT - 7</li>
                  <li className="llp-plan-list-item">Filing of ADT - 1</li>
                  <li className="llp-plan-list-item">Minutes of Board Meeting</li>
                  <li className="llp-plan-list-item">Minutes of General Meeting</li>
                  <li className="llp-plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="llp-plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="llp-plan-list-item">Income Tax Filing of 2 Directors</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="llp-plan-footer">
              <button className="llp-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="partnership-to-llp" />

      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="partnership-to-llp"
      />

    </>

  );};

export default PartnershipLLPPlanandPricing;
