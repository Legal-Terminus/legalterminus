import React from "react";
import "./ChangeLlpPlanandPrice.css";

const ChangeLlpPlanandPrice = () => {
  return (
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
                <div className="ChangeLlp-plan-price">₹4,499</div>
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

            <div className="ChangeLlp-plan-footer">
              <button className="ChangeLlp-plan-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched
          <article className="ChangeLlp-plan-card">
            <div>
              <div className="ChangeLlp-plan-header">
                <div className="ChangeLlp-plan-name">Enriched</div>
                <div className="ChangeLlp-plan-old-price">₹7,999</div>
                <div className="ChangeLlp-plan-price">₹5,999</div>
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
              <button className="ChangeLlp-plan-button">Buy Now</button>
            </div>
          </article> */}

          {/* Supreme
          <article className="ChangeLlp-plan-card">
            <div>
              <div className="ChangeLlp-plan-header">
                <div className="ChangeLlp-plan-name">Supreme</div>
                <div className="ChangeLlp-plan-old-price">₹29,999</div>
                <div className="ChangeLlp-plan-price">₹24,999</div>
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
              <button className="ChangeLlp-plan-button">Buy Now</button>
            </div>
          </article> */}

        </div>
      </div>
    </section>
  );
};

export default ChangeLlpPlanandPrice;
