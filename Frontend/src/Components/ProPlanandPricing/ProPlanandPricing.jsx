import React, { useState } from "react";
import "./ProPlanandPricing.css";
import ProCheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 999,
    services: ["Udyam Registration"],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 2499,
    popular: true,
    services: ["Udyam Registration", "GST Registration"],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 7999,
    services: ["Udyam Registration", "GST Registration", "Trademark Application"],
  },
];

const ProPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          {/* Upper part */}
          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your proprietorship firm with pocket-friendly prices
            </p>
          </header>

          {/* Cards */}
          <div className="pricing-cards">

            {/* Elemental */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-price">₹999</div>
                  <div className="plan-meta">Excluding gov fee</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Udyam Registration</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>
                  Buy Now
                </button>
              </div>
            </article>

            {/* Enriched */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Enriched</div>
                  <div className="plan-price">₹2,499</div>
                  <div className="plan-meta">
                    Excluding gov fee <span className="popular">(Popular)</span>
                  </div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Udyam Registration</li>
                    <li className="plan-list-item">GST Registration</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[1])}>
                  Buy Now
                </button>
              </div>
            </article>

            {/* Supreme */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme</div>
                  <div className="plan-price">₹7,999</div>
                  <div className="plan-meta">Excluding gov fee</div>
                </div>

                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Udyam Registration</li>
                    <li className="plan-list-item">GST Registration</li>
                    <li className="plan-list-item">Trademark Application</li>
                  </ul>
                </div>
              </div>

              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>
                  Buy Now
                </button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <ProCheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />
      )}
    </>
  );
};

export default ProPlanandPricing;
