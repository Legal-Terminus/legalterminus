import React from "react";
import "./DissolveLLPPlanAndPricing.css";

const DissolveLLPPlanAndPricing = () => {
  return (
    <section className="Dissllp-pricing-section">
      <div className="Dissllp-pricing-container">

        {/* ================= HEADER ================= */}
        <header className="Dissllp-pricing-header">
          <h2 className="Dissllp-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="Dissllp-pricing-subtitle">
            Dissolve a Limited Liability Partnership with pocket friendly-prices
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="Dissllp-pricing-cards">

          {/* ========== ELEMENTAL ========== */}
          <article className="Dissllp-plan-card">
            <div>
              <div className="Dissllp-plan-header">
                <div className="Dissllp-plan-name">Elemental</div>
                <div className="Dissllp-plan-price">₹18,999</div>
                <div className="Dissllp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="Dissllp-plan-body">
                <ul className="Dissllp-plan-list">
                  <li className="Dissllp-plan-list-item">The LLP having Nil Transactions</li>
                </ul>
              </div>
            </div>

            <div className="Dissllp-plan-footer">
              <button className="Dissllp-plan-button">Buy Now</button>
            </div>
          </article>

          {/* ========== ENRICHED (POPULAR) ========== */}
          <article className="Dissllp-plan-card">
            <div>
              <div className="Dissllp-plan-header">
                <div className="Dissllp-plan-name">Enriched</div>
                <div className="Dissllp-plan-price">₹23,999</div>
                <div className="Dissllp-plan-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Dissllp-plan-body">
                <ul className="Dissllp-plan-list">
                  <li className="Dissllp-plan-list-item">The LLP having Nil Transactions</li>
                  <li className="Dissllp-plan-list-item">Annual filing (LLP 11 & LLP 8) for 1 Year</li>
                  <li className="Dissllp-plan-list-item">ITR of LLP for 1 Year</li>
                </ul>
              </div>
            </div>

            <div className="Dissllp-plan-footer">
              <button className="Dissllp-plan-button">Buy Now</button>
            </div>
          </article>

          {/* ========== SUPREME ========== */}
          <article className="Dissllp-plan-card">
            <div>
              <div className="Dissllp-plan-header">
                <div className="Dissllp-plan-name">Supreme</div>
                <div className="Dissllp-plan-price">₹26,999</div>
                <div className="Dissllp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="Dissllp-plan-body">
                <ul className="Dissllp-plan-list">
                  <li className="Dissllp-plan-list-item">The LLP having Nil Transactions</li>
                  <li className="Dissllp-plan-list-item">Annual filing (AOC 4 & MGT 7) for 1 Year</li>
                  <li className="Dissllp-plan-list-item">ITR of LLP for 1 Year</li>
                  <li className="Dissllp-plan-list-item">Commencement of Business</li>
                  <li className="Dissllp-plan-list-item">GST Cancellation</li>
                  <li className="Dissllp-plan-list-item">GST Final Return Filing (GSTR -10)</li>
                </ul>
              </div>
            </div>

            <div className="Dissllp-plan-footer">
              <button className="Dissllp-plan-button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default DissolveLLPPlanAndPricing;
