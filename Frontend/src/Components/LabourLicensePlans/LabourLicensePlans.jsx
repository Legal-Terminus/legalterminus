import { useState } from "react";
import "./LabourLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "principal",
    name: "Principal Employer Registration",
    oldPrice: 9999,
    price: 4999,
    services: [
      "Certificate of Registration (RC) under CLRA Act, 1970",
      "Form I application preparation & department filing",
      "Government registration fee coordination at actuals",
      "Contractor & workmen mapping in the registration",
      "Registration Certificate (RC) issuance support",
      "Basic compliance checklist & display obligations",
      "Email delivery of the Certificate of Registration",
    ],
  },
  {
    id: "contractor",
    name: "Contractor Labour Licence",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 14999,
    price: 7999,
    services: [
      "Everything in Principal Employer Registration",
      "Contractor Licence (Form VI) under CLRA Act, 1970",
      "Form IV application & Form V from Principal Employer",
      "Security deposit & licence fee coordination per workman",
      "Department query response & clarification handling",
      "Workmen welfare compliance checklist (canteen, restroom, etc.)",
      "1-year renewal reminder & compliance calendar",
    ],
  },
  {
    id: "full",
    name: "Full Compliance Pack",
    badge: "✦ FULL-SERVICE",
    oldPrice: 24999,
    price: 14999,
    services: [
      "Everything in Contractor Labour Licence",
      "Both RC + Contractor Licence handled together",
      "Half-yearly & annual returns (Form XXIV / Form XXV) setup",
      "Muster roll, wage register & statutory register guidance",
      "EPF / ESI alignment for contract workmen",
      "2-year compliance calendar & renewal management",
      "Priority legal support for inspection representation",
    ],
  },
];

const LabourLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Get your labour licence at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee, security deposit &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="labour-license-clra" />
      )}
    </>
  );
};

export default LabourLicensePlans;
