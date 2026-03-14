import React from "react";
import "./AddPlanandPricing.css";

const AddPlanandPricing = () => {
  return (
    <section className="Add-pp-Add-pp-section">
      <div className="Add-pp-container">
        
        {/* Upper part */}
        <header className="Add-pp-header">
          <h2 className="Add-pp-Add-pp-title">CHOOSE YOUR PLAN</h2>
          <p className="Add-pp-subtitle">
            Add or remove a director (company) with pocket friendly-prices
          </p>
        </header>

        {/* Cards */}
        <div className="Add-pp-cards">

          {/* Elemental */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Elemental</div>
                <div className="Add-pp-price">₹1,499</div>
                <div className="Add-pp-meta">Including gov fee</div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition/ Cessation)</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            <div className="Add-pp-footer">
              <button className="Add-pp-button">Buy Now</button>
            </div>
          </article>

          {/* Enriched */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Enriched</div>
                <div className="Add-pp-price">₹3,499</div>
                <div className="Add-pp-meta">
                  Including gov fee <span className="popular">(Popular)</span>
                </div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition/ Cessation)</li>
                  <li className="Add-pp-list-item">DSC of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">DIN of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            <div className="Add-pp-footer">
              <button className="Add-pp-button">Buy Now</button>
            </div>
          </article>

          {/* Supreme */}
          <article className="Add-pp-card">
            <div>
              <div className="Add-pp-header">
                <div className="Add-pp-name">Supreme</div>
                <div className="Add-pp-price">₹4,999</div>
                <div className="Add-pp-meta">Including gov fee</div>
              </div>

              <div className="Add-pp-body">
                <ul className="Add-pp-list">
                  <li className="Add-pp-list-item">Filing of DIR 12 (Addition)</li>
                  <li className="Add-pp-list-item">DSC of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">DIN of 1 Proposed Director</li>
                  <li className="Add-pp-list-item">Filing of DIR 12 (Cessation)</li>
                  <li className="Add-pp-list-item">Preparation of Board Resolution</li>
                </ul>
              </div>
            </div>

            <div className="Add-pp-footer">
              <button className="Add-pp-button">Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default AddPlanandPricing;
