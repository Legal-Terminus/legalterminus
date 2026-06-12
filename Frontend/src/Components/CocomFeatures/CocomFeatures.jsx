import React from "react";
import "./CocomFeatures.css";

const types = [
  {
    number: "01",
    title: "Adding New Objects",
    text: "The most common change — inserting new business activities alongside the existing ones, so the company can expand into a fresh line without giving up what it already does. For example, a trading company adding manufacturing, or a services firm adding e-commerce. The existing objects remain, and the new ones are added to the MOA by special resolution.",
  },
  {
    number: "02",
    title: "Modifying or Replacing Objects",
    text: "Used when the company is pivoting — narrowing, broadening, or completely replacing its main objects to reflect a new direction. This is common when a business model changes substantially or the original objects no longer describe what the company actually does. The clause is rewritten and adopted through the same Section 13 process.",
  },
  {
    number: "03",
    title: "Updating Outdated or Restrictive Objects",
    text: "Older companies often have narrow or outdated object clauses that block new opportunities or modern activities. Amending them modernises the MOA, removes ambiguity, and gives the company the legal headroom to take on new contracts, tenders, or sectors that its original objects didn't contemplate.",
  },
];

const CocomFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Object Clause Change</h2>

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

export default CocomFeatures;
