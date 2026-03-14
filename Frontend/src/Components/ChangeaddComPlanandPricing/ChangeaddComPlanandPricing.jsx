import React from "react";
import "./ChangeaddComPlanandPricing.css";

const ChangeaddComPlanandPricing = () => {
  return (
    <section className="change-add-pppricing-section">
      <div className="change-add-ppcontainer">
        
        {/* Upper part */}
        <header className="change-add-ppheader">
          <h2 className="change-add-pppricing-title">CHOOSE YOUR PLAN</h2>
          <p className="change-add-ppsubtitle">
            Register your company with pocket-friendly prices
          </p>
        </header>

        {/* Cards */}
        <div className="change-add-ppcards">

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
