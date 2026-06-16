import { useState } from "react";
import "./PtollpPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "conversion",
    name: "Section 55 Conversion",
    oldPrice: 15999,
    price: 7999,
    services: [
      "DSC + DPIN for the designated partners",
      "Name reservation via RUN-LLP",
      "Form 17 (conversion application) preparation",
      "Form FiLLiP (LLP incorporation) filing",
      "Statement of assets & liabilities coordination (CA)",
      "Certificate of Registration as LLP",
      "Govt fee coordination at actuals",
    ],
  },
  {
    id: "agreement",
    name: "Conversion + LLP Agreement",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 27999,
    price: 14999,
    services: [
      "Everything in Section 55 Conversion",
      "Custom LLP agreement drafting & Form 3 filing",
      "Creditor NOC & consent handling",
      "Registrar of Firms intimation (firm dissolution)",
      "PAN update & GST migration to the LLP",
      "Bank account update assistance",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Transition + Compliance",
    badge: "✦ FULL-SERVICE",
    oldPrice: 44999,
    price: 24999,
    services: [
      "Everything in Conversion + LLP Agreement",
      "Profit-sharing, capital & remuneration structuring",
      "Licence / Udyam / IEC migration to the LLP",
      "Vendor & customer intimation templates",
      "First-year compliance calendar (Form 8 / Form 11 / ITR-5)",
      "Statutory records & designated-partner KYC setup",
      "Priority support till the LLP is fully operational",
    ],
  },
];

const PtollpPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your partnership into an LLP at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="partnership-to-llp" />
      )}
    </>
  );
};

export default PtollpPlans;
