import React from "react";
import "./PtopvtBenefits.css";

const benefits = [
  {
    title: "Investor-Ready Structure (VC + Angels)",
    text: "Every VC term sheet you'll ever sign assumes a Pvt Ltd. Share classes, preference rights, anti-dilution, drag-along, tag-along, board observer seats — all written into your AOA. Angels, family offices, and VCs DO NOT touch proprietorships or OPCs but DO invest in a Pvt Ltd via convertible debentures, CCPS, or equity rounds. If you're aiming for external funding in 12–24 months, Pvt Ltd is the prerequisite.",
  },
  {
    title: "Section 115BAA — 22% Concessional Corporate Tax",
    text: "Domestic Pvt Ltd companies can opt for a 22% effective tax rate under Section 115BAA (vs 25.17% default for turnover up to ₹400 cr or 30% above). Filed via Form 10-IC. Trade-off: no SEZ / S 80-IA / additional depreciation deductions in lieu of the rate cut — almost always a net positive for non-deduction-heavy businesses. Section 115BAB (new manufacturing — 15% rate) available where applicable.",
  },
  {
    title: "Limited Liability + Separate Legal Entity",
    text: "Founders' personal assets are insulated from company debts. The Pvt Ltd can sue, be sued, hold property, and sign contracts in its own name. Perpetual succession — the business continues regardless of director / shareholder changes.",
  },
  {
    title: "ESOPs + Sweat Equity Ready",
    text: "Section 62(1)(b) of the Companies Act makes ESOPs cleanly issuable by Pvt Ltd companies. Sweat equity (Section 54), preferential allotment (Section 62), private placement (Section 42), and rights issues are all available. Pvt Ltd unlocks the full employee-equity + capital-raising toolkit. OPCs and proprietorships cannot issue ESOPs.",
  },
  {
    title: "DPIIT Startup India + Section 80-IAC Tax Holiday",
    text: "Only Pvt Ltd, LLP, and Partnership Firms are eligible for DPIIT (Startup India) recognition. Pvt Ltd unlocks Section 80-IAC's 3-CONSECUTIVE-YEAR tax holiday (any 3 out of the first 10 years), Section 56(2)(viib) angel-tax exemption, IPR fee rebates, and the wider Startup India toolkit. The Enriched plan checks eligibility; Supreme files the application.",
  },
  {
    title: "Section 366 Statutory Continuity + Brand Credibility",
    text: "Conversion via URC-1 + URC-2 under Section 366 is a STATUTORY continuity route — the Pvt Ltd inherits the proprietorship's business operations through the conversion mechanism. Government tenders, PSU contracts, modern trade chains, B2B onboarding, and enterprise procurement teams all REQUIRE a Pvt Ltd at vendor due-diligence. Banks underwrite working capital + term loans more readily to a Pvt Ltd than to a proprietorship.",
  },
];

const PtopvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting Proprietorship to a Pvt Ltd
          </h2>
          <p className="opcben-subtitle">
            Pvt Ltd is not just an 'incorporated proprietorship'. It's the structural upgrade with material legal, financial, tax, and fundraising benefits. Here's what matters:
          </p>
        </header>

        <div className="opcben-grid">
          {benefits.map((benefit, i) => (
            <article className="opcben-card" key={i}>
              <h3 className="opcben-card-title">{benefit.title}</h3>
              <div className="opcben-card-underline" />
              <p className="opcben-card-text">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PtopvtBenefits;
