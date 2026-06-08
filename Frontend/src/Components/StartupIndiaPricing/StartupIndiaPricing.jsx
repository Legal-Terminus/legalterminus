import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 1,
    services: [
      "DPIIT Startup India Application Filing",
      "Document checklist & verification",
      "Entity incorporation certificate review",
      "Startup India portal registration",
      "DPIIT Recognition Certificate delivery",
      "Business description & innovation summary drafting",
      "Category classification (Technology / Non-Technology)",
      "Expert advisory call (30 min)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 4999,
    services: [
      "Everything in Elemental",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
      "80-IAC tax holiday eligibility assessment",
      "Startup India profile & pitch deck guidance",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 8999,
    services: [
      "Everything in Enriched",
      "Section 80-IAC Tax Holiday Application (IMB)",
      "Angel tax exemption documentation (Form 2)",
      "Fast-track patent filing assistance (80% fee rebate)",
      "Self-certification drafts under labour & environment laws",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    price: 14999,
    services: [
      "Everything in Supreme",
      "Annual ITR Filing — Startup entity",
      "Annual compliance filing (ROC / MCA)",
      "Directors' Report & Board Minutes (1st FY)",
      "Statutory E-Register Maintenance",
      "ITR Filing for 2 Directors / Partners",
    ],
  },
];

const StartupIndiaPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Get your Startup India recognition with pocket-friendly plans
            </p>
          </header>

          <div className="pricing-cards">

            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-old-price">₹2,999</div>
                  <div className="plan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[0].services.map((s, i) => (
                      <li key={i} className="plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[0])}>Buy Now</button>
              </div>
            </article>

            <article className="plan-card plan-card--popular">
              <div className="plan-popular-badge">★ MOST POPULAR</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Enriched</div>
                  <div className="plan-old-price">₹7,999</div>
                  <div className="plan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[1].services.map((s, i) => (
                      <li key={i} className="plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[1])}>Buy Now</button>
              </div>
            </article>

            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme</div>
                  <div className="plan-old-price">₹13,999</div>
                  <div className="plan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[2].services.map((s, i) => (
                      <li key={i} className="plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

            <article className="plan-card plan-card--fullservice">
              <div className="plan-fullservice-badge">✦ FULL-SERVICE</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme Plus</div>
                  <div className="plan-old-price">₹22,999</div>
                  <div className="plan-price">₹{PLANS[3].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[3].services.map((s, i) => (
                      <li key={i} className="plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[3])}>Buy Now</button>
              </div>
            </article>

          </div>
        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="startup-india" />
      )}
    </>
  );
};

export default StartupIndiaPricing;
