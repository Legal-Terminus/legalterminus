import React from "react";
import "./GstFilingFeatures.css";

const types = [
  {
    number: "01",
    title: "Monthly & Quarterly Returns",
    text: "The core periodic returns for regular taxpayers. GSTR-1 reports outward supplies (invoice-wise), and GSTR-3B is the summary return for tax and ITC. Small taxpayers (turnover up to ₹5 crore) can opt for QRMP — quarterly GSTR-1 and GSTR-3B with monthly tax via PMT-06. Due dates run on the 11th, 13th, 20th, 22nd, and 24th depending on type and state.",
  },
  {
    number: "02",
    title: "Scheme & Special Returns",
    text: "Returns for specific taxpayer categories: GSTR-4 (annual, Composition Scheme), GSTR-5 (non-resident taxpayers), GSTR-6 (Input Service Distributors), GSTR-7 (TDS deductors), GSTR-8 (e-commerce operators collecting TCS), and GSTR-11 (UIN holders). Each captures a distinct supply or deduction flow and follows its own filing frequency.",
  },
  {
    number: "03",
    title: "Annual Returns & Reconciliation",
    text: "GSTR-9 is the annual consolidated return for regular taxpayers, summarising the year's outward and inward supplies, tax paid, and ITC. GSTR-9C is a self-certified reconciliation statement required where aggregate turnover exceeds ₹5 crore, matching audited financials to the GST returns. GSTR-10 is the final return filed when a registration is cancelled.",
  },
];

const GstFilingFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GST Returns in India</h2>

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

export default GstFilingFeatures;
