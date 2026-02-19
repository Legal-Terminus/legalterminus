import React from "react";
import "./Section8PlanAndPricing.css";

const Section8PlanAndPricing = () => {
  return (
    <section className="s8-pricing-section">
      <div className="s8-pricing-container">

        {/* ================= HEADER ================= */}
        <header className="s8-pricing-header">
          <h2 className="s8-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="s8-pricing-subtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="s8-pricing-cards">

          {/* ========== ELEMENTAL ========== */}
          <article className="s8-plan-card">
            <div>
              <div className="s8-plan-header">
                <div className="s8-plan-name">Elemental</div>
                <div className="s8-plan-price">₹7,999</div>
                <div className="s8-plan-meta">Excluding gov fee</div>
              </div>

              <div className="s8-plan-body">
                <ul className="s8-plan-list">
                  <li className="s8-plan-list-item">1 RUN Name Approval Application</li>
                  <li className="s8-plan-list-item">DIN for 2 Individuals</li>
                  <li className="s8-plan-list-item">License for Sec 8</li>
                  <li className="s8-plan-list-item">Certificate from Professional</li>
                  <li className="s8-plan-list-item">Certificate of Incorporation</li>
                  <li className="s8-plan-list-item">E-PAN</li>
                  <li className="s8-plan-list-item">E-TAN</li>
                  <li className="s8-plan-list-item">E-MOA</li>
                  <li className="s8-plan-list-item">E-AOA</li>
                  <li className="s8-plan-list-item">Documents for Bank Account opening</li>
                  <li className="s8-plan-list-item">Documents for 1st Auditor Appointment</li>
                  <li className="s8-plan-list-item">EPF Registrations</li>
                  <li className="s8-plan-list-item">ESI Registrations</li>
                </ul>
              </div>
            </div>

            <div className="s8-plan-footer">
              <button className="s8-plan-button">Buy Now</button>
            </div>
          </article>

          {/* ========== ENRICHED ========== */}
          <article className="s8-plan-card">
            <div>
              <div className="s8-plan-header">
                <div className="s8-plan-name">Enriched</div>
                <div className="s8-plan-price">₹9,999</div>
                <div className="s8-plan-meta">
                  Excluding gov fee <span className="s8-popular">Popular</span>
                </div>
              </div>

              <div className="s8-plan-body">
                <ul className="s8-plan-list">
                  <li className="s8-plan-list-item">Elemental Plan +</li>
                  <li className="s8-plan-list-item">Udyam Registration</li>
                  <li className="s8-plan-list-item">Share Certificate</li>
                  <li className="s8-plan-list-item">Commencement of Business</li>
                </ul>
              </div>
            </div>

            <div className="s8-plan-footer">
              <button className="s8-plan-button">Buy Now</button>
            </div>
          </article>

          {/* ========== SUPREME ========== */}
          <article className="s8-plan-card">
            <div>
              <div className="s8-plan-header">
                <div className="s8-plan-name">Supreme</div>
                <div className="s8-plan-price">₹24,999</div>
                <div className="s8-plan-meta">Excluding gov fee</div>
              </div>

              <div className="s8-plan-body">
                <ul className="s8-plan-list">
                  <li className="s8-plan-list-item">Enriched Plan +</li>
                  <li className="s8-plan-list-item">ITR Filing of 2 Directors</li>
                  <li className="s8-plan-list-item">ITR Filing of Company</li>
                  <li className="s8-plan-list-item">Prepairation of Directors Report</li>
                  <li className="s8-plan-list-item">Prepairation of Auditor Appointment Paperwork</li>
                  <li className="s8-plan-list-item">Prepairation of List of Shareholders</li>
                  <li className="s8-plan-list-item">Prepairation of Notice of AGM</li>
                  <li className="s8-plan-list-item">Prepairation of Notice of BM</li>
                  <li className="s8-plan-list-item">Prepairation of Extracts of AGM</li>
                  <li className="s8-plan-list-item">Prepairation and filing of AOC-4 (Financial Statements)</li>
                  <li className="s8-plan-list-item">Prepairation and filing of MGT-7 (Annual Return)</li>
                  <li className="s8-plan-list-item">Filing of ADT-1 (Auditor Appointment)</li>
                  <li className="s8-plan-list-item">Minutes of BM for 1st year</li>
                  <li className="s8-plan-list-item">Minutes of AGM for 1st year</li>
                  <li className="s8-plan-list-item">Maintenance of Statutory E-Registers</li>
                  <li className="s8-plan-list-item">DIR KYC - 2 Directors</li>
                  <li className="s8-plan-list-item">Audit fees are excluded and to be paid directly to the Auditor’s account.</li>
                </ul>
              </div>
            </div>

            <div className="s8-plan-footer">
              <button className="s8-plan-button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default Section8PlanAndPricing;
