import { useState } from "react";
import "./TmrnwPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    badge: "STANDARD RENEWAL",
    oldPrice: 2999,
    price: 1999,
    services: [
      "Existing registration certificate review",
      "Expiry verification on IP India portal",
      "Form TM-R drafting + client confirmation",
      "Government fee payment (per class at actuals)",
      "DSC affixation by LT (registered TM agent)",
      "E-filing on https://ipindiaonline.gov.in",
      "Challan + Acknowledgement emailed to client",
      "Renewal Certificate delivery (30–60 days)",
      "LIFELONG REMINDER POLICY included",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 5249,
    price: 3499,
    services: [
      "Form TM-48 Power of Attorney drafting",
      "Authorisation Letter drafting (POA signatory)",
      "POA stamping + execution coordination",
      "Filing change-of-agent on IP India portal",
      "Form TM-R filing + Govt fee + DSC affixation",
      "Challan + Acknowledgement + Renewal Cert",
      "LIFELONG REMINDER POLICY included",
      "Single engagement — no separate billing",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ RENEWAL + 12 MONTHS TRADEMARK WATCH",
    oldPrice: 14999,
    price: 9999,
    services: [
      "FULL RENEWAL PROCESS (per Elemental OR Enriched)",
      "Attorney Change handled inclusive (if needed)",
      "Form TM-R + Govt fee + DSC + Renewal Certificate",
      "12 MONTHS of TRADEMARK WATCH SERVICES",
      "Monthly watch report + alert emails",
      "IP India Trademark Journal monitoring",
      "Similar / identical mark filing alerts",
      "Opposition window tracking (4-month statutory)",
      "LIFELONG REMINDER POLICY included",
    ],
  },
];

const TmrnwPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Renew and protect your trademark at pocket-friendly prices
            </p>
          </header>

          <div className="opcpricing-cards tmrnw-cards-center">
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="trademark-renewal" />
      )}
    </>
  );
};

export default TmrnwPlans;
