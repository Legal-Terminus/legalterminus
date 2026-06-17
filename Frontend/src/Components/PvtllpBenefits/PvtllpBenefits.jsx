import React from "react";
import "./PvtllpBenefits.css";

const benefits = [
  {
    title: "Annual Compliance Cost Drops 50–70%",
    text: "Pvt Ltd: mandatory AGM + statutory audit regardless of T/O + Cash Flow Statement + full MGT-7 + AOC-4 + Directors' Report + multiple Board meetings + Director KYC + statutory committees (for specified). Annual cost ₹40,000 – ₹1,00,000+. LLP: no AGM + audit only if T/O > ₹40 L OR contribution > ₹25 L + Form 11 + Form 8 + ITR. Annual cost ₹15,000 – ₹40,000. For small / closely-held promoter-controlled businesses, this is material.",
  },
  {
    title: "Same Limited Liability + Separate Legal Entity",
    text: "An LLP is a SEPARATE LEGAL PERSON (Section 3 LLP Act). Partners' liability is LIMITED to their capital contribution. Same shield as a Pvt Ltd shareholder — personal assets are insulated from LLP debts. The LLP contracts, sues, and is sued in its own name. Perpetual succession — partners may change, the LLP continues. No structural downgrade in legal protection.",
  },
  {
    title: "Section 47(xiiib) Tax Neutrality (For Eligible Companies)",
    text: "If your company's turnover is ≤ ₹60 lakh AND total assets are ≤ ₹5 crore in each of 3 preceding years, Section 47(xiiib) of the Income-tax Act provides CAPITAL-GAINS EXEMPTION on the conversion — the asset transfer is NOT treated as a 'transfer' for tax purposes. For small / dormant / shell-like Pvt Ltd companies, this means a clean rightsizing without a tax bill. (Companies above thresholds still convert legally but face capital-gains tax.)",
  },
  {
    title: "No Newspaper Advertisement / Public Notice Required",
    text: "UNLIKE URC-1 / Section 366 routes (used for entities becoming companies, which require INC-25A / URC-2 newspaper advertisement + 21-day public objection window), Section 56 + Third Schedule conversion to LLP has NO advertisement requirement + NO objection window. Combined Form 18 + FiLLiP is a single filing — typical timeline 15–20 working days. Material time + cost saving.",
  },
  {
    title: "Internal Flexibility via LLP Agreement",
    text: "Where a Pvt Ltd's Articles + Companies Act dictate governance (board composition, AGM rules, statutory committees, board / shareholder meeting protocols), an LLP Agreement (Form 3) lets partners freely structure: capital contributions, profit-share ratios, decision-making rights, indemnification, exit + admission terms, and dispute resolution. Custom LLP Agreement in Enriched + Supreme tiers (with 47(xiiib)-compliant structuring).",
  },
  {
    title: "Statutory Continuity + Asset Auto-Vesting",
    text: "Per the Third Schedule, on CoI all the company's TANGIBLE + INTANGIBLE PROPERTY + ASSETS + RIGHTS + LIABILITIES + CONTRACTS + LICENCES + THE WHOLE UNDERTAKING auto-vest in the LLP — no separate transfer deeds, no novation (per the LLP Act's framework). The company is deemed dissolved + the LLP succeeds it. Cleaner than wind-up + fresh LLP incorporation OR transfer-of-business under Companies Act 2013.",
  },
];

const PvtllpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting Pvt Ltd into LLP
          </h2>
          <p className="opcben-subtitle">
            Why a Pvt Ltd would convert OUT of its Companies Act structure to an LLP — and what you gain (and lose) in the trade:
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

export default PvtllpBenefits;
