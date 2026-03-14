import React from "react";
import "./ChangeaddComPlanandPricing.css";

const ChangeaddComPlanandPricing = () => {
  return (
    <section className="Change-addCom-pricing-section">
      <div className="pricing-container">
        
        {/* Upper part */}
        <header className="pricing-header">
          <br></br>
          <br></br>
          <h2 className="Change-addCom-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="pricing-subtitle">
            Change Registered Office Address (Company) with pocket friendly-prices.
          </p>
        </header>

        {/* Cards */}
        <div className="pricing-cards">

          {/* Elemental */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Elemental</div>
                <div className="plan-price">₹1,499</div>
                <div className="plan-meta">Including gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Within same City Govt Fee Included</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Enriched</div>
                <div className="plan-price">₹3,999</div>
                <div className="plan-meta">
                  Including gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">Within same State, however one city to another city Govt Fee Included</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="plan-card">
            <div>
              <div className="plan-header">
                <div className="plan-name">Supreme</div>
                <div className="plan-price">₹19,999</div>
                <div className="plan-meta">Excluding gov fee</div>
              </div>

              <div className="plan-body">
                <ul className="plan-list">
                  <li className="plan-list-item">One State to another State</li>
                </ul>
              </div>
            </div>

            <div className="plan-footer">
              <button className="plan-button">Buy Now</button>
            </div>
          </article>
          <br></br>
        </div>
      </div>
    </section>
  );
};

export default ChangeaddComPlanandPricing;
