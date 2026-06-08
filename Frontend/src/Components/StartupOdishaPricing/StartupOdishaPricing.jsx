import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 1,
    services: [
      "Startup Odisha portal registration",
      "Entity eligibility assessment",
      "Document checklist & verification",
      "Application preparation & filing",
      "Startup Odisha Recognition Certificate",
      "Business plan review & feedback",
      "Sector classification advisory",
      "Expert advisory call (30 min)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 5999,
    services: [
      "Everything in Elemental",
      "Capital subsidy application preparation",
      "Udyam / MSME Registration",
      "GST Registration Assistance",
      "Incubation centre application support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 9999,
    services: [
      "Everything in Enriched",
      "Capital subsidy claim management",
      "Odisha startup scheme documentation",
      "DPIIT Startup India recognition (dual benefit)",
      "Mentor network introduction & onboarding",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    price: 16999,
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

const StartupOdishaPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Get your Startup Odisha recognition with pocket-friendly plans
            </p>
          </header>

          <div className="pricing-cards">

            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-old-price">₹3,999</div>
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
                  <div className="plan-old-price">₹8,999</div>
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
                  <div className="plan-old-price">₹14,999</div>
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
                  <div className="plan-old-price">₹25,999</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="startup-odisha" />
      )}
    </>
  );
};

export default StartupOdishaPricing;
