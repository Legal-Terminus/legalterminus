import React from "react";
import "./PublicltdRightPlan.css";

const PricingSection = () => {
  return (
    <section className="pub-plan-section">
      <div className="pub-plan-container">

        {/* Header */}
        <header className="pub-plan-header">
          <h2 className="pub-plan-title">CHOOSE YOUR PLAN</h2>
          <p className="pub-plan-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="pub-plan-cards">

          {/* Elemental */}
          <article className="pub-plan-card">
            <div>
              <div className="pub-plan-card-header">
                <div className="pub-plan-name">Elemental</div>
                <div className="pub-plan-old-price">₹29,999</div>
                <div className="pub-plan-price">₹24,999</div>
                <div className="pub-plan-meta">Excluding gov fee</div>
              </div>

              <div className="pub-plan-body">
                <ul className="pub-plan-list">
                  <li className="pub-plan-list-item">1 RUN Name Approval Certificate</li>
                  <li className="pub-plan-list-item">DIN for 3 Individuals</li>
                  <li className="pub-plan-list-item">DSC for 7 Individuals</li>
                  <li className="pub-plan-list-item">Certificate of Incorporation</li>
                  <li className="pub-plan-list-item">E-PAN</li>
                  <li className="pub-plan-list-item">E-TAN</li>
                  <li className="pub-plan-list-item">E-MOA</li>
                  <li className="pub-plan-list-item">E-AOA</li>
                  <li className="pub-plan-list-item">Documents for Bank Account Opening</li>
                  <li className="pub-plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="pub-plan-list-item">EPF Registrations</li>
                  <li className="pub-plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="pub-plan-footer">
              <button className="pub-plan-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="pub-plan-card">
            <div>
              <div className="pub-plan-card-header">
                <div className="pub-plan-name">Enriched</div>
                <div className="pub-plan-old-price">₹34,999</div>
                <div className="pub-plan-price">₹27,999</div>
                <div className="pub-plan-meta">
                  Excluding gov fee <span className="pub-plan-popular">(Popular)</span>
                </div>
              </div>

              <div className="pub-plan-body">
                <ul className="pub-plan-list">
                  <li className="pub-plan-list-item">Elemental Plan Plus</li>
                  <li className="pub-plan-list-item">UDYAM Registration</li>
                  <li className="pub-plan-list-item">Share Certificate</li>
                  <li className="pub-plan-list-item">Commencement of Business</li>
                  <li className="pub-plan-list-item">GST Registration</li>
                </ul>
              </div>
            </div>

            <div className="pub-plan-footer">
              <button className="pub-plan-button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="pub-plan-card">
            <div>
              <div className="pub-plan-card-header">
                <div className="pub-plan-name">Supreme</div>
                <div className="pub-plan-old-price">₹49,999</div>
                <div className="pub-plan-price">₹39,999</div>
                <div className="pub-plan-meta">Excluding gov fee</div>
              </div>

              <div className="pub-plan-body">
                <ul className="pub-plan-list">
                  <li className="pub-plan-list-item">Enriched Plan Plus</li>
                  <li className="pub-plan-list-item">ITR Filing of 2 Directors</li>
                  <li className="pub-plan-list-item">ITR Filing of Company</li>
                  <li className="pub-plan-list-item">Preparation of Directors Report</li>
                  <li className="pub-plan-list-item">Preparation of Auditor Appointment Paperwork</li>
                  <li className="pub-plan-list-item">Preparation of List of Share Holders</li>
                  <li className="pub-plan-list-item">Preparation of Extracts of AGM</li>
                  <li className="pub-plan-list-item">Preparation of Notice of BM</li>
                  <li className="pub-plan-list-item">Preparation of Notice of AGM</li>
                  <li className="pub-plan-list-item">Preparation and filing of AOC-4 (Financial Statements)</li>
                  <li className="pub-plan-list-item">Preparation and filing of MGT-7 (Annual Return)</li>
                  <li className="pub-plan-list-item">Filing of ADT-1 (Auditor Appointment)</li>
                  <li className="pub-plan-list-item">Minutes of BM for 1st year</li>
                  <li className="pub-plan-list-item">Minutes of AGM for 1st year</li>
                  <li className="pub-plan-list-item">Maintenance of Statutory E-Registers</li>
                  <li className="pub-plan-list-item">DIR KYC - 2 Directors</li>
                </ul>
              </div>
            </div>

            <div className="pub-plan-footer">
              <button className="pub-plan-button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
