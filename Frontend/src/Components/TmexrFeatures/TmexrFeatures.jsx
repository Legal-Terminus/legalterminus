import React from "react";
import "./TmexrFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 9 — Absolute Grounds",
    text: "These objections say the mark itself is not registrable — it is descriptive of the goods/services, generic, laudatory, or otherwise lacks distinctive character. The reply must argue that the mark is inherently distinctive, or has acquired distinctiveness through use, supported by evidence such as invoices, advertising, and sales figures (often via an affidavit of use).",
  },
  {
    number: "02",
    title: "Section 11 — Relative Grounds",
    text: "These objections cite one or more earlier marks that are identical or deceptively similar to yours in the same or related class. The reply distinguishes your mark from the cited marks on visual, phonetic, and conceptual differences, differences in goods/services, or argues honest concurrent use — sometimes supported by a consent or coexistence arrangement.",
  },
  {
    number: "03",
    title: "Procedural & Formality Objections",
    text: "The report may also raise procedural issues — an incorrect specification of goods, a wrong class, missing user details, an unsigned or defective Power of Attorney, or a need to file an affidavit. These are addressed by correcting the records, filing the required documents, and clarifying the application so it complies with the Trade Marks Rules.",
  },
];

const TmexrFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Objections We Reply To</h2>

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

export default TmexrFeatures;
