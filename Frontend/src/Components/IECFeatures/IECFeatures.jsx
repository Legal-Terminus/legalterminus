import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Individual / Proprietorship IEC",
    text: "Issued to individual traders or sole proprietors who import or export goods in their personal name. The IEC is linked to the proprietor's PAN. Ideal for small business owners, freelancers, and self-employed professionals engaging in international trade — no minimum turnover required.",
  },
  {
    number: "02",
    title: "Partnership / LLP IEC",
    text: "Issued to registered partnership firms or Limited Liability Partnerships (LLPs) engaged in international trade. The IEC is issued in the firm's name using its PAN. Partners gain legal recognition for imports and exports under the firm's identity and can access DGFT export promotion schemes.",
  },
  {
    number: "03",
    title: "Company / Organisation IEC",
    text: "Issued to Private Limited, Public Limited, One Person Companies, and other organisations engaging in import/export. Corporate IEC unlocks access to global markets, DGFT trade benefits, MEIS/SEIS export incentive schemes, and international payment gateway integration.",
  },
];

const IECFeatures = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of IEC Registration in India</h2>
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

export default IECFeatures;
