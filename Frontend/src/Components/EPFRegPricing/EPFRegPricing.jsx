import React, { useState } from "react";
import "../PvtltdPlanandPricing/PvtltdPlanandPricing.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    price: 1499,
    services: [
      "EPF Registration with EPFO Portal",
      "UAN Generation for up to 5 Employees",
      "Digital Signature (if required)",
      "EPFO Login Credentials Setup",
      "Establishment Registration Certificate",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    price: 2999,
    services: [
      "Everything in Elemental",
      "ESI Registration",
      "UAN Activation for All Employees",
      "Monthly ECR Filing (1 Month)",
      "Salary Structure Advisory",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    price: 5999,
    services: [
      "Everything in Enriched",
      "Quarterly ECR Filing Support",
      "PF Withdrawal Assistance",
      "Annual PF Audit Support",
      "Employee Transfer Claim Support",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    price: 9999,
    services: [
      "Everything in Supreme",
      "Annual Compliance Management",
      "EPFO Inspection Support",
      "Employee Exit PF Settlement",
      "Dedicated Account Manager",
    ],
  },
];

const EPFRegPricing = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pvtltd-pricing-section">
        <div className="pricing-container">

          <header className="pricing-header">
            <h2 className="PvtLtd-pricing-title">CHOOSE YOUR PLAN</h2>
            <p className="pricing-subtitle">
              Register your EPF with expert support at every step
            </p>
          </header>

          <div className="pricing-cards">

            {/* Elemental */}
            <article className="plan-card">
              <div>
                <div className="plan-header">
                  <div className="plan-name">Elemental</div>
                  <div className="plan-old-price">₹2,999</div>
                  <div className="plan-price">₹{PLANS[0].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[0].services.map((s) => (
                      <li key={s} className="plan-list-item">{s}</li>
                    ))}
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
                  <div className="plan-old-price">₹4,999</div>
                  <div className="plan-price">₹{PLANS[1].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[1].services.map((s) => (
                      <li key={s} className="plan-list-item">{s}</li>
                    ))}
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
                  <div className="plan-price">₹{PLANS[2].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[2].services.map((s) => (
                      <li key={s} className="plan-list-item">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => setActivePlan(PLANS[2])}>Buy Now</button>
              </div>
            </article>

            {/* Supreme Plus */}
            <article className="plan-card plan-card--fullservice">
              <div className="plan-fullservice-badge">✦ FULL-SERVICE</div>
              <div>
                <div className="plan-header">
                  <div className="plan-name">Supreme Plus</div>
                  <div className="plan-old-price">₹14,999</div>
                  <div className="plan-price">₹{PLANS[3].price.toLocaleString("en-IN")}</div>
                  <div className="plan-meta">+ Govt. fees &amp; GST extra</div>
                </div>
                <div className="plan-body">
                  <ul className="plan-list">
                    {PLANS[3].services.map((s) => (
                      <li key={s} className="plan-list-item">{s}</li>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="epf-registration" />
      )}
    </>
  );
};

export default EPFRegPricing;
