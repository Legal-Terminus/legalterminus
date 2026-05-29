import React, { useState } from "react";
import "./DissolveLLPPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 18999, services: ["The LLP having Nil Transactions"] },
  { id: "enriched", name: "Enriched", price: 23999, services: ["The LLP having Nil Transactions", "Annual filing (LLP 11 & LLP 8) for 1 Year", "ITR of LLP for 1 Year"] },
  { id: "supreme", name: "Supreme", price: 26999, services: ["The LLP having Nil Transactions", "Annual filing (AOC 4 & MGT 7) for 1 Year", "ITR of LLP for 1 Year", "Commencement of Business", "GST Cancellation", "GST Final Return Filing (GSTR -10)"] }
];

const DissolveLLPPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
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
                <div className="Dissllp-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="Dissllp-plan-meta">Excluding gov fee</div>
              </div>

              <div className="Dissllp-plan-body">
                <ul className="Dissllp-plan-list">
                  <li className="Dissllp-plan-list-item">The LLP having Nil Transactions</li>
                </ul>
              </div>
            </div>

            <div className="Dissllp-plan-footer">
              <button className="Dissllp-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* ========== ENRICHED (POPULAR) ========== */}
          <article className="Dissllp-plan-card">
            <div>
              <div className="Dissllp-plan-header">
                <div className="Dissllp-plan-name">Enriched</div>
                <div className="Dissllp-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
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
              <button className="Dissllp-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* ========== SUPREME ========== */}
          <article className="Dissllp-plan-card">
            <div>
              <div className="Dissllp-plan-header">
                <div className="Dissllp-plan-name">Supreme</div>
                <div className="Dissllp-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
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
              <button className="Dissllp-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
            </div>
          </article>

        </div>
      </div>
    </section>


      {activePlan && (

        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />

      )}

    </>

  );};

export default DissolveLLPPlanAndPricing;
