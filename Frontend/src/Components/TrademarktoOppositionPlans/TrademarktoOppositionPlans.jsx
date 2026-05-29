import React, { useState } from "react";
import "./TrademarktoOppositionPlan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E-Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const TradeLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="tpl-pricing-section">
      <div className="tpl-container">

        {/* Header Section */}
        <header className="tpl-header">
          <h2 className="tpl-title">CHOOSE YOUR PLAN</h2>
          <p className="tpl-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="tpl-cards">

          {/* ===== Elemental Plan ===== */}
          <article className="tpl-card">
            <div>
              <div className="tpl-card-header">
                <div className="tpl-name">Elemental</div>
                <div className="tpl-old-price">₹5,999</div>
                <div className="tpl-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="tpl-meta">Excluding gov fee</div>
              </div>

              <div className="tpl-body">
                <ul className="tpl-list">
                  <li className="tpl-list-item">Search Report of Name Availability</li>
                  <li className="tpl-list-item">1 RUN Name Approval Certificate</li>
                  <li className="tpl-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="tpl-list-item">Certificate of Incorporation</li>
                  <li className="tpl-list-item">E-PAN</li>
                  <li className="tpl-list-item">E-TAN</li>
                  <li className="tpl-list-item">E-MOA</li>
                  <li className="tpl-list-item">E-AOA</li>
                  <li className="tpl-list-item">Documents for Bank Account Opening</li>
                  <li className="tpl-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="tpl-list-item">EPF Registrations</li>
                  <li className="tpl-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="tpl-footer">
              <button className="tpl-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* ===== Enriched Plan ===== */}
          <article className="tpl-card">
            <div>
              <div className="tpl-card-header">
                <div className="tpl-name">Enriched</div>
                <div className="tpl-old-price">₹7,999</div>
                <div className="tpl-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="tpl-meta">
                  Excluding gov fee <span className="tpl-popular">(Popular)</span>
                </div>
              </div>

              <div className="tpl-body">
                <ul className="tpl-list">
                  <li className="tpl-list-item">Elemental Plan Plus</li>
                  <li className="tpl-list-item">Share Certificate</li>
                  <li className="tpl-list-item">Commencement of Business</li>
                  <li className="tpl-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="tpl-footer">
              <button className="tpl-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* ===== Supreme Plan ===== */}
          <article className="tpl-card">
            <div>
              <div className="tpl-card-header">
                <div className="tpl-name">Supreme</div>
                <div className="tpl-old-price">₹29,999</div>
                <div className="tpl-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="tpl-meta">Excluding gov fee</div>
              </div>

              <div className="tpl-body">
                <ul className="tpl-list">
                  <li className="tpl-list-item">Enriched Plan Plus</li>
                  <li className="tpl-list-item">Income tax filing of Company</li>
                  <li className="tpl-list-item">Preparation of Directors Report</li>
                  <li className="tpl-list-item">Preparation of Annual Return</li>
                  <li className="tpl-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="tpl-list-item">Preparation of List of Share Holders</li>
                  <li className="tpl-list-item">Preparation of Notice of AGM</li>
                  <li className="tpl-list-item">Preparation of Notice of BM</li>
                  <li className="tpl-list-item">Preparation of Extracts of AGM</li>
                  <li className="tpl-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="tpl-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="tpl-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="tpl-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="tpl-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="tpl-list-item">Maintenance of Statutory E-Registers</li>
                  <li className="tpl-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="tpl-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="tpl-list-item">DIR KYC (2 Directors)</li>
                  <li className="tpl-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="tpl-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="tpl-footer">
              <button className="tpl-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

export default TradeLicensePlans;
