import { useState } from "react";
import "./ItrIndPlans.css";
import CheckoutModal from "../ProCheckoutModal/ProCheckoutModal";

const BASE_PLANS = [
  {
    id: "base-elemental",
    tier: "ELEMENTAL",
    name: "ITR-1 — Income up to ₹5 Lakh",
    oldPrice: 1199,
    price: 799,
    services: [
      "Income up to ₹5 Lakh (ITR-1 Sahaj)",
      "Salary Income",
      "House Property Income",
      "Interest Income",
      "Income Tax portal account setup + e-Verification",
      "Form 26AS + AIS / TIS reconciliation",
      "TDS refund claim (if applicable)",
      "Old vs New regime quick advisory",
      "Acknowledgement (ITR-V) delivery",
    ],
  },
  {
    id: "base-enriched",
    tier: "ENRICHED",
    name: "ITR-1 — Income up to ₹10 Lakh",
    popular: true,
    oldPrice: 2249,
    price: 1499,
    services: [
      "Income up to ₹10 Lakh (ITR-1 Sahaj)",
      "Salary Income",
      "House Property Income",
      "Interest Income",
      "Income Tax portal + Form 26AS / AIS reconciliation",
      "Old vs New regime optimisation",
      "Section 80 deductions claim (Old Regime)",
      "Section 87A rebate verification",
      "Acknowledgement (ITR-V) delivery",
    ],
  },
  {
    id: "base-supreme",
    tier: "SUPREME",
    name: "ITR-1 — Income more than ₹10 Lakh",
    oldPrice: 2999,
    price: 1999,
    services: [
      "Income more than ₹10 Lakh",
      "Salary Income",
      "House Property Income",
      "Interest Income",
      "ITR-1 (up to ₹50L) or ITR-2 (above ₹50L)",
      "Comprehensive Old vs New regime advisory",
      "Senior tax-counsel review",
      "TDS optimisation + advance tax planning hint",
      "Acknowledgement (ITR-V) delivery",
    ],
  },
];

const PLUS_PLANS = [
  {
    id: "plus-elemental",
    tier: "ELEMENTAL",
    name: "ITR-2 + Capital Gains",
    oldPrice: 6749,
    price: 4499,
    services: [
      "All Base plan features (any income level)",
      "Salary + House Property + Interest Income",
      "CAPITAL GAINS computation",
      "STCG on equity 20% (Sec 111A)",
      "LTCG on equity 12.5% above ₹1.25L (Sec 112A)",
      "LTCG on property / debt 12.5% (no indexation)",
      "Carry-forward losses (Sec 71B / 74)",
      "ITR-2 filing (mandatory for capital gains)",
      "ESOP / RSU / Sweat equity treatment",
    ],
  },
  {
    id: "plus-enriched",
    tier: "ENRICHED",
    name: "ITR-2 + Capital Gains + Foreign Income",
    popular: true,
    oldPrice: 8999,
    price: 5999,
    services: [
      "All Elemental+ features",
      "Salary + House Property + Interest + Capital Gains",
      "INCOME EARNED OUTSIDE INDIA reporting",
      "FOREIGN DIVIDEND / INTEREST / ROYALTY disclosure",
      "Schedule FA (Foreign Assets) disclosure",
      "Foreign Tax Credit (FTC) claim via Form 67",
      "Foreign bank account / property reporting",
      "Section 89A relief (foreign retirement benefits)",
      "Black Money Act 2015 compliance review",
    ],
  },
  {
    id: "plus-supreme",
    tier: "SUPREME",
    name: "ITR-2 + NRI / NRO + DTAA",
    oldPrice: 11999,
    price: 7999,
    services: [
      "All Enriched+ features",
      "Salary + HP + Interest + Capital Gains + Foreign",
      "NRI / NRO CASES end-to-end",
      "Section 6 Residential status determination",
      "Tax Residency Certificate (TRC) facilitation",
      "DTAA ADVISORY (Double Taxation Avoidance Agreement)",
      "Treaty interpretation + benefit optimisation",
      "Multi-jurisdiction filing coordination",
      "Section 89A foreign retirement benefits",
    ],
  },
];

const PlanCard = ({ plan, onSelect }) => (
  <article
    className={`opcplan-card${plan.popular ? " opcplan-card--popular" : ""}`}
  >
    <div>
      <div className="opcplan-header">
        <div className={`opcplan-badge${plan.popular ? " opcplan-badge--popular" : ""}`}>
          {plan.tier}
        </div>
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
        onClick={() => onSelect(plan)}
      >
        Buy Now
      </button>
    </div>
  </article>
);

const ItrIndPlans = () => {
  const [activePlan, setActivePlan] = useState(null);

  return (
    <>
      <section className="opc-pricing-section">
        <div className="opcpricing-container">

          <header className="opcpricing-header">
            <h2 className="opcpricing-title">CHOOSE YOUR PLAN</h2>
            <p className="opcpricing-subtitle">
              File your personal income tax return at pocket-friendly prices
            </p>
          </header>

          <div className="itrind-plan-group">
            <div className="itrind-group-header">
              <h3 className="itrind-group-title">Base Plans <span>(ITR-1)</span></h3>
              <p className="itrind-group-sub">Differentiated by income level</p>
            </div>
            <div className="opcpricing-cards">
              {BASE_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onSelect={setActivePlan} />
              ))}
            </div>
          </div>

          <div className="itrind-plan-group">
            <div className="itrind-group-header">
              <h3 className="itrind-group-title">Plus Plans <span>(ITR-2)</span></h3>
              <p className="itrind-group-sub">Differentiated by complexity layers</p>
            </div>
            <div className="opcpricing-cards">
              {PLUS_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onSelect={setActivePlan} />
              ))}
            </div>
          </div>

          <div className="itrind-plan-customization">
            <p>
              <strong>Plan Customization (per client T&amp;C):</strong> If the above plans do not qualify your
              requirements - for example, you have business / profession income (separate Business ITR Filing
              service), in Stock/trading line of item more than 25, Arrear Salary, Section 8 / Trust ITR-7, or
              unique multi-jurisdiction structures - <strong>KINDLY CONTACT OUR EXECUTIVE</strong>, we shall be
              happy to customize a plan for you.
            </p>
          </div>

        </div>
      </section>

      {activePlan && (
        <CheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} source="itr-individual" />
      )}
    </>
  );
};

export default ItrIndPlans;
