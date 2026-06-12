import { useState } from "react";
import "./CnllpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "namechange",
    name: "LLP Name Change",
    oldPrice: 7999,
    price: 3999,
    services: [
      "Name availability check & guideline compliance",
      "Name reservation via RUN-LLP",
      "Partners' consent & resolution drafting",
      "Supplementary LLP agreement (Form 3) drafting",
      "Form 5 (notice of name change) filing with ROC",
      "Govt fee coordination at actuals",
      "Fresh Certificate of Incorporation delivery",
    ],
  },
  {
    id: "rebrand",
    name: "Name Change + Update Pack",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 14999,
    price: 7999,
    services: [
      "Everything in LLP Name Change",
      "PAN update with the new LLP name",
      "GST registration amendment",
      "Bank account name-update assistance",
      "Udyam / MSME & licence name update",
      "Updated stationery & statutory display guidance",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Rebrand Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 24999,
    price: 13999,
    services: [
      "Everything in Name Change + Update Pack",
      "Trademark search & advisory for the new name",
      "Trademark application for the new brand (1 class)",
      "Multi-licence & registration name updates",
      "Partner & designated-partner record updates",
      "Vendor / customer intimation templates",
      "Priority support till every record reflects the new name",
    ],
  },
];

const CnllpPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Change your LLP's name at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="change-name-llp" />
      )}
    </>
  );
};

export default CnllpPlans;
