import React, { useState } from "react";
import "./IncreasePlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 2499, services: ["Preparation of Board Resolution", "Preparation of Notice of EGM", "Preparation of EGM Resolution", "Preparation of MOA", "Filing of MGT 14", "Filing of SH-7"] },
  { id: "enriched", name: "Enriched", price: 5999, services: ["Elemental Plan Plus", "Share Certificate", "Commencement of Business", "Udyam/MSME Registration"] },
  { id: "supreme", name: "Supreme", price: 24999, services: ["Enriched Plan Plus", "Income tax filing of Company", "Preparation of Directors Report", "Preparation of Annual Return", "Preparation of Auditor Appointment Paperwork", "Preparation of List of Share Holders", "Preparation of Notice of AGM", "Preparation of Notice of BM", "Preparation of Extracts of AGM", "Filing of AOC - 4 (Financial Statements)", "Filing of MGT - 7 (Annual Return)", "Filing of ADT - 1 (Auditor Appointment)", "Minutes of Board Meeting for 1st FY", "Minutes of General Meeting for 1st FY", "Maintenance of Statutory E- Registers", "Filing of DPT - 3 Annual (If Applicable)", "Filing of MSME - 1 (If Applicable) for 1st FY", "DIR KYC (2 Directors)", "Income Tax Filing of 2 Directors", "Audit fees are excluded and to be paid directly to Auditor"] }
];

const IncreasePlanandPricing= () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="Increase-pricing-section">
      <div className="Increase-pricing-container">
        
        {/* Upper part */}
        
        <header className="Increase-pricing-header">
          <h2 className="Increase-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="Increase-pricing-subtitle">
            Increase in authorised capital (company) with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="Increase-pricing-cards">

          {/* Elemental */}
          <article className="Increase-plan-card">
            <div>
              <div className="Increase-plan-header">
                <div className="Increase-plan-name">Elemental</div>
                <div className="Increase-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="Increase-plan-meta">Excluding gov fee</div>
              </div>

              <div className="Increase-plan-body">
                <ul className="Increase-plan-list">
                  <li className="Increase-plan-list-item">Preparation of Board Resolution</li>
                  <li className="Increase-plan-list-item">Preparation of Notice of EGM</li>
                  <li className="Increase-plan-list-item">Preparation of EGM Resolution</li>
                  <li className="Increase-plan-list-item">Preparation of MOA</li>
                  <li className="Increase-plan-list-item">Filing of MGT 14</li>
                  <li className="Increase-plan-list-item">Filing of SH-7</li>
                </ul>
              </div>
            </div>

            <div className="Increase-plan-footer">
              <button className="Increase-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* Enriched
          <article className="Increase-plan-card">
            <div>
              <div className="Increase-plan-header">
                <div className="Increase-plan-name">Enriched</div>
                <div className="Increase-plan-old-price">₹7,999</div>
                <div className="Increase-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="Increase-plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Increase-plan-body">
                <ul className="Increase-plan-list">
                  <li className="Increase-plan-list-item">Elemental Plan Plus</li>
                  <li className="Increase-plan-list-item">Share Certificate</li>
                  <li className="Increase-plan-list-item">Commencement of Business</li>
                  <li className="Increase-plan-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="Increase-plan-footer">
              <button className="Increase-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article> */}

          {/* Supreme
          <article className="Increase-plan-card">
            <div>
              <div className="Increase-plan-header">
                <div className="Increase-plan-name">Supreme</div>
                <div className="Increase-plan-old-price">₹29,999</div>
                <div className="Increase-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="Increase-plan-meta">Excluding gov fee</div>
              </div>

              <div className="Increase-plan-body">
                <ul className="Increase-plan-list">
                  <li className="Increase-plan-list-item">Enriched Plan Plus</li>
                  <li className="Increase-plan-list-item">Income tax filing of Company</li>
                  <li className="Increase-plan-list-item">Preparation of Directors Report</li>
                  <li className="Increase-plan-list-item">Preparation of Annual Return</li>
                  <li className="Increase-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="Increase-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="Increase-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="Increase-plan-list-item">Preparation of Notice of BM</li>
                  <li className="Increase-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="Increase-plan-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="Increase-plan-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="Increase-plan-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="Increase-plan-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="Increase-plan-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="Increase-plan-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="Increase-plan-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="Increase-plan-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="Increase-plan-list-item">DIR KYC (2 Directors)</li>
                  <li className="Increase-plan-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="Increase-plan-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="Increase-plan-footer">
              <button className="Increase-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article> */}

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />

      )}

    </>

  );};

export default IncreasePlanandPricing;
