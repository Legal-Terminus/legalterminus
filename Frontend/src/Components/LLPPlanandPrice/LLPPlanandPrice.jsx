import React from "react";
import "./LLPPlanandPrice.css";

const LLPPlanandPrice = () => {
  return (
    <section className="LLP-Plan-Price-section">
      <div className="LLP-Plan-pricing-container">
        
        {/* Upper part */}
        <header className="LLP-Plan-pricing-header">
          <h2 className="LLP-Plan-Price-title">CHOOSE YOUR PLAN</h2>
          <p className="LLP-Plan-pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="LLP-Plan-pricing-cards">

          {/* Elemental */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Elemental</div>
                <div className="LLP-Plan--old-price">₹5,999</div>
                <div className="LLP-Plan--price">₹3,999</div>
                <div className="LLP-Plan--meta">Excluding gov fee</div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Search Report of Name Availability</li>
                  <li className="LLP-Plan--list-item">1 RUN Name Approval Certificate</li>
                  <li className="LLP-Plan--list-item">Director Identification Number for 2 Individuals</li>
                  <li className="LLP-Plan--list-item">Certificate of Incorporation</li>
                  <li className="LLP-Plan--list-item">E-PAN</li>
                  <li className="LLP-Plan--list-item">E-TAN</li>
                  <li className="LLP-Plan--list-item">E-MOA</li>
                  <li className="LLP-Plan--list-item">E-AOA</li>
                  <li className="LLP-Plan--list-item">Documents for Bank Account Opening</li>
                  <li className="LLP-Plan--list-item">Documents for 1st Auditor Appointment</li>
                  <li className="LLP-Plan--list-item">EPF Registrations</li>
                  <li className="LLP-Plan--list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Enriched</div>
                <div className="LLP-Plan--old-price">₹7,999</div>
                <div className="LLP-Plan--price">₹5,999</div>
                <div className="LLP-Plan--meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Elemental Plan Plus</li>
                  <li className="LLP-Plan--list-item">Share Certificate</li>
                  <li className="LLP-Plan--list-item">Commencement of Business</li>
                  <li className="LLP-Plan--list-item">Udyam/MSME Registration</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="LLP-Plan--card">
            <div>
              <div className="LLP-Plan--header">
                <div className="LLP-Plan--name">Supreme</div>
                <div className="LLP-Plan--old-price">₹29,999</div>
                <div className="LLP-Plan--price">₹24,999</div>
                <div className="LLP-Plan--meta">Excluding gov fee</div>
              </div>

              <div className="LLP-Plan--body">
                <ul className="LLP-Plan--list">
                  <li className="LLP-Plan--list-item">Enriched Plan Plus</li>
                  <li className="LLP-Plan--list-item">Income tax filing of Company</li>
                  <li className="LLP-Plan--list-item">Preparation of Directors Report</li>
                  <li className="LLP-Plan--list-item">Preparation of Annual Return</li>
                  <li className="LLP-Plan--list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="LLP-Plan--list-item">Preparation of List of Share Holders</li>
                  <li className="LLP-Plan--list-item">Preparation of Notice of AGM</li>
                  <li className="LLP-Plan--list-item">Preparation of Notice of BM</li>
                  <li className="LLP-Plan--list-item">Preparation of Extracts of AGM</li>
                  <li className="LLP-Plan--list-item">Filing of AOC - 4 (Financial Statements)</li>
                  <li className="LLP-Plan--list-item">Filing of MGT - 7 (Annual Return)</li>
                  <li className="LLP-Plan--list-item">Filing of ADT - 1 (Auditor Appointment)</li>
                  <li className="LLP-Plan--list-item">Minutes of Board Meeting for 1st FY</li>
                  <li className="LLP-Plan--list-item">Minutes of General Meeting for 1st FY</li>
                  <li className="LLP-Plan--list-item">Maintenance of Statutory E- Registers</li>
                  <li className="LLP-Plan--list-item">Filing of DPT - 3 Annual (If Applicable)</li>
                  <li className="LLP-Plan--list-item">Filing of MSME - 1 (If Applicable) for 1st FY</li>
                  <li className="LLP-Plan--list-item">DIR KYC (2 Directors)</li>
                  <li className="LLP-Plan--list-item">Income Tax Filing of 2 Directors</li>
                  <li className="LLP-Plan--list-item">Audit fees are excluded and to be paid directly to Auditor</li>
                </ul>
              </div>
            </div>

            <div className="LLP-Plan--footer">
              <button className="LLP-Plan--button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default LLPPlanandPrice;
