import { useState } from "react";
import "./LtopvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "conversion",
    name: "Section 366 Conversion",
    oldPrice: 22999,
    price: 11999,
    services: [
      "Eligibility review & partner-to-shareholder mapping",
      "DSC + DIN for the directors",
      "Name reservation via SPICe+ Part A",
      "URC-2 newspaper advertisement coordination",
      "URC-1 + SPICe+ Part B filing under Section 366",
      "MOA & AOA drafting + Certificate of Incorporation",
      "Govt fee coordination at actuals",
    ],
  },
  {
    id: "migration",
    name: "Conversion + Business Migration",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 39999,
    price: 21999,
    services: [
      "Everything in Section 366 Conversion",
      "NOC from the LLP's Registrar & creditor consent",
      "CA-certified statement of accounts handling",
      "Fresh GST registration in the company's name",
      "Bank account opening assistance",
      "Intimation to ROC & dissolution of the LLP",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Transition + Compliance",
    badge: "✦ FULL-SERVICE",
    oldPrice: 64999,
    price: 36999,
    services: [
      "Everything in Conversion + Business Migration",
      "Cap-table, ESOP pool & shareholders' agreement setup",
      "Licence / Udyam / IEC migration to the company",
      "Asset & contract transfer documentation",
      "First-year compliance calendar (AOC-4 / MGT-7 / ITR / audit)",
      "Statutory registers, minutes & share certificates",
      "Priority support till the Pvt Ltd is fully operational",
    ],
  },
];

const LtopvtPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your LLP into a Pvt Ltd at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="llp-to-private" />
      )}
    </>
  );
};

export default LtopvtPlans;
