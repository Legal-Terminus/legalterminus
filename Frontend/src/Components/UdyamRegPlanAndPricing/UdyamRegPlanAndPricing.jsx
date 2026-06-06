import React, { useState } from "react";
import "./UdyamRegPlanAndPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 999,
    services: [
      "Udyam Registration on udyamregistration.gov.in",
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
    price: 5999,
    services: [
      "Everything in Enriched",
      "Trademark search across MCA + IPR + WIPO databases",
      "Trademark application drafting & filing (1 class)",
      "UDYAM/MSME 50% govt-fee subsidy on Trademark applied",
      "Class selection + goods/services description drafting",
      "Shop & Establishment registration for 1 state (state-specific)",
    ],
  },
];

const UdyamRegPlanAndPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="udyam-pricing-section">
        <div className="udyam-pricing-container">
          <header className="udyam-pricing-header">
            <h2 className="udyam-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="udyam-pricing-subtitle">
              Get your Udyam / MSME Registration done with pocket-friendly prices
            </p>
          </header>

          <div className="udyam-pricing-cards">

            {/* ELEMENTAL */}
            <article className="udyam-plan-card">
              <div className="udyam-plan-badge udyam-plan-badge--normal">★ NORMAL</div>
              <div>
                <div className="udyam-plan-header">
                  <div className="udyam-plan-name">Elemental</div>
                  <div className="udyam-plan-old-price">₹1,499</div>
                  <div className="udyam-plan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="udyam-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="udyam-plan-body">
                  <ul className="udyam-plan-list">
                    {PLANS[0].services.map((s, i) => (
                      <li className="udyam-plan-list-item" key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="udyam-plan-footer">
                <button className="udyam-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* ENRICHED */}
            <article className="udyam-plan-card udyam-plan-card--popular">
              <div className="udyam-plan-badge udyam-plan-badge--popular">★ MOST POPULAR</div>
              <div>
                <div className="udyam-plan-header">
                  <div className="udyam-plan-name">Enriched</div>
                  <div className="udyam-plan-old-price">₹3,999</div>
                  <div className="udyam-plan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="udyam-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="udyam-plan-body">
                  <ul className="udyam-plan-list">
                    {PLANS[1].services.map((s, i) => (
                      <li className="udyam-plan-list-item" key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="udyam-plan-footer">
                <button className="udyam-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            {/* SUPREME */}
            <article className="udyam-plan-card udyam-plan-card--fullservice">
              <div className="udyam-plan-badge udyam-plan-badge--fullservice">✦ FULL-SERVICE</div>
              <div>
                <div className="udyam-plan-header">
                  <div className="udyam-plan-name">Supreme</div>
                  <div className="udyam-plan-old-price">₹9,999</div>
                  <div className="udyam-plan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="udyam-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="udyam-plan-body">
                  <ul className="udyam-plan-list">
                    {PLANS[2].services.map((s, i) => (
                      <li className="udyam-plan-list-item" key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="udyam-plan-footer">
                <button className="udyam-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="udyam-registration" />
      )}
    </>
  );
};

export default UdyamRegPlanAndPricing;
