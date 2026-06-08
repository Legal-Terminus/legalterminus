import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import "./StartupIndiaPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 4999,
    price: 2999,
    services: [
      "Eligibility check (entity type, age, turnover, innovation)",
      "Innovation pitch / business write-up checking",
      "DPIIT application filing",
      "Document curation + upload (incorporation, business plan, IP)",
      "DPIIT recognition certificate delivery (3-5 days)",
      "Innovation-tag mapping (IT / DeepTech / Social etc.)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    oldPrice: 8999,
    price: 5999,
    services: [
      "Everything in Elemental",
      "Preparation of Authorization letter for organizational DSC",
      "Processing of Organizational DSC",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    oldPrice: 10999,
    price: 7499,
    services: [
      "Everything in Enriched",
      "Trademark Search Report",
      "Form TM-A Filing (1 Class)",
      "Government Filing Fee (Individuals/MSME/Startups: ₹4,500 | Companies: ₹9,000)",
      "TM Application Challan and acknowledgement provided",
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

          <div className="pricing-cards si-three-plans">

            <article className="plan-card">
              <div className="plan-normal-badge">NORMAL</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-old-price">Rs.{PLANS[0].oldPrice.toLocaleString("en-IN")}</div>
                  <div className="plan-price">Rs.{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
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
                  <div className="plan-old-price">Rs.{PLANS[1].oldPrice.toLocaleString("en-IN")}</div>
                  <div className="plan-price">Rs.{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
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

            <article className="plan-card plan-card--fullservice">
              <div className="plan-fullservice-badge">✦ FULL SERVICE</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme</div>
                  <div className="plan-old-price">Rs.{PLANS[2].oldPrice.toLocaleString("en-IN")}</div>
                  <div className="plan-price">Rs.{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
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
