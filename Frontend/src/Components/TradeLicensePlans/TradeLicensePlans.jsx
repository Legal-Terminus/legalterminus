import React, { useState } from "react";
import "./TradeLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 3999,
    price: 2999,
    services: [
      "City + trade-category identification",
      "Municipal portal account setup (city-specific)",
      "Application drafting + KOB / trade-code mapping",
      "Documents curation (PAN, premises proof, NOC, etc.)",
      "Government fee computation + payment coordination",
      "Filing on the relevant ULB portal",
      "Trade License Certificate delivery",
      "Annual renewal reminder (90 / 30 / 7 days before expiry)",
      "Govt fee at actuals",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 5499,
    price: 3999,
    services: [
      "Everything in Elemental",
      "Udyam Registration on udyamregistration.gov.in",
      "Aadhaar OTP + PAN verification coordination",
      "NIC code mapping",
      "Udyam Number + Certificate delivery (PDF)",
      "Email support during filing window",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 7999,
    price: 5999,
    services: [
      "Everything in Enriched",
      "GST Registration filing for 1 GSTIN (Regular scheme)",
      "HSN / SAC code mapping",
      "ARN tracking + GSTIN delivery support for 1 year",
      "90-day priority compliance helpline",
      "Govt fee at actuals across all licenses",
      "GST invoice template + first-month walkthrough",
      "Bank account validation pre-check",
      "30-day post-registration support",
    ],
  },
];

const TradeLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="trade-pricing-section">
        <div className="tradepricing-container">
          {/* Header Section */}
          <header className="tradepricing-header">
            <h2 className="tradepricing-title">CHOOSE YOUR PLAN</h2>
            <p className="tradepricing-subtitle">
              Register your Trade License with pocket-friendly prices
            </p>
          </header>

          {/* Pricing Cards */}
          <div className="tradepricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`tradeplan-card${plan.popular ? " tradeplan-card--popular" : ""}`}
              >
                <div>
                  <div className="tradeplan-header">
                    {plan.badge && (
                      <div className={`tradeplan-badge${plan.popular ? " tradeplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="tradeplan-name">{plan.name}</div>
                    <div className="tradeplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="tradeplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="tradeplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="tradeplan-body">
                    <ul className="tradeplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="tradeplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="tradeplan-footer">
                  <button
                    className={`tradeplan-button${plan.popular ? " tradeplan-button--popular" : ""}`}
                    onClick={() => setActivePlan(plan)}
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trade-license" />
      )}
    </>
  );
};

export default TradeLicensePlans;
