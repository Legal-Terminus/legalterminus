import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "ISO 9001 — Quality Management",
    text: "The most widely adopted ISO standard globally. Ensures that your products/services consistently meet customer and regulatory requirements. Required for government tenders, enterprise vendor empanelment, and export contracts. Applicable to any industry and any size of organisation.",
  },
  {
    number: "02",
    title: "ISO 14001 — Environmental Management",
    text: "Helps organisations reduce environmental impact through efficient resource use and waste reduction. Mandatory for manufacturing plants, construction firms, and businesses handling hazardous materials. Required for many government and international contracts.",
  },
  {
    number: "03",
    title: "ISO 27001 — Information Security",
    text: "The global standard for Information Security Management Systems (ISMS). Critical for IT companies, SaaS platforms, fintech, healthcare, and any business handling personal or financial data. Often a prerequisite for enterprise and government digital contracts.",
  },
  {
    number: "04",
    title: "ISO 45001 — Occupational Health & Safety",
    text: "Replaces OHSAS 18001. Ensures safe and healthy workplaces by preventing work-related injuries and occupational health conditions. Required for construction, manufacturing, logistics, and mining companies under Indian labour law frameworks.",
  },
  {
    number: "05",
    title: "ISO 22000 — Food Safety Management",
    text: "The international standard for Food Safety Management Systems (FSMS). Applies throughout the food supply chain — farmers, processors, retailers, and food service businesses. Often paired with HACCP for complete food safety compliance and export eligibility.",
  },
];

const ISOTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of ISO Certification in India</h2>
        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">{type.title}</h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ISOTypes;
