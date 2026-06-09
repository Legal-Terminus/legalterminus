import { useState } from "react";
import "../OPCPlans/OPCPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "elemental",
    name: "Elemental",
    oldPrice: 4999,
    price: 2999,
    services: [
      "OLWF Registration via Labour Welfare Commissioner",
      "Form A application drafting & filing",
      "Establishment Code allotment",
      "Document curation + upload",
      "Worker list mapping (up to 10 workers)",
      "Half-yearly contribution calendar handover",
      "Govt fee at actuals (nominal, billed separately)",
    ],
  },
  {
    id: "enriched",
    name: "Enriched",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 6499,
    price: 4499,
    services: [
      "Everything in Elemental",
      "Worker list mapping (up to 25 workers)",
      "First half-yearly contribution computation",
      "Contribution payment walkthrough (Jan / July cycle)",
      "Half-yearly return (Form / online) drafting",
      "Worker enrolment for fund benefits (education, medical etc.)",
      "30-day post-registration support",
    ],
  },
  {
    id: "supreme",
    name: "Supreme",
    badge: "✦ FULL-SERVICE",
    oldPrice: 9999,
    price: 6999,
    services: [
      "Everything in Enriched",
      "Worker list mapping (up to 50 workers)",
      "Both half-yearly contributions + returns computation (full year)",
      "Detailed wage / worker register reconciliation",
      "Worker scholarship / medical benefit application guidance",
      "90-day priority state-labour-professional helpline",
    ],
  },
];

const OLWFPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Register your OLWF with pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="olwf-registration" />
      )}
    </>
  );
};

export default OLWFPlans;
