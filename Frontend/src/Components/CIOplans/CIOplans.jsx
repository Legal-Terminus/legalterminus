import React, { useState } from "react";
import "./CIOplans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="pvtltd-pricing-section">
      <div className="pricing-container">
        
        {/* Upper part */}
        <header className="pricing-header">
          <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="po-card">
            <div>
              <div className="po-header">
                <div className="po-name">Elemental</div>
                <div className="po-old-price">₹5,999</div>
                <div className="po-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="po-meta">Excluding gov fee</div>
              </div>

              <div className="po-body">
                <ul className="po-list">
                  <li className="po-list-item">Search Report of Name Availability</li>
                  <li className="po-list-item">1 RUN Name Approval Certificate</li>
                  <li className="po-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="po-list-item">Certificate of Incorporation</li>
                  <li className="po-list-item">E-PAN</li>
                  <li className="po-list-item">E-TAN</li>
                  <li className="po-list-item">E-MOA</li>
                  <li className="po-list-item">E-AOA</li>
                  <li className="po-list-item">Documents for Bank Account Opening</li>
                  <li className="po-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="po-list-item">EPF Registrations</li>
                  <li className="po-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="po-footer">
              <button className="po-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched */}
          <article className="po-card">
            <div>
              <div className="po-header">
                <div className="po-name">Enriched</div>
                <div className="po-old-price">₹7,999</div>
                <div className="po-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="po-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="po-body">
                <ul className="po-list">
                  <li className="po-list-item">Elemental Plan Plus</li>
                  <li className="po-list-item">Share Certificate</li>
                  <li className="po-list-item">Commencement of Business</li>
                  <li className="po-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="po-footer">
              <button className="po-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Supreme */}
          <article className="po-card">
            <div>
              <div className="po-header">
                <div className="po-name">Supreme</div>
                <div className="po-old-price">₹29,999</div>
                <div className="po-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="po-meta">Excluding gov fee</div>
              </div>

              <div className="po-body">
                <ul className="po-list">
                  <li className="po-list-item">Enriched Plan Plus</li>
                  <li className="po-list-item">Income tax filing of Company</li>
                  <li className="po-list-item">Preparation of Directors Report</li>
                  <li className="po-list-item">Preparation of Annual Return</li>
                  <li className="po-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="po-list-item">Preparation of List of Share Holders</li>
                  <li className="po-list-item">Preparation of Notice of AGM</li>
                  <li className="po-list-item">Preparation of Notice of BM</li>
                  <li className="po-list-item">Preparation of Extracts of AGM</li>
                  <li className="po-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="po-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="po-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="po-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="po-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="po-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="po-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="po-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="po-list-item">DIR KYC (2 Directors)</li>
                  <li className="po-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="po-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="po-footer">
              <button className="po-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="cio-registration" />

      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="cio-registration"
      />

    </>

  );};

export default PricingSection;
