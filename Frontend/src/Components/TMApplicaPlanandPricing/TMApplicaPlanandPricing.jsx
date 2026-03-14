import React from "react";
import "./TMApplicaPlanandPricing.css";

const PricingSection = () => {
  return (
    <section className="Tm-Tm-Applica-pricing-section">
      <div className="Tm-Applica-pricing-container">
        
        {/* Upper part */}
        <header className="Tm-Applica-pricing-header">
          <h2 className="Tm-Tm-Applica-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="Tm-Applica-pricing-subtitle">
            PROTECT YOUR BRAND WITH POCKET-FRIENDLY PRICES
          </p>
        </header>

        {/* Cards */}
        <div className="Tm-Applica-pricing-cards">

          {/* Elemental */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Elemental</div>
                <div className="plan-old-price">₹4,999</div>
                <div className="Applica-price">₹1,499</div>
                <div className="Applica-meta">Excluding gov fee</div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Trademark Search Report</li>
                  <li className="Applica-list-item">Form TM-A Filing (1 Class)</li>
                  <li className="Applica-list-item">Government Filing Fee (Individuals/MSME: ₹4,500 | Companies: ₹9,000)</li>
                  <li className="Applica-list-item">TM Application Number</li>
                  <li className="Applica-list-item">Use of ™ Symbol Immediately After Filing</li>
                </ul>
              </div>
            </div>

            <div className="Applica-footer">
              <button className="Applica-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Enriched</div>
                <div className="plan-old-price">₹9,999</div>
                <div className="Applica-price">₹7,499</div>
                <div className="Applica-meta">
                  Excluding gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Elemental Plan Plus</li>
                  <li className="Applica-list-item">Reply to Examination Report (if objection)</li>
                  <li className="Applica-list-item">Hearing Representation (1 instance)</li>
                  <li className="Applica-list-item">Udyam/MSME Registration (if applicable)</li>
                </ul>
              </div>
            </div>

            <div className="Applica-footer">
              <button className="Applica-button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="Applica-card">
            <div>
              <div className="Applica-header">
                <div className="Applica-name">Supreme</div>
                <div className="plan-old-price">₹19,999</div>
                <div className="Applica-price">₹24,499</div>
                <div className="Applica-meta">Excluding gov fee</div>
              </div>

              <div className="Applica-body">
                <ul className="Applica-list">
                  <li className="Applica-list-item">Enriched Plan Plus</li>
                  <li className="Applica-list-item">Opposition Handling Support (1 instance)</li>
                  <li className="Applica-list-item">Opposition Hearing Representation</li>
                  <li className="Applica-list-item">Renewal Reminder before 10-year expiry</li>
                  <li className="Applica-list-item">Certificate of Trademark Registration</li>
                </ul>
              </div>
            </div>

            <div className="Applica-footer">
              <button className="Applica-button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
