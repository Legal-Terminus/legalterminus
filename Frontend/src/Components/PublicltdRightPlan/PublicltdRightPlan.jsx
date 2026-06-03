import React, { useState } from "react";
import "./PublicltdRightPlan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "★ BASIC",
    oldPrice: 29999,
    price: 19999,
    discount: "33% off",
    services: [
      "Name Availability Search Report",
      "SPICe+ Part A name reservation (2 attempts)",
      "DIN application for up to 3 directors (via SPICe+)",
      "DSC preparation coordination for all (3 dirs + 7 subscribers)",
      "MOA & AOA drafting (standard template)",
      "SPICe+ Part B + AGILE-PRO-S filing",
      "Certificate of Incorporation (COI) delivery",
      "e-PAN & e-TAN",
      "e-MOA & e-AOA",
      "EPF & ESI Registration",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    oldPrice: 44999,
    price: 29999,
    discount: "33% off",
    popular: true,
    services: [
      "Everything in Elemental",
      "First Board Meeting kit (notice, agenda, minutes draft)",
      "1st Auditor Appointment Docs and form filing",
      "Bank account opening assistance",
      "GSTIN allotment (1 state)",
      "INC-20A filing assistance (govt fee extra)",
      "Issuance of Share Certificate",
      "Udyam / MSME Registration",
      "30-day post-incorporation support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ 6 MONTH SERVICE",
    oldPrice: 66999,
    price: 44999,
    discount: "33% off",
    services: [
      "Everything in Enriched",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Auditor Appointment Filing in 1st AGM — ADT-1",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE",
    oldPrice: 96999,
    price: 64999,
    discount: "33% off",
    services: [
      "Everything in Supreme",
      "Statutory Registers Pack (Members, Directors, Charges)",
      "First-year ROC compliance calendar + e-filing setup",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Statutory E-Register Maintenance",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "ITR Filing for 2 Directors",
      "Trademark search + Class application (1 class, govt fee extra)",
      "90-day priority CS / CA helpline",
    ],
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="pub-plan-section">
        <div className="pub-plan-container">

          {/* Header */}
          <header className="pub-plan-header">
            <h2 className="pub-plan-title">CHOOSE YOUR PLAN</h2>
            <p className="pub-plan-subtitle">
              Register your company with pocket-friendly prices
            </p>
          </header>

          {/* Cards */}
          <div className="pub-plan-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`pub-plan-card${plan.popular ? " pub-plan-card--popular" : ""}`}
              >
                <div>
                  <div className="pub-plan-card-header">
                    <div className={`pub-plan-badge${plan.popular ? " pub-plan-badge--popular" : ""}`}>
                      {plan.badge}
                    </div>
                    <div className="pub-plan-name">{plan.name}</div>
                    <div className="pub-plan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="pub-plan-discount-row">
                      <span className="pub-plan-discount">{plan.discount}</span>
                      <span className="pub-plan-price">₹{plan.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="pub-plan-meta">Professional fee only &nbsp;•&nbsp; + 18% GST</div>
                  </div>

                  <div className="pub-plan-body">
                    <ul className="pub-plan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="pub-plan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pub-plan-footer">
                  <button
                    className={`pub-plan-button${plan.popular ? " pub-plan-button--popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="public-limited-company" />
      )}
    </>
  );
};

export default PricingSection;
