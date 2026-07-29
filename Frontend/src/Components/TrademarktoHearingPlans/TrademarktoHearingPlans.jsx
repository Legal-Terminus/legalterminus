import React, { useState } from "react";
import "./TrademarktoHearingPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: [] },
  { id: "enriched", name: "Enriched", price: 5999, services: [] },
  { id: "supreme", name: "Supreme", price: 24999, services: [] }
];

const TradeLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="thplan-pricing-section">
      <div className="thplan-container">
        {/* Header Section */}
        <header className="thplan-header">
          <h2 className="thplan-title">CHOOSE YOUR PLAN</h2>
          <p className="thplan-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="thplan-cards">

          {/* Elemental Plan */}
          <article className="thplan-card">
            <div>
              <div className="thplan-header-box">
                <div className="thplan-name">Elemental</div>
                <div className="thplan-old-price">₹5,999</div>
                <div className="thplan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="thplan-meta">Excluding gov fee</div>
              </div>

              <div className="thplan-body">
                <ul className="thplan-list">
                  <li className="thplan-list-item">Search Report of Name Availability</li>
                  <li className="thplan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="thplan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="thplan-list-item">Certificate of Incorporation</li>
                  <li className="thplan-list-item">E-PAN</li>
                  <li className="thplan-list-item">E-TAN</li>
                  <li className="thplan-list-item">E-MOA</li>
                  <li className="thplan-list-item">E-AOA</li>
                  <li className="thplan-list-item">Documents for Bank Account Opening</li>
                  <li className="thplan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="thplan-list-item">EPF Registrations</li>
                  <li className="thplan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="thplan-footer">
              <button className="thplan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched Plan */}
          <article className="thplan-card">
            <div>
              <div className="thplan-header-box">
                <div className="thplan-name">Enriched</div>
                <div className="thplan-old-price">₹7,999</div>
                <div className="thplan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="thplan-meta">
                  Excluding gov fee <span className="thplan-popular">(Popular)</span>
                </div>
              </div>

              <div className="thplan-body">
                <ul className="thplan-list">
                  <li className="thplan-list-item">Elemental Plan Plus</li>
                  <li className="thplan-list-item">Share Certificate</li>
                  <li className="thplan-list-item">Commencement of Business</li>
                  <li className="thplan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="thplan-footer">
              <button className="thplan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Supreme Plan */}
          <article className="thplan-card">
            <div>
              <div className="thplan-header-box">
                <div className="thplan-name">Supreme</div>
                <div className="thplan-old-price">₹29,999</div>
                <div className="thplan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="thplan-meta">Excluding gov fee</div>
              </div>

              <div className="thplan-body">
                <ul className="thplan-list">
                  <li className="thplan-list-item">Enriched Plan Plus</li>
                  <li className="thplan-list-item">Income tax filing of Company</li>
                  <li className="thplan-list-item">Preparation of Directors Report</li>
                  <li className="thplan-list-item">Preparation of Annual Return</li>
                  <li className="thplan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="thplan-list-item">Preparation of List of Share Holders</li>
                  <li className="thplan-list-item">Preparation of Notice of AGM</li>
                  <li className="thplan-list-item">Preparation of Notice of BM</li>
                  <li className="thplan-list-item">Preparation of Extracts of AGM</li>
                  <li className="thplan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="thplan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="thplan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="thplan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="thplan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="thplan-list-item">Maintenance of Statutory E-Registers</li>
                  <li className="thplan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="thplan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="thplan-list-item">DIR KYC (2 Directors)</li>
                  <li className="thplan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="thplan-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="thplan-footer">
              <button className="thplan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-hearing" />

      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="trademark-hearing"
      />

    </>

  );};

export default TradeLicensePlans;
