import { useState } from "react";
import "./PtopvtPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const PLANS = [
  {
    id: "conversion",
    name: "Section 366 Conversion",
    oldPrice: 19999,
    price: 9999,
    services: [
      "Eligibility & 2-member/2-director structuring",
      "DSC + DIN for the directors",
      "Name reservation via SPICe+ Part A",
      "URC-2 newspaper advertisement coordination",
      "URC-1 statutory pack & Section 366 filing",
      "MOA & AOA drafting + SPICe+ incorporation",
      "Certificate of Incorporation, PAN & TAN",
    ],
  },
  {
    id: "takeover",
    name: "Conversion + Business Migration",
    badge: "★ MOST POPULAR",
    popular: true,
    oldPrice: 34999,
    price: 18999,
    services: [
      "Everything in Section 366 Conversion",
      "Creditor NOC & statement-of-accounts handling",
      "Transfer of assets, liabilities & contracts",
      "Fresh GST registration in the company's name",
      "Bank account opening assistance",
      "Surrender of old proprietorship registrations",
      "Dedicated compliance manager + reminders",
    ],
  },
  {
    id: "full",
    name: "Full Transition + Compliance",
    badge: "✦ FULL-SERVICE",
    oldPrice: 59999,
    price: 32999,
    services: [
      "Everything in Conversion + Business Migration",
      "Audited opening balance sheet guidance",
      "Licence / Udyam / IEC migration to the company",
      "Founders' agreement & cap-table setup",
      "First-year compliance calendar (AOC-4 / MGT-7 / ITR / audit)",
      "Statutory registers, minutes & share certificates",
      "Priority support till the Pvt Ltd is fully operational",
    ],
  },
];

const PtopvtPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              Convert your proprietorship into a Pvt Ltd at pocket-friendly prices
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
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="proprietorship-to-private" />
      )}
    </>
  );
};

export default PtopvtPlans;
