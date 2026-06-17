import React from "react";
import "./PvtllpFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 56 / Third Schedule Route",
    text: "A Private Limited Company is converted into an LLP under Section 56 read with the Third Schedule of the LLP Act, 2008. Form 18 (the conversion application and statement) is filed together with FiLLiP for LLP incorporation. On approval, the LLP is registered, the LLP agreement is filed in Form 3, and Form 14 intimation is sent to the Registrar of Companies.",
  },
  {
    number: "02",
    title: "All Shareholders Become Partners",
    text: "On conversion, all shareholders of the company — and no one else — become partners of the LLP, with the shareholding mapped into capital contribution. An LLP needs at least two designated partners with a DPIN, so a company with two or more shareholders satisfies this directly, and the company is deemed dissolved once the conversion is complete.",
  },
  {
    number: "03",
    title: "Clean Charges & Up-to-Date Filings",
    text: "The company must have no security interest (charge) subsisting on its assets at the time of application, all annual ROC filings and income-tax returns must be up to date, and the consent of all shareholders and secured creditors is required. Section 47(xiiib) eligibility is also reviewed so the conversion stays tax-neutral.",
  },
];

const PvtllpFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Features of the Conversion Route</h2>

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

export default PvtllpFeatures;
