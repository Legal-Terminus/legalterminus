import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./ShopRegPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "shop-elemental",
    name: "Elemental",
    oldPrice: "₹6,999",
    price: 5999,
    services: [
      "SHOP & ESTABLISHMENT Registration in ONE state (your choice)",
      "State portal account setup + filing",
      "Form drafting (state-specific)",
      "Document upload + fee payment coordination",
      "Registration Certificate delivery (PDF)",
      "Renewal cycle calendar (state-specific)",
      "Free SHOP & ESTABLISHMENT updates / changes for 1 year",
      "Govt fee at actuals (state-specific)",
    ],
  },
  {
    id: "shop-enriched",
    name: "Enriched",
    badge: "popular",
    oldPrice: "₹9,999",
    price: 7999,
    services: [
      "Everything in Elemental",
      "Preparation of Authorization letter for GST registration",
      "GST registration filing for 1 GSTIN (Regular scheme)",
      "HSN / SAC code mapping",
      "Aadhaar e-KYC coordination",
      "ARN tracking + GSTIN delivery",
      "GST certificate (REG-06) delivered as PDF",
      "Bank account validation pre-check",
    ],
  },
  {
    id: "shop-supreme",
    name: "Supreme",
    badge: "multistate",
    oldPrice: "₹12,999",
    price: 8999,
    services: [
      "Everything in Enriched",
      "Udyam Registration on udyamregistration.gov.in",
      "Aadhaar OTP + PAN verification coordination",
      "NIC code mapping",
      "Udyam Number + Certificate delivery (PDF)",
      "Email support during filing window",
    ],
  },
];

const ShopRegPlanandPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section shop-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your Shop &amp; Establishment at pocket-friendly prices
            </p>
          </header>

          <div className="pricing-cards">
            {PLANS.map((plan) => {
              const isPopular = plan.badge === "popular";
              const isMultiState = plan.badge === "multistate";
              const cardClass = [
                "plan-card",
                isPopular ? "plan-card--popular" : "",
                isMultiState ? "plan-card--fullservice" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article key={plan.id} className={cardClass}>
                  {isPopular && <div className="plan-popular-badge">★ MOST POPULAR</div>}
                  {isMultiState && <div className="plan-fullservice-badge">✦ MULTI-STATE</div>}
                  <div>
                    <div className="plan-header">
                      <div className="plan-name">{plan.name}</div>
                      <div className="plan-old-price">{plan.oldPrice}</div>
                      <div className="plan-price">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </div>
                      <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                    </div>
                    <div className="plan-body">
                      <ul className="plan-list">
                        {plan.services.map((s, i) => (
                          <li key={i} className="plan-list-item">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="plan-footer">
                    <button className="plan-button" onClick={() => setActivePlan(plan)}>
                      Buy Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          source="shop-establishment"
        />
      )}
    </>
  );
};

export default ShopRegPlanandPricing;
