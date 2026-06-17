import { useState } from "react";
import "./PvtllpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "conversion",
    name: "Section 56 Conversion",
    oldPrice: 22999,
    price: 11999,
    services: [
      "Eligibility & charge / security-interest review",
      "DSC + DPIN for the designated partners",
      "LLP name reservation via RUN-LLP / FiLLiP",
      "Shareholder consents & creditor NOC drafting",
      "Form 18 + FiLLiP filing under the Third Schedule",
      "Certificate of Incorporation as an LLP",
      "Govt fee coordination at actuals",
    ],
  },
  {
    id: "transition",
    name: "Conversion + Compliance Closure",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 39999,
    price: 21999,
    services: [
      "Everything in Section 56 Conversion",
      "Up-to-date ROC & income-tax filing check",
      "LLP Agreement drafting + Form 3 filing",
      "Form 14 intimation to the Registrar of Companies",
      "PAN / TAN update & GST amendment to the LLP",
      "Bank account & licence migration assistance",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Transition + Tax Planning",
    badge: "✦ FULL-SERVICE",
    oldPrice: 64999,
    price: 36999,
    services: [
      "Everything in Conversion + Compliance Closure",
      "Section 47(xiiib) capital-gains eligibility review",
      "Profit-sharing & capital-contribution structuring",
      "Asset & contract transfer documentation",
      "First-year LLP compliance calendar (Form 8 / Form 11 / ITR)",
      "Statutory registers & partner records setup",
      "Priority support till the LLP is fully operational",
    ],
  },
];

const PvtllpPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your Private Limited Company into an LLP at pocket-friendly prices
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
                    <div className="opcplan-meta">+ Govt fee, stamp duty &amp; GST extra</div>
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="private-to-llp" />
      )}
    </>
  );
};

export default PvtllpPlans;
