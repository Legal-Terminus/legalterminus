import React from "react";
import "./AfcFeatures.css";

const types = [
  {
    number: "01",
    title: "Financial Statements — AOC-4",
    text: "The company files its audited Balance Sheet, Profit & Loss account, Director's Report, and Auditor's Report with the ROC in Form AOC-4 (or AOC-4 XBRL / CFS for specified companies). It is generally due within 30 days of the Annual General Meeting and is the core financial-disclosure filing of the year.",
  },
  {
    number: "02",
    title: "Annual Return — MGT-7 / MGT-7A",
    text: "Form MGT-7 captures the company's shareholding pattern, directors, registered office, and changes during the year; small companies and OPCs file the abridged MGT-7A. It is filed within 60 days of the AGM and is the primary corporate-governance return submitted to the MCA each year.",
  },
  {
    number: "03",
    title: "Auditor, KYC & Other Filings",
    text: "Beyond the two annual forms, companies file ADT-1 (auditor appointment/ratification within 15 days of AGM), DIR-3 KYC for every director by 30 September, DPT-3 (return of deposits/loans), and MSME-1 (outstanding dues to MSME vendors). Together these complete the company's yearly compliance under the Companies Act, 2013.",
  },
];

const AfcFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Annual Filings &amp; ROC Forms for a Company</h2>

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

export default AfcFeatures;
