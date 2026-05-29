import React, { useState } from "react";
import "./IncorporationPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const IncorporationPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="incorp-pricing-section">
      <div className="incorp-pricing-container">

        {/* ================= HEADER ================= */}
        <header className="incorp-pricing-header">
          <h2 className="incorp-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="incorp-pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="incorp-pricing-cards">

          {/* ========== ELEMENTAL ========== */}
          <article className="incorp-plan-card">
            <div>
              <div className="incorp-plan-header">
                <div className="incorp-plan-name">Elemental</div>
                <div className="incorp-plan-old-price">₹5,999</div>
                <div className="incorp-plan-price">₹3,999</div>
                <div className="incorp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="incorp-plan-body">
                <ul className="incorp-plan-list">
                  <li className="incorp-plan-list-item">Search Report of Name Availability</li>
                  <li className="incorp-plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="incorp-plan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="incorp-plan-list-item">Certificate of Incorporation</li>
                  <li className="incorp-plan-list-item">E-PAN</li>
                  <li className="incorp-plan-list-item">E-TAN</li>
                  <li className="incorp-plan-list-item">E-MOA</li>
                  <li className="incorp-plan-list-item">E-AOA</li>
                  <li className="incorp-plan-list-item">Documents for Bank Account Opening</li>
                  <li className="incorp-plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="incorp-plan-list-item">EPF Registrations</li>
                  <li className="incorp-plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="incorp-plan-footer">
              <button className="incorp-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* ========== ENRICHED (POPULAR) ========== */}
          <article className="incorp-plan-card">
            <div>
              <div className="incorp-plan-header">
                <div className="incorp-plan-name">Enriched</div>
                <div className="incorp-plan-old-price">₹7,999</div>
                <div className="incorp-plan-price">₹5,999</div>
                <div className="incorp-plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="incorp-plan-body">
                <ul className="incorp-plan-list">
                  <li className="incorp-plan-list-item">Elemental Plan Plus</li>
                  <li className="incorp-plan-list-item">Share Certificate</li>
                  <li className="incorp-plan-list-item">Commencement of Business</li>
                  <li className="incorp-plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="incorp-plan-footer">
              <button className="incorp-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* ========== SUPREME ========== */}
          <article className="incorp-plan-card">
            <div>
              <div className="incorp-plan-header">
                <div className="incorp-plan-name">Supreme</div>
                <div className="incorp-plan-old-price">₹29,999</div>
                <div className="incorp-plan-price">₹24,999</div>
                <div className="incorp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="incorp-plan-body">
                <ul className="incorp-plan-list">
                  <li className="incorp-plan-list-item">Enriched Plan Plus</li>
                  <li className="incorp-plan-list-item">Income tax filing of Company</li>
                  <li className="incorp-plan-list-item">Preparation of Directors Report</li>
                  <li className="incorp-plan-list-item">Preparation of Annual Return</li>
                  <li className="incorp-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="incorp-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="incorp-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="incorp-plan-list-item">Preparation of Notice of BM</li>
                  <li className="incorp-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="incorp-plan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="incorp-plan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="incorp-plan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="incorp-plan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="incorp-plan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="incorp-plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="incorp-plan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="incorp-plan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="incorp-plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="incorp-plan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="incorp-plan-list-item">
                    Audit fees are excluded and to be paid directly to Auditor
                  </li>
                </ul>
              </div>
            </div>

            <div className="incorp-plan-footer">
              <button className="incorp-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />

      )}

    </>

  );};

export default IncorporationPlanAndPricing;
