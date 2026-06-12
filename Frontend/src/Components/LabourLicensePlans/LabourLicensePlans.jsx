import { useState } from "react";
import "./LabourLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "single",
    name: "Single Plan",
    badge: "★ SENIOR LABOUR-LAW SPECIALIST LED",
    popular: true,
    oldPrice: 17999,
    price: 11999,
    services: [
      "Eligibility + threshold mapping (50+ workers under OSH Code 2020)",
      "Shram Suvidha portal account setup + DSC integration",
      "Contractor License OR Principal Employer Registration (one filing)",
      "Form V Certificate co-drafted — PE side + Contractor side",
      "Worker schedule + wage register format (statutory)",
      "Welfare facility audit — canteen, restrooms, creche, first-aid, drinking water",
      "Government fee + security deposit computation",
      "Filing on https://shramsuvidha.gov.in",
      "Labour Department query handling",
      "5-year License Certificate / PE Registration delivery",
      "5-year compliance calendar + annual return reminders",
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

          <div className="opcpricing-cards" style={{ display: "flex", justifyContent: "center" }}>
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
                style={{ maxWidth: "440px", width: "100%" }}
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="labour-license-clra" />
      )}
    </>
  );
};

export default LabourLicensePlans;
