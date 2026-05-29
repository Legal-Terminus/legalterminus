import React, { useState } from "react";
import "./DissolvePrivatePlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  { id: "elemental", name: "Elemental", price: 18999, services: ["The Company having Nil Transactions"] },
  { id: "enriched", name: "Enriched", price: 23999, services: ["The Company having Nil Transactions", "Annual filing (AOC 4 & MGT 7) for 1 Year", "ITR of Company for 1 Year"] },
  { id: "supreme", name: "Supreme", price: 26999, services: ["The Company having Nil Transactions", "Annual filing (AOC 4 & MGT 7) for 1 Year", "ITR of Company for 1 Year", "Commencement of Business", "GST Cancellation", "GST Final Return Filing (GSTR -10)"] }
];

const DissolvePrivatePlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (

    <>
    <section className="DissolvePrivate-pricing-section">
      <div className="DissolvePrivate-pricing-container">

        {/* ================= HEADER ================= */}
        <header className="DissolvePrivate-pricing-header">
          <h2 className="DissolvePrivate-pricing-title">CHOOSE YOUR PLAN</h2>
          <p className="DissolvePrivate-pricing-subtitle">
            Dissolve a Private Limited Company with pocket friendly-prices
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="DissolvePrivate-pricing-cards">

          {/* ========== ELEMENTAL ========== */}
          <article className="DissolvePrivate-plan-card">
            <div>
              <div className="DissolvePrivate-plan-header">
                <div className="DissolvePrivate-plan-name">Elemental</div>
                <div className="DissolvePrivate-plan-price">{PLANS[0].price.toLocaleString("en-IN")}</div>
                <div className="DissolvePrivate-plan-meta">Excluding gov fee</div>
              </div>

              <div className="DissolvePrivate-plan-body">
                <ul className="DissolvePrivate-plan-list">
                  <li className="DissolvePrivate-plan-list-item">The Company having Nil Transactions</li>
                </ul>
              </div>
            </div>

            <div className="DissolvePrivate-plan-footer">
              <button className="DissolvePrivate-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
            </div>
          </article>

          {/* ========== ENRICHED (POPULAR) ========== */}
          <article className="DissolvePrivate-plan-card">
            <div>
              <div className="DissolvePrivate-plan-header">
                <div className="DissolvePrivate-plan-name">Enriched</div>
                <div className="DissolvePrivate-plan-price">{PLANS[1].price.toLocaleString("en-IN")}</div>
                <div className="DissolvePrivate-plan-meta">
                  Excluding gov fee <span className="DissolvePrivate-popular">(Popular)</span>
                </div>
              </div>

              <div className="DissolvePrivate-plan-body">
                <ul className="DissolvePrivate-plan-list">
                  <li className="DissolvePrivate-plan-list-item">The Company having Nil Transactions</li>
                  <li className="DissolvePrivate-plan-list-item">Annual filing (AOC 4 & MGT 7) for 1 Year</li>
                  <li className="DissolvePrivate-plan-list-item">ITR of Company for 1 Year</li>
                </ul>
              </div>
            </div>

            <div className="DissolvePrivate-plan-footer">
              <button className="DissolvePrivate-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
            </div>
          </article>

          {/* ========== SUPREME ========== */}
          <article className="DissolvePrivate-plan-card">
            <div>
              <div className="DissolvePrivate-plan-header">
                <div className="DissolvePrivate-plan-name">Supreme</div>
                <div className="DissolvePrivate-plan-price">{PLANS[2].price.toLocaleString("en-IN")}</div>
                <div className="DissolvePrivate-plan-meta">Excluding gov fee</div>
              </div>

              <div className="DissolvePrivate-plan-body">
                <ul className="DissolvePrivate-plan-list">
                  <li className="DissolvePrivate-plan-list-item">The Company having Nil Transactions</li>
                  <li className="DissolvePrivate-plan-list-item">Annual filing (AOC 4 & MGT 7) for 1 Year</li>
                  <li className="DissolvePrivate-plan-list-item">ITR of Company for 1 Year</li>
                  <li className="DissolvePrivate-plan-list-item">Commencement of Business</li>
                  <li className="DissolvePrivate-plan-list-item">GST Cancellation</li>
                  <li className="DissolvePrivate-plan-list-item">GST Final Return Filing (GSTR -10)</li>
                </ul>
              </div>
            </div>

            <div className="DissolvePrivate-plan-footer">
              <button className="DissolvePrivate-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
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

export default DissolvePrivatePlanAndPricing;
