import React, { useState } from "react";
import "./LLPPlanandPrice.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 4999,
    price: 3499,
    services: [
      "Name Availability Search Report",
      "RUN-LLP name reservation (2 attempts)",
      "DPIN application for 2 designated partners (via FiLLiP)",
      "Standard LLP Agreement drafting",
      "FiLLiP filing (incorporation)",
      "PAN + TAN application coordination",
      "Certificate of Incorporation (COI) delivery",
      "e-PAN & e-TAN",
      "Form 3 filing within 30 days (post-incorp)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 7999,
    price: 6499,
    services: [
      "Everything in Elemental",
      "UDYAM / MSME Registration",
      "Bank Account Opening Documents",
      "GST Registration Assistance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 17999,
    price: 19999,
    services: [
      "Everything in Enriched",
      "Trademark search + Class application (1 class, govt fee extra)",
      "Startup India / DPIIT registration assistance",
      "Form 11 + Form 8 first-year filing assistance (govt fee extra)",
      "Form 8 first-year filing assistance (govt fee extra)",
      "Annual ITR Filing — LLP",
      "ITR Filing for 2 Designated Partners",
    ],
  },
];

const LLPPlanandPrice = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="LLP-Plan-Price-section">
        <div className="LLP-Plan-pricing-container">

          <header className="LLP-Plan-pricing-header">
            <h2 className="LLP-Plan-Price-title">CHOOSE YOUR PLAN</h2>
            <p className="LLP-Plan-pricing-subtitle">
              Register your LLP with pocket-friendly prices
            </p>
          </header>

          <div className="LLP-Plan-pricing-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`LLP-Plan--card${plan.popular ? " LLP-Plan--card-popular" : ""}`}
              >
                <div>
                  <div className="LLP-Plan--header">
                    {plan.badge && (
                      <div className={`LLP-Plan--badge${plan.popular ? " LLP-Plan--badge-popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="LLP-Plan--name">{plan.name}</div>
                    <div className="LLP-Plan--old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="LLP-Plan--price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="LLP-Plan--meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="LLP-Plan--body">
                    <ul className="LLP-Plan--list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="LLP-Plan--list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="LLP-Plan--footer">
                  <button
                    className={`LLP-Plan--button${plan.popular ? " LLP-Plan--button-popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="llp-registration" />
      )}
    </>
  );
};

export default LLPPlanandPrice;
