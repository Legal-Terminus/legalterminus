import React from "react";
import "./AflFeatures.css";

const types = [
  {
    number: "01",
    title: "Active Operating LLP — Clean Books",
    text: "Your LLP is actively operating, books maintained by in-house accountant or external accountant — you provide ready financial statements; you just need filing services. Elemental tier files Form 11 + Form 8 + ITR-5 with DSC affixation + Govt fee + acknowledgement. Most common scenario for small LLPs with their own bookkeeping arrangement.",
  },
  {
    number: "02",
    title: "Non-Audited LLP — Books Outsourced",
    text: "Your LLP is operating but you don't maintain books in-house + you're below audit thresholds (turnover up to ₹40 lakh AND contribution up to ₹25 lakh — both conditions). Enriched tier covers year-round bookkeeping + financial statements preparation (P&L + Balance Sheet + IT Computation) + all 3 filings. No audit required. Quarterly book-review calls.",
  },
  {
    number: "03",
    title: "Audited LLP — Statutory Audit Triggered, T/o < ₹1 Crore",
    text: "Your LLP has crossed statutory audit threshold (turnover > ₹40L OR contribution > ₹25L — EITHER) but turnover is still UNDER ₹1 crore (no tax audit). Supreme tier covers bookkeeping + financial statements + statutory audit coordination + Form 8 CA certification + DSC procurement for 2 Designated Partners + all 3 filings. Statutory auditor's fee billed directly by CA to client.",
  },
  {
    number: "04",
    title: "Tax-Audit Applicable LLP — T/o > ₹1 Crore",
    text: "Your LLP's turnover crosses ₹1 CRORE — Tax Audit under Section 44AB of the Income Tax Act triggers. This is out of scope of the standard 3-tier plans — we quote it as a custom engagement covering 3CD/3CB tax audit form filing + tax audit by LT's associated CA + DSC procurement + all annual filings. Reach out for a tailored quote.",
  },
  {
    number: "05",
    title: "Dormant / Inactive LLP — Still Mandatory",
    text: "Your LLP has done little or no business in the year — but all three filings remain mandatory. LLPs have no 'dormant' status under the LLP Act. Elemental tier files Form 11 + Form 8 (showing nil balances) + LLP ITR-5 (showing nil income). Many founders learn this only after late fee multipliers accumulate.",
  },
  {
    number: "06",
    title: "First-Year LLP Filing — Newly Incorporated",
    text: "Your LLP was incorporated during FY 2025-26 — even with partial-year operations, all 3 filings are due. We handle pro-rated returns + opening Balance Sheet construction + first-year ITR. Recommend Enriched tier for new LLPs (typically non-audited in year 1) to set up proper bookkeeping practices from year one + avoid books catch-up costs later.",
  },
];

const AflFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Annual Filing for LLP in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AflFeatures;
