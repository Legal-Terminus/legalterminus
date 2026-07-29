import React, { useState } from "react";
import "./ChangeLlpPlanandPrice.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";
import ConsultationModal from "../ConsultationModal/ConsultationModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 4499, services: ["Filing of RUN (Name Application)", "Filing of LLP 5 (Change of Name)", "Preparation of Supplementary LLP Agreement", "Preparation of Resolution", "Filing of LLP 3 (Supplementary Agreement)"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const ChangeLlpPlanandPrice = () => {
  const [activePlan, setActivePlan] = useState(null);
  // #133: payment (Buy Now → CheckoutModal) is paused; the shared "Book Free
  // Consultation" button below opens the consultation popup instead.
  const [showConsult, setShowConsult] = useState(false);

  return (

    <>
    <section className="ChangeLlp-pricing-section">
      <div className="ChangeLlp-pp-container">
        
        {/* Upper part */}
        <header className="ChangeLlp-pp-header">
          <h2 className="ChangeLlp-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="ChangeLlp-pp-subtitle">
            Change in name (LLP) with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="ChangeLlp-pp-cards">

          {/* Elemental */}
          <article className="ChangeLlp-plan-card">
            <div>
              <div className="ChangeLlp-plan-header">
                <div className="ChangeLlp-plan-name">Elemental</div>
                <div className="ChangeLlp-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="ChangeLlp-plan-meta">Including gov fee</div>
              </div>

              <div className="ChangeLlp-plan-body">
                <ul className="ChangeLlp-plan-list">
                  <li className="ChangeLlp-plan-list-item">Filing of RUN (Name Application)</li>
                  <li className="ChangeLlp-plan-list-item">Filing of LLP 5 (Change of Name)</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Supplementary LLP Agreement</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Resolution</li>
                  <li className="ChangeLlp-plan-list-item">Filing of LLP 3 (Supplementary Agreement)</li>
                </ul>
              </div>
            </div>

            {/* #133: per-card "Buy Now" hidden while payment is paused. Kept in
                place (not deleted) so it can be re-enabled later. */}
            {false && (
            <div className="ChangeLlp-plan-footer">
              <button className="ChangeLlp-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
            )}
          </article>

          {/* Enriched
          <article className="ChangeLlp-plan-card">
            <div>
              <div className="ChangeLlp-plan-header">
                <div className="ChangeLlp-plan-name">Enriched</div>
                <div className="ChangeLlp-plan-old-price">₹7,999</div>
                <div className="ChangeLlp-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="ChangeLlp-plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="ChangeLlp-plan-body">
                <ul className="ChangeLlp-plan-list">
                  <li className="ChangeLlp-plan-list-item">Elemental Plan Plus</li>
                  <li className="ChangeLlp-plan-list-item">Share Certificate</li>
                  <li className="ChangeLlp-plan-list-item">Commencement of Business</li>
                  <li className="ChangeLlp-plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="ChangeLlp-plan-footer">
              <button className="ChangeLlp-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article> */}

          {/* Supreme
          <article className="ChangeLlp-plan-card">
            <div>
              <div className="ChangeLlp-plan-header">
                <div className="ChangeLlp-plan-name">Supreme</div>
                <div className="ChangeLlp-plan-old-price">₹29,999</div>
                <div className="ChangeLlp-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="ChangeLlp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="ChangeLlp-plan-body">
                <ul className="ChangeLlp-plan-list">
                  <li className="ChangeLlp-plan-list-item">Enriched Plan Plus</li>
                  <li className="ChangeLlp-plan-list-item">Income tax filing of Company</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Directors Report</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Annual Return</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Notice of BM</li>
                  <li className="ChangeLlp-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="ChangeLlp-plan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="ChangeLlp-plan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="ChangeLlp-plan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="ChangeLlp-plan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="ChangeLlp-plan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="ChangeLlp-plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="ChangeLlp-plan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="ChangeLlp-plan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="ChangeLlp-plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="ChangeLlp-plan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="ChangeLlp-plan-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="ChangeLlp-plan-footer">
              <button className="ChangeLlp-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article> */}

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

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="change-llp-name" />

      )}

      <ConsultationModal
        open={showConsult}
        onClose={() => setShowConsult(false)}
        source="change-llp-name"
      />

    </>

  );};

export default ChangeLlpPlanandPrice;
