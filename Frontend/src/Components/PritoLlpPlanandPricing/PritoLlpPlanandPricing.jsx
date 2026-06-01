import React, { useState } from "react";
import "./PritoLlpPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 3999, services: ["Search Report of Name Availability", "1 RUN Name Approval Certificate", "Director Identification Number for 2 Individuals", "Certificate of Incorporation", "E-PAN", "E-TAN", "E-MOA", "E-AOA", "Documents for Bank Account Opening", "Documents for 1st Auditor Appointment", "EPF Registrations", "ESI Registrations"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="PLC-to-LLP-pricing-section">
      <div className="pricing-container">
        
        {/* Upper part */}
        <header className="pricing-header">
          <h2 className="PLC-to-LLP-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-old-price">₹5,999</div>
                <div className="plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Search Report of Name Availability</li>
                  <li className="plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="plan-list-item">Director Identification Number for 2 Individuals</li>
                  <li className="plan-list-item">Certificate of Incorporation</li>
                  <li className="plan-list-item">E-PAN</li>
                  <li className="plan-list-item">E-TAN</li>
                  <li className="plan-list-item">E-MOA</li>
                  <li className="plan-list-item">E-AOA</li>
                  <li className="plan-list-item">Documents for Bank Account Opening</li>
                  <li className="plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="plan-list-item">EPF Registrations</li>
                  <li className="plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Enriched</div>
                <div className="plan-old-price">₹7,999</div>
                <div className="plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Elemental Plan Plus</li>
                  <li className="plan-list-item">Share Certificate</li>
                  <li className="plan-list-item">Commencement of Business</li>
                  <li className="plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Supreme</div>
                <div className="plan-old-price">₹29,999</div>
                <div className="plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Enriched Plan Plus</li>
                  <li className="plan-list-item">Income tax filing of Company</li>
                  <li className="plan-list-item">Preparation of Directors Report</li>
                  <li className="plan-list-item">Preparation of Annual Return</li>
                  <li className="plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="plan-list-item">Preparation of List of Share Holders</li>
                  <li className="plan-list-item">Preparation of Notice of AGM</li>
                  <li className="plan-list-item">Preparation of Notice of BM</li>
                  <li className="plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="plan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="plan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="plan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="plan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="plan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="plan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="plan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="plan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="plan-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-llp" />

      )}

    </>

  );};

export default PricingSection;
