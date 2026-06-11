import React from "react";
import "./EsiRetFeatures.css";

const types = [
  {
    number: "01",
    title: "Monthly Contribution Filing",
    text: "The core monthly compliance — declaring each Insured Person's wages on the ESIC portal and depositing the employee (0.75%) and employer (3.25%) contributions. Once wages are uploaded, a challan is generated and paid online by the 15th of the following month, covering every eligible worker for that wage month.",
  },
  {
    number: "02",
    title: "IP Registration & e-Pehchaan",
    text: "Every new eligible employee must be registered as an Insured Person (IP) on the ESIC portal, generating an Insurance Number and an e-Pehchaan card. This card — with the IP's and dependants' details — is what allows the worker and family to actually avail medical care at ESI dispensaries and hospitals.",
  },
  {
    number: "03",
    title: "Half-Yearly Contribution Periods",
    text: "ESI runs on two fixed contribution periods — April to September and October to March — each linked to a benefit period during which workers can claim cash benefits. Employers reconcile contributions across each period, apply the wage-ceiling continuation rule, and ensure every IP's record is complete and accurate.",
  },
];

const EsiRetFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Components of ESI Return Filing</h2>

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

export default EsiRetFeatures;
