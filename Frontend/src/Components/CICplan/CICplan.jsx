import React from "react";
import "./CICplan.css";

const PricingSection = () => {
  return (
    <section className="pvtltd-pricing-section">
      <div className="pricing-container">
        
        {/* Upper part */}
        <header className="pricing-header">
          <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="pricing-subtitle">
            Change in name (company) with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="cic-card">
            <div>
              <div className="cic-header">
                <div className="cic-name">Elemental</div>
                <div className="cic-price">₹5,999</div>
                <div className="cic-meta">Including gov fee</div>
              </div>

              <div className="cic-body">
                <ul className="cic-list">
                  <li className="cic-list-item">Filing of RUN (Name Application)</li>
                  <li className="cic-list-item">Preparation of Board Resolution</li>
                  <li className="cic-list-item">Preparation of Notice of EGM</li>
                  <li className="cic-list-item">Preparation of EGM Resolution</li>
                  <li className="cic-list-item">Preparation of MOA</li>
                  <li className="cic-list-item">Filing of MGT 14</li>
                  <li className="cic-list-item">Filing of INC 24</li>
                </ul>
              </div>
            </div>

            <div className="cic-footer">
              <button className="cic-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched
          <article className="cic-card">
            <div>
              <div className="cic-header">
                <div className="cic-name">Enriched</div>
                <div className="cic-old-price">₹7,999</div>
                <div className="cic-price">₹5,999</div>
                <div className="cic-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="cic-body">
                <ul className="cic-list">
                  <li className="cic-list-item">Elemental Plan Plus</li>
                  <li className="cic-list-item">Share Certificate</li>
                  <li className="cic-list-item">Commencement of Business</li>
                  <li className="cic-list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="cic-footer">
              <button className="cic-button">Buy Now</button>
            </div>
          </article> */}

          {/* Supreme
          <article className="cic-card">
            <div>
              <div className="cic-header">
                <div className="cic-name">Supreme</div>
                <div className="cic-old-price">₹29,999</div>
                <div className="cic-price">₹24,999</div>
                <div className="cic-meta">Excluding gov fee</div>
              </div>

              <div className="cic-body">
                <ul className="cic-list">
                  <li className="cic-list-item">Enriched Plan Plus</li>
                  <li className="cic-list-item">Income tax filing of Company</li>
                  <li className="cic-list-item">Preparation of Directors Report</li>
                  <li className="cic-list-item">Preparation of Annual Return</li>
                  <li className="cic-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="cic-list-item">Preparation of List of Share Holders</li>
                  <li className="cic-list-item">Preparation of Notice of AGM</li>
                  <li className="cic-list-item">Preparation of Notice of BM</li>
                  <li className="cic-list-item">Preparation of Extracts of AGM</li>
                  <li className="cic-list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="cic-list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="cic-list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="cic-list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="cic-list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="cic-list-item">Maintenance of Statutory E- Registers</li>
                  <li className="cic-list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="cic-list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="cic-list-item">DIR KYC (2 Directors)</li>
                  <li className="cic-list-item">Income Tax Filing of 2 Directors</li>
                  <li className="cic-list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="cic-footer">
              <button className="cic-button">Buy Now</button>
            </div>
          </article> */}

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
