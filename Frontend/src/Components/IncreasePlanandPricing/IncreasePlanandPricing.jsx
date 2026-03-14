import React from "react";
import "./IncreasePlanandPricing.css";

const IncreasePlanandPricing= () => {
  return (
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
                <div className="Increase-plan-price">₹2,499</div>
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
              <button className="Increase-plan-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched
          <article className="Increase-plan-card">
            <div>
              <div className="Increase-plan-header">
                <div className="Increase-plan-name">Enriched</div>
                <div className="Increase-plan-old-price">₹7,999</div>
                <div className="Increase-plan-price">₹5,999</div>
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
              <button className="Increase-plan-button">Buy Now</button>
            </div>
          </article> */}

          {/* Supreme
          <article className="Increase-plan-card">
            <div>
              <div className="Increase-plan-header">
                <div className="Increase-plan-name">Supreme</div>
                <div className="Increase-plan-old-price">₹29,999</div>
                <div className="Increase-plan-price">₹24,999</div>
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
              <button className="Increase-plan-button">Buy Now</button>
            </div>
          </article> */}

        </div>
      </div>
    </section>
  );
};

export default IncreasePlanandPricing;
