import React from "react";
import "./PtollpBenefits.css";

const benefits = [
  {
    title: "Limited Liability + Personal Asset Protection",
    text: "The single biggest reason to convert. In a Partnership Firm, EVERY PARTNER is JOINTLY + SEVERALLY liable for ALL the firm's debts + the acts of OTHER PARTNERS (Section 25 Partnership Act). One partner's mis-step can drain another's personal assets. In an LLP, each partner's liability is LIMITED to their capital contribution. The LLP contracts in its own name. Joint-several liability disappears.",
  },
  {
    title: "Separate Legal Entity + Perpetual Succession",
    text: "An LLP is a SEPARATE LEGAL PERSON distinct from its partners (Section 3 LLP Act). It can own property, sue + be sued in its own name, and enter contracts. PARTNERS MAY CHANGE — the LLP continues. No reconstitution / dissolution on partner exit (unlike Partnership Firms where reconstitution / dissolution under Sections 39–44 of the Partnership Act is the default). Business continuity is structural.",
  },
  {
    title: "No Newspaper Advertisement / Public Notice Required",
    text: "UNLIKE the URC-1 route to a company (which requires INC-25A / URC-2 newspaper advertisement + 21-day public objection window), Section 55 + Second Schedule conversion to LLP has NO advertisement requirement + NO objection window. Combined Form 17 + FiLLiP is a single filing — typical timeline 15–20 working days vs 35–50 days for URC-1 conversions. Material time + cost saving.",
  },
  {
    title: "Lighter Compliance Than Pvt Ltd",
    text: "LLP enjoys major compliance relaxations vs a Private Limited Company: NO mandatory AGM (Section 96 not applicable), NO statutory audit unless turnover > ₹40 lakh OR contribution > ₹25 lakh, NO Section 134 Directors' Report, simpler annual return (Form 11 vs MGT-7), only Form 8 for financial statements (vs full AOC-4 with Cash Flow Statement). Annual compliance overhead is materially lower (₹15,000–25,000/year for LLP vs ₹40,000–1,00,000+/year for Pvt Ltd).",
  },
  {
    title: "Internal Flexibility via LLP Agreement",
    text: "Where a Pvt Ltd's Articles + Companies Act dictate governance (board meetings, AGM, statutory committees), an LLP Agreement (Form 3) lets partners freely structure: capital contributions, profit-share ratios (which can differ from contribution ratios), decision-making rights, indemnification, exit + admission terms, and dispute resolution. Custom LLP Agreement in Enriched + Supreme tiers.",
  },
  {
    title: "Statutory Continuity + Asset Auto-Vesting",
    text: "Per the Second Schedule, on CoI all the firm's TANGIBLE + INTANGIBLE PROPERTY + ASSETS + RIGHTS + LIABILITIES + CONTRACTS + LICENCES + THE WHOLE UNDERTAKING auto-vest in the LLP — no separate transfer deeds, no novation, no creditor consent (per the LLP Act's framework). The firm is deemed dissolved + the LLP succeeds it. Cleaner than wind-up + fresh incorporation OR partnership-to-Pvt-Ltd conversion via URC-1.",
  },
];

const PtollpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting Partnership Firm into an LLP
          </h2>
          <p className="opcben-subtitle">
            LLP is the corporate shield for partner-led businesses that don't need the heavy Pvt Ltd compliance stack + don't (yet) plan VC fundraising. Here's what matters:
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

export default PtollpBenefits;
