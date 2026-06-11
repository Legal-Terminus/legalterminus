import React from "react";
import "./ItrBizFeatures.css";

const types = [
  {
    number: "01",
    title: "ITR-4 (Presumptive Income)",
    text: "For resident proprietors, professionals, and small firms opting for the presumptive scheme. Section 44AD (business, turnover up to ₹3 crore) declares 6–8% of turnover as income; 44ADA (professionals, receipts up to ₹75 lakh) declares 50%; 44AE covers goods-carriage operators. No books or audit required if conditions are met — the simplest route for eligible small businesses.",
  },
  {
    number: "02",
    title: "ITR-3 (Business / Profession with Books)",
    text: "For individuals and HUFs running a proprietary business or profession who maintain regular books of accounts. It carries a full Profit & Loss statement and Balance Sheet, with schedules for depreciation, partner remuneration, capital gains, F&O / speculative income, and other heads. The standard form for proprietors not using the presumptive scheme.",
  },
  {
    number: "03",
    title: "ITR-5 & ITR-6 (Firms, LLPs & Companies)",
    text: "ITR-5 is for partnership firms, LLPs, AOPs, and BOIs; ITR-6 is for companies (other than those claiming Section 11 exemption). These returns include detailed financial statements, computation of firm/company income, partner/shareholder distribution, MAT/AMT, and carry-forward of losses — and are typically filed alongside a tax audit where turnover thresholds are crossed.",
  },
];

const ItrBizFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Business Income Tax Returns</h2>

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
