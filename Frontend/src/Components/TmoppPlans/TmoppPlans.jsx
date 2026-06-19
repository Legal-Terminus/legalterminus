import { useState } from "react";
import "./TmoppPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "ELEMENTAL",
    badge: "PLEADINGS ONLY",
    oldPrice: 8999,
    price: 5999,
    services: [
      "Scenario A: Notice of Opposition (Form TM-O)",
      "Or Scenario B: Counter Statement (Form TM-O)",
      "Up to 25 grounds drafted in the pleading",
      "Section 9 / 11 / 13 / 14 grounds analysis",
      "Filing on IP India portal (e-filing)",
      "DSC affixation by LT's associated attorney",
      "Govt fee payment (₹2,700/class for TM-O if opposer)",
      "Challan + acknowledgement to client",
      "Status Update Commitment (monthly + 1-2 day)",
      "Beyond 25 grounds: mutually discussed pricing",
    ],
  },
  {
    id: "enriched",
    name: "ENRICHED",
    badge: "+ EVIDENCE STAGE",
    popular: true,
    oldPrice: 14999,
    price: 9999,
    services: [
      "Everything in Elemental",
      "Evidence stage drafting + filing",
      "Rule 45 evidence (if opposer) — 2 months window",
      "Or Rule 46 evidence (if applicant) — 2 months window",
      "Affidavit drafting + verification",
      "Documentary evidence compilation",
      "Use evidence + market presence proof",
      "Notarisation coordination",
      "Service of evidence on opposite party",
      "Status Update Commitment",
    ],
  },
  {
    id: "supreme",
    name: "SUPREME",
    badge: "FULL OPPOSITION LIFECYCLE",
    oldPrice: 29999,
    price: 19999,
    services: [
      "Everything in Enriched",
      "Rule 47 reply evidence (opposer's side — if applicable)",
      "Final hearing under Rule 50 attendance (max 2 times)",
      "Online video conference representation",
      "Written submissions + case-law citations",
      "Hearing brief + paper-book preparation",
      "Adjournment management (max 2 — ₹900 each pass-through)",
      "Post-hearing follow-up till Registrar's order",
      "Senior IP-counsel-led case management",
      "Status Update Commitment",
    ],
  },
];

const TmoppPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Oppose or defend a trademark at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards">
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
                    <div className="opcplan-meta">+ Govt fee &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-opposition" />
      )}
    </>
  );
};

export default TmoppPlans;
