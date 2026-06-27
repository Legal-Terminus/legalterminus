import React from "react";
import "./ItrBizFeatures.css";

const types = [
  {
    number: "01",
    title: "Proprietor - Maintains Own Books",
    text: "Sole proprietor + own accountant prepares Balance Sheet + P&L ready + total income within personal slab rates (most under Rs.12L = NIL tax under New Regime). Elemental tier files ITR-3 with e-Verification + tax payment coord. Most cost-efficient.",
  },
  {
    number: "02",
    title: "Partnership Firm - Maintains Own Books",
    text: "Partnership Firm with in-house bookkeeper + ready Balance Sheet + P&L + partner remuneration / interest schedule computed. Elemental tier files ITR-5 + handles flat 30% computation + cess + surcharge (if applicable) + e-Verification. Same low price as proprietor case.",
  },
  {
    number: "03",
    title: "Proprietor or PF - Needs Balance Sheet Help",
    text: "You have raw transaction data (bank statements + invoices + expenses) but no Balance Sheet ready. Enriched tier prepares Balance Sheet + P&L + IT Computation + depreciation + (for PF) Section 40(b) partner remuneration / interest computation + TDS reconciliation + ITR filing.",
  },
  {
    number: "04",
    title: "Partnership Firm - Year-Round Tally + Section 194T",
    text: "Active PF wanting end-to-end: year-round Tally bookkeeping + monthly transaction recording + partner capital account reconciliation + NEW Section 194T 10% TDS deduction on partner payments > Rs.20K/year (FY 2025-26 onwards - critical compliance) + Form 26Q filing + GST reconciliation + Balance Sheet + ITR-5. Full outsourced accounting + tax.",
  },
  {
    number: "05",
    title: "Either Entity on Presumptive Scheme - Section 44AD",
    text: "You've opted for the PRESUMPTIVE SCHEME under Section 44AD - declare 6%/8% of turnover as deemed profit + file ITR-4 (Sugam). PROPRIETOR + PARTNERSHIP FIRM both eligible (NOT LLPs). For PF: remember partner remuneration / interest NOT deductible under presumptive. We model both regular + presumptive at intake to recommend the better option.",
  },
  {
    number: "06",
    title: "Larger Firms / Tax Audit / Other Entities",
    text: "If your turnover EXCEEDS Rs.50 LAKH, OR triggers Section 44AB tax audit (T/o > Rs.1 Cr), OR you're an LLP / company - these are OUT OF SCOPE of our standard 3-tier plans. Per T&C #1, contact our executive for a CUSTOMISED quote. LLPs have a separate LT service - LLP Annual Filing. Companies have - Company Annual Filing.",
  },
];

const ItrBizFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Business Income Tax Returns in India</h2>

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

export default ItrBizFeatures;
