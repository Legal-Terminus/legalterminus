import React from "react";
import "./LtopvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 366 Statutory Conversion",
    text: "An LLP is registered as a Private Limited Company under Section 366 of the Companies Act, 2013 (Companies Authorised to Register) read with the Companies (Authorised to Register) Rules, 2014. Form URC-1 is filed alongside SPICe+, and on approval the company is incorporated under Section 367. The existing business continues under the new company, and the LLP is dissolved.",
  },
  {
    number: "02",
    title: "Partners Become Shareholders",
    text: "On conversion, all partners of the LLP become shareholders of the company, with their capital contribution mapped into share capital. A Private Limited Company needs a minimum of two directors and two shareholders — so an LLP with two or more partners satisfies this directly, and the cap table is built from the existing partner structure.",
  },
  {
    number: "03",
    title: "Registrar NOC & URC-2 Notice",
    text: "Conversion requires a No-Objection Certificate from the Registrar where the LLP is registered, plus a public notice in Form URC-2 published in an English and a vernacular newspaper inviting objections. Together with the CA-certified statement of accounts, the latest LLP agreement, and creditor consent, these are the safeguards the ROC requires before registering the company.",
  },
];

const LtopvtFeatures = () => {
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

export default LtopvtFeatures;
