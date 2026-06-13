import React from "react";
import "./PtoopcBenefits.css";

const PtoopcBenefits = () => {
  const benefits = [
    {
      title: "Limited Liability - Personal Assets Shielded",
      description: "The single biggest reason to convert. As proprietor, your house, savings, and personal assets are exposed to business debts and litigation. As an OPC member, your liability is LIMITED to your unpaid share capital. Banks, suppliers, customers, courts all treat the OPC as a separate legal person - your personal assets are insulated.",
    },
    {
      title: "Section 366 Statutory Continuity",
      description: "Conversion via URC-1 + URC-2 under Section 366 is a STATUTORY continuity route - it doesn't require dissolving the proprietorship via wind-up + transfer of every asset individually. The OPC, post-incorporation, inherits the proprietorship's contracts, assets, and operations through the conversion mechanism. Cleaner than wind-up + fresh incorporation.",
    },
    {
      title: "100% Ownership Retained",
      description: "Unlike Private Limited Company (which requires minimum 2 members + 2 directors), OPC lets you retain 100% ownership + 100% control. No co-founder dilution, no investor pressure at incorporation, no shareholder agreements to navigate. Just you - with corporate shield.",
    },
    {
      title: "Perpetual Succession via Nominee",
      description: "Proprietorship dies with the proprietor - assets, contracts, licenses all have to be inherited and re-registered. OPC continues seamlessly: on the member's death / incapacity, the NOMINEE (named at incorporation via Form INC-3) becomes member automatically. Business continuity is built into the structure.",
    },
    {
      title: "Easier Bank Credit + Investor Conversations",
      description: "Banks lend more readily to corporates than proprietors (better debt-to-equity comfort + audited financials + structured KYC). Venture investors / angels DO NOT touch proprietorships but WILL look at OPC convertible-debenture structures. When you eventually want to scale to Pvt Ltd, voluntary conversion is a clean 1-step filing.",
    },
    {
      title: "Light Compliance vs Private Limited",
      description: "OPC enjoys key relaxations vs Pvt Ltd: NO AGM mandatory (Section 96(1) carve-out), NO Cash Flow Statement required, simpler annual return (MGT-7A vs MGT-7), board meeting requirement relaxed (min 1 meeting per half-year vs 4 / year), no need for company secretary unless paid-up exceeds threshold. Compliance overhead is materially lighter.",
    },
  ];

  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting Proprietorship to an OPC
          </h2>
          <p className="opcben-subtitle">
            OPC is not just 'incorporated proprietorship.' It's a structural upgrade with material legal, financial, and credibility benefits. Here's what matters:
          </p>
        </header>

        <div className="opcben-grid">
          {benefits.map((benefit, index) => (
            <article key={index} className="opcben-card">
              <h3 className="opcben-card-title">{benefit.title}</h3>
              <div className="opcben-card-underline" />
              <p className="opcben-card-text">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtoopcBenefits;
