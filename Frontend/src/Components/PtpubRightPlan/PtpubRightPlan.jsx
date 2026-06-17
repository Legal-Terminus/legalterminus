import React, { useState } from "react";
import "./PtpubRightPlan.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";


const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "BASIC",
    badgeClass: "pub-plan-card--badged",
    oldPrice: 29999,
    price: 19999,
    services: [
      "Conversion eligibility & cap-table review",
      "Board & EGM documentation (notice, agenda, minutes)",
      "Special resolution drafting under Section 14",
      "MOA & AOA alteration (remove private restrictions)",
      "MGT-14 filing with the ROC",
      "INC-27 conversion application filing",
      "Fresh Certificate of Incorporation (new name)",
      "DSC coordination for directors",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    badgeClass: "pub-plan-card--badged",
    popular: true,
    oldPrice: 44999,
    price: 29999,
    services: [
      "Everything in Elemental",
      "Inducting members to reach the 7-shareholder minimum",
      "Appointing directors to reach the 3-director minimum",
      "Updated share certificates & statutory registers",
      "PAN / TAN & GST name-change updates",
      "Bank & licence record updates to the new name",
      "30-day post-conversion support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ 6-MONTH SERVICE",
    badgeClass: "pub-plan-card--badged",
    oldPrice: 66999,
    price: 44999,
    services: [
      "Everything in Enriched",
      "Annual ITR Filing — Company",
      "Financial Statements Filing — AOC-4",
      "Annual Return Filing — MGT-7",
      "Director KYC (DIR-3 KYC) for all directors",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ FULL-SERVICE 12-MONTH",
    badgeClass: "pub-plan-card--badged",
    oldPrice: 96999,
    price: 64999,
    services: [
      "Everything in Supreme",
      "Statutory Registers Pack (Members, Directors, Charges)",
      "First-year post-conversion ROC compliance calendar",
      "Directors' Report Preparation",
      "Minutes of Board & General Meetings (1st FY)",
      "Audit Committee & governance setup advisory",
      "DPT-3 & MSME-1 Filing (if applicable)",
      "Pre-IPO readiness consultation",
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
              Convert your company to a Public Limited with pocket-friendly prices
            </p>
          </header>

          {/* Cards */}
          <div className="pub-plan-cards">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`pub-plan-card${plan.badgeClass ? ` ${plan.badgeClass}` : ""}`}
              >
                {plan.badge && <div className="pub-plan-banner-badge">{plan.badge}</div>}
                <div>
                  <div className="pub-plan-card-header">
                      <div className="pub-plan-name">{plan.name}</div>
                    <div className="pub-plan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="pub-plan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="pub-plan-meta">+ Govt. fees &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-public" />
      )}
    </>
  );
};

export default PricingSection;
