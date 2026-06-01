import React, { useState } from "react";
import "./PritoPublicPlanandPricing.css";
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
    <section className="prp-price-section">
      <div className="prp-price-container">

        {/* Upper part */}
        <header className="prp-price-header">
          <h2 className="prp-price-title">CHOOSE YOUR PLAN</h2>
          <p className="prp-price-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="prp-price-cards">

          {/* Elemental */}
          <article className="prp-price-card">
            <div>
              <div className="prp-price-card-header">
                <div className="prp-price-name">Elemental</div>
                <div className="prp-price-old">₹5,999</div>
                <div className="prp-price-current">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="prp-price-meta">Excluding gov fee</div>
              </div>

              <div className="prp-price-body">
                <ul className="prp-price-list">
                  <li className="prp-price-item">Search Report of Name Availability</li>
                  <li className="prp-price-item">1 RUN Name Approval Certificate</li>
                  <li className="prp-price-item">Director Identification Number for 2 Individuals</li>
                  <li className="prp-price-item">Certificate of Incorporation</li>
                  <li className="prp-price-item">E-PAN</li>
                  <li className="prp-price-item">E-TAN</li>
                  <li className="prp-price-item">E-MOA</li>
                  <li className="prp-price-item">E-AOA</li>
                  <li className="prp-price-item">Documents for Bank Account Opening</li>
                  <li className="prp-price-item">Documents for 1st Auditor Appointment</li>
                  <li className="prp-price-item">EPF Registrations</li>
                  <li className="prp-price-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="prp-price-footer">
              <button className="prp-price-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="prp-price-card">
            <div>
              <div className="prp-price-card-header">
                <div className="prp-price-name">Enriched</div>
                <div className="prp-price-old">₹7,999</div>
                <div className="prp-price-current">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="prp-price-meta">
                  Excluding gov fee <span className="prp-price-popular">(Popular)</span>
                </div>
              </div>

              <div className="prp-price-body">
                <ul className="prp-price-list">
                  <li className="prp-price-item">Elemental Plan Plus</li>
                  <li className="prp-price-item">Share Certificate</li>
                  <li className="prp-price-item">Commencement of Business</li>
                  <li className="prp-price-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="prp-price-footer">
              <button className="prp-price-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="prp-price-card">
            <div>
              <div className="prp-price-card-header">
                <div className="prp-price-name">Supreme</div>
                <div className="prp-price-old">₹29,999</div>
                <div className="prp-price-current">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="prp-price-meta">Excluding gov fee</div>
              </div>

              <div className="prp-price-body">
                <ul className="prp-price-list">
                  <li className="prp-price-item">Enriched Plan Plus</li>
                  <li className="prp-price-item">Income tax filing of Company</li>
                  <li className="prp-price-item">Preparation of Directors Report</li>
                  <li className="prp-price-item">Preparation of Annual Return</li>
                  <li className="prp-price-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="prp-price-item">Preparation of List of Share Holders</li>
                  <li className="prp-price-item">Preparation of Notice of AGM</li>
                  <li className="prp-price-item">Preparation of Notice of BM</li>
                  <li className="prp-price-item">Preparation of Extracts of AGM</li>
                  <li className="prp-price-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="prp-price-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="prp-price-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="prp-price-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="prp-price-item">Minutes of General Meeting for 1st FY</li>
                  <li className="prp-price-item">Maintenance of Statutory E- Registers</li>
                  <li className="prp-price-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="prp-price-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="prp-price-item">DIR KYC (2 Directors)</li>
                  <li className="prp-price-item">Income Tax Filing of 2 Directors</li>
                  <li className="prp-price-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="prp-price-footer">
              <button className="prp-price-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-public" />

      )}

    </>

  );};

export default PricingSection;
