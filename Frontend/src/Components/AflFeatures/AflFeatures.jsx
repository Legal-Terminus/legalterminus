import React from "react";
import "./AflFeatures.css";

const types = [
  {
    number: "01",
    title: "Annual Return — Form 11",
    text: "Form 11 is the LLP's annual return, capturing details of all partners and designated partners, total contribution received, and any changes during the financial year. It must be filed within 60 days of the close of the financial year — i.e. by 30 May each year — by every LLP, irrespective of turnover or business activity.",
  },
  {
    number: "02",
    title: "Statement of Account & Solvency — Form 8",
    text: "Form 8 is the LLP's statement of accounts and solvency, declaring the financial position — assets, liabilities, income, and expenditure — and that the LLP is able to pay its debts. It is filed within 30 days from the end of six months of the financial year — i.e. by 30 October — and is signed by designated partners and certified by a professional.",
  },
  {
    number: "03",
    title: "DIR-3 KYC, ITR-5 & Tax Audit",
    text: "Beyond the two MCA forms, every designated partner with a DIN/DPIN must file DIR-3 KYC by 30 September. The LLP also files its income tax return in Form ITR-5. A tax audit under the Income Tax Act is required only where turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh.",
  },
];

const AflFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Annual Filings &amp; ROC Forms for an LLP</h2>

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
