import { useState } from "react";
import "./TmarkPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "PROPOSED-TO-BE-USED",
    oldPrice: 2249,
    price: 1499,
    services: [
      "Name search up to 5 names (IP India database)",
      "Preparing objects / goods + services descriptions",
      "Preparing Power of Attorney (Form TM-48)",
      "Filing TM-A application on IP India portal",
      "Client confirmation before final submission",
      "Final submission of TM-A application",
      "Government fee submission (per class at actuals)",
      "Acknowledgement + Challan emailed to client",
      "Monthly status update of the application (life time)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ PRIOR USE OF MARK",
    popular: true,
    oldPrice: 3749,
    price: 2499,
    services: [
      "Everything in Elemental",
      "Additional name search up to 5 names (IP India database)",
      "PREPARE USER AFFIDAVIT (Statement of use)",
      "Coordination for EVIDENCE OF PRIOR USE",
      "(invoices, advertisements, packaging, online presence, social media history, GST records, etc.)",
      "Date-of-first-use declaration on TM-A",
      "Stronger claim against future similar-mark filings",
      "All other Elemental features apply",
      "Monthly status update of the application (life time)",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ WITH DEPT QUERY HANDLING",
    oldPrice: 9749,
    price: 6499,
    services: [
      "Everything in Elemental + Enriched",
      "UDYAM CERTIFICATE UPDATE (or fresh Udyam application)",
      "(unlocks 50% government-fee rebate — ₹4,500 instead of ₹9,000)",
      "DEPARTMENTAL QUERY HANDLING (max 2 times)",
      "(Examination Report response under Section 18)",
      "Drafting + filing of objection reply",
      "Legal arguments + case-law citations",
      "Monthly status update + reminders (life time)",
    ],
  },
  {
    id: "supreme-plus",
    name: "Supreme Plus",
    badge: "✦ HEARING + OPPOSITION",
    oldPrice: 22499,
    price: 14999,
    services: [
      "Everything in Supreme",
      "TRADEMARK HEARING representation (max 2 times)",
      "(before the Trade Marks Registry — personal + video)",
      "Counter-statement + arguments + case-law citations",
      "OPPOSITION HANDLING (1 time)",
      "(filing counter-statement under Section 21)",
      "Drafting Reply to Notice of Opposition",
      "Coordination through evidence stage",
      "Monthly status update + reminders (life time)",
    ],
  },
];

const TmarkPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Protect your brand with a trademark at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards tmark-cards-center">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
              >
                <div>
                  <div className="opcplan-header">
                    {plan.badge && (
                      <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
                        {plan.badge}
                      </div>
                    )}
                    <div className="opcplan-name">{plan.name}</div>
                    <div className="opcplan-old-price">₹{plan.oldPrice.toLocaleString("en-IN")}</div>
                    <div className="opcplan-price">₹{plan.price.toLocaleString("en-IN")}</div>
                    <div className="opcplan-meta">+ Govt. fees &amp; GST extra</div>
                  </div>

                  <div className="opcplan-body">
                    <ul className="opcplan-list">
                      {plan.services.map((s, i) => (
                        <li key={i} className="opcplan-list-item">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="opcplan-footer">
                  <button
                    className={`opcplan-button${plan.popular ? " opcplan-button--popular" : ""}`}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-application" />
      )}
    </>
  );
};

export default TmarkPlans;
