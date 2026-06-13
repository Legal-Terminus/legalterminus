import { useState } from "react";
import "./PtoopcPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "incorporation",
    name: "OPC Incorporation",
    oldPrice: 12999,
    price: 6999,
    services: [
      "DSC + DIN for the proprietor (single director)",
      "Name reservation via SPICe+ Part A",
      "MOA & AOA drafting for the OPC",
      "Nominee consent (Form INC-3) drafting",
      "SPICe+ incorporation filing with the ROC",
      "Certificate of Incorporation, PAN & TAN",
      "Govt fee coordination at actuals",
    ],
  },
  {
    id: "takeover",
    name: "Incorporation + Business Takeover",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 22999,
    price: 13999,
    services: [
      "Everything in OPC Incorporation",
      "Takeover / transfer agreement (proprietorship → OPC)",
      "Transfer of assets, liabilities & contracts",
      "GST registration in the OPC's name",
      "Bank account opening assistance",
      "Surrender of old proprietorship registrations",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Transition Advisory",
    badge: "✦ FULL-SERVICE",
    oldPrice: 39999,
    price: 23999,
    services: [
      "Everything in Incorporation + Business Takeover",
      "Asset valuation & opening balance sheet guidance",
      "Licence / Udyam / IEC migration to the OPC",
      "Vendor & customer intimation templates",
      "First-year compliance calendar (AOC-4 / MGT-7 / ITR)",
      "Statutory registers & minutes setup",
      "Priority support till the OPC is fully operational",
    ],
  },
];

const PtoopcPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your proprietorship into an OPC at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="proprietorship-to-opc" />
      )}
    </>
  );
};

export default PtoopcPlans;
