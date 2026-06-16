import React from "react";
import "./PtopvtFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 366 Statutory Conversion",
    text: "The conversion uses Part I of Chapter XXI of the Companies Act, 2013 (Section 366) read with the Companies (Authorised to Register) Rules, 2014. The existing proprietorship business registers itself as a Private Limited Company through Form URC-1 filed alongside SPICe+ — a statutory route that carries the business, its contracts, and operations into the new company rather than requiring a separate wind-up.",
  },
  {
    number: "02",
    title: "URC-2 Notice & Creditor Consent",
    text: "Unlike a fresh incorporation, conversion requires transparency to existing stakeholders. A public notice in Form URC-2 is published in an English and a vernacular newspaper inviting objections, and a list of creditors with their consent (NOC) is filed. This protects creditors and the public and is a mandatory step before the ROC registers the company.",
  },
  {
    number: "03",
    title: "Minimum Two Members & Directors",
    text: "A Private Limited Company must have at least two shareholders and two directors (and can have up to 200 shareholders). As a sole proprietor, you bring in at least one more person — a co-founder, family member, or trusted associate — and the capital is structured between them. This is what makes the company able to raise equity and add shareholders later.",
  },
];

const PtopvtFeatures = () => {
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

export default PtopvtFeatures;
