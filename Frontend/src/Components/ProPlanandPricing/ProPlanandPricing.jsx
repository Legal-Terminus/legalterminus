import React, { useState } from "react";
import "./ProPlanandPricing.css";
import ProCheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 999,
    services: [
      "MSME / Udyam Registration (free, instant)",
      "Aadhaar OTP + PAN verification coordination",
      "NIC code mapping",
      "Udyam Number + Certificate delivery (PDF)",
      "Email support during filing window",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 2999,
    services: [
      "Everything in Elemental",
      "GST Registration filing for 1 GSTIN (Regular scheme)",
      "HSN / SAC code mapping",
      "ARN tracking + GSTIN delivery",
      "GST invoice template + first-month walkthrough",
      "Bank account validation pre-check",
      "30-day post-registration support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 7499,
    services: [
      "Everything in Enriched",
      "GST invoice template + e-invoicing readiness check",
      "GSTR-1 + GSTR-3B filing assistance (3 months)",
      "Shop & Establishment registration (state-specific)",
    ],
  },
];

const ProPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your proprietorship firm with pocket-friendly prices
            </p>
          </header>

          <div className="pricing-cards">

            {/* Elemental */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-old-price">₹1,499</div>
                  <div className="plan-price">₹999</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">MSME / Udyam Registration (free, instant)</li>
                    <li className="plan-list-item">Aadhaar OTP + PAN verification coordination</li>
                    <li className="plan-list-item">NIC code mapping</li>
                    <li className="plan-list-item">Udyam Number + Certificate delivery (PDF)</li>
                    <li className="plan-list-item">Email support during filing window</li>
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* Enriched */}
            <article className="plan-card plan-card--popular">
              <div className="plan-popular-badge">★ MOST POPULAR</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Enriched</div>
                  <div className="plan-old-price">₹3,999</div>
                  <div className="plan-price">₹2,999</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Everything in Elemental</li>
                    <li className="plan-list-item">GST Registration filing for 1 GSTIN (Regular scheme)</li>
                    <li className="plan-list-item">HSN / SAC code mapping</li>
                    <li className="plan-list-item">ARN tracking + GSTIN delivery</li>
                    <li className="plan-list-item">GST invoice template + first-month walkthrough</li>
                    <li className="plan-list-item">Bank account validation pre-check</li>
                    <li className="plan-list-item">30-day post-registration support</li>
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme</div>
                  <div className="plan-old-price">₹9,999</div>
                  <div className="plan-price">₹7,499</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    <li className="plan-list-item">Everything in Enriched</li>
                    <li className="plan-list-item">GST invoice template + e-invoicing readiness check</li>
                    <li className="plan-list-item">GSTR-1 + GSTR-3B filing assistance (3 months)</li>
                    <li className="plan-list-item">Shop &amp; Establishment registration (state-specific)</li>
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <ProCheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="proprietorship" />
      )}
    </>
  );
};

export default ProPlanandPricing;
