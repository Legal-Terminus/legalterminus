import React, { useState } from "react";
import "./ShopRegPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 999,
    services: [
      "Document Checklist & Verification",
      "Online Application Filing",
      "Government Fee Included (up to ₹600)",
      "Registration Certificate Delivery",
      "7–8 Working Days Processing",
      "Dedicated Expert Support",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 2499,
    services: [
      "Everything in Elemental",
      "Multiple Branch Registration Support",
      "Sign Board Compliance Guidance",
      "MSME / Udyam Registration Assistance",
      "Annual Renewal Reminder Service",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 4999,
    services: [
      "Everything in Enriched",
      "GST Registration Assistance",
      "Professional Tax Registration",
      "ESIC Registration Support",
      "Compliance Calendar for 1st Year",
      "Post-Registration Support (30 Days)",
    ],
  },
];

const ShopRegPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="shopreg-pricing-section">
        <div className="shopreg-pricing-container">

          <header className="shopreg-pricing-header">
            <h2 className="shopreg-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="shopreg-pricing-subtitle">
              Register your Shop &amp; Establishment at pocket-friendly prices
            </p>
          </header>

          <div className="shopreg-pricing-cards">

            {/* Elemental */}
            <article className="shopreg-plan-card">
              <div>
                <div className="shopreg-plan-header">
                  <div className="shopreg-plan-name">Elemental</div>
                  <div className="shopreg-plan-old-price">₹2,499</div>
                  <div className="shopreg-plan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="shopreg-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="shopreg-plan-body">
                  <ul className="shopreg-plan-list">
                    {PLANS[0].services.map((s, i) => (
                      <li key={i} className="shopreg-plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="shopreg-plan-footer">
                <button className="shopreg-plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            {/* Enriched — Most Popular */}
            <article className="shopreg-plan-card shopreg-plan-card--popular">
              <div className="shopreg-plan-popular-badge">★ MOST POPULAR</div>
              <div>
                <div className="shopreg-plan-header">
                  <div className="shopreg-plan-name">Enriched</div>
                  <div className="shopreg-plan-old-price">₹4,999</div>
                  <div className="shopreg-plan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="shopreg-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="shopreg-plan-body">
                  <ul className="shopreg-plan-list">
                    {PLANS[1].services.map((s, i) => (
                      <li key={i} className="shopreg-plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="shopreg-plan-footer">
                <button className="shopreg-plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme — Full Service */}
            <article className="shopreg-plan-card shopreg-plan-card--fullservice">
              <div className="shopreg-plan-fullservice-badge">✦ FULL-SERVICE</div>
              <div>
                <div className="shopreg-plan-header">
                  <div className="shopreg-plan-name">Supreme</div>
                  <div className="shopreg-plan-old-price">₹7,999</div>
                  <div className="shopreg-plan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="shopreg-plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="shopreg-plan-body">
                  <ul className="shopreg-plan-list">
                    {PLANS[2].services.map((s, i) => (
                      <li key={i} className="shopreg-plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="shopreg-plan-footer">
                <button className="shopreg-plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="shop-establishment" />
      )}
    </>
  );
};

export default ShopRegPlanandPricing;
