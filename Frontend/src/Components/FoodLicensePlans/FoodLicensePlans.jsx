import { useState } from "react";
import "./FoodLicensePlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "basic",
    name: "Basic Registration",
    oldPrice: 3999,
    price: 1499,
    services: [
      "FSSAI Basic Registration (turnover < ₹12 lakhs)",
      "Application preparation & FoSCoS portal filing",
      "Government fee coordination (₹100/year billed at actuals)",
      "FSSAI Registration Number issuance support",
      "Food category & premise details mapping",
      "Basic compliance checklist & display notice",
      "Email delivery of Registration Certificate",
    ],
  },
  {
    id: "state",
    name: "State License",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 7999,
    price: 3999,
    services: [
      "Everything in Basic Registration",
      "State FSSAI License (turnover ₹12L – ₹20Cr)",
      "Document verification & state authority portal filing",
      "Food product category mapping & FBO type classification",
      "Govt fee payment coordination at actuals",
      "FSSAI query response & clarification handling",
      "1-year renewal reminder & compliance calendar",
    ],
  },
  {
    id: "central",
    name: "Central License",
    badge: "✦ FULL-SERVICE",
    oldPrice: 14999,
    price: 7999,
    services: [
      "Everything in State License",
      "Central FSSAI License (turnover > ₹20Cr / multi-state / importer)",
      "Multi-state operations & import/export food compliance",
      "FSSAI inspection preparation & documentation",
      "Food safety management plan (FSMS) guidance",
      "2-year compliance calendar & renewal management",
      "Priority legal support for FSSAI audit representation",
    ],
  },
];

const FoodLicensePlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your food license at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="food-license-fssai" />
      )}
    </>
  );
};

export default FoodLicensePlans;
