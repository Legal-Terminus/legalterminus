import React from "react";
import "./ItrIndFeatures.css";

const types = [
  {
    number: "01",
    title: "ITR-1 (Sahaj)",
    text: "The simplest return, for resident individuals with total income up to ₹50 lakh from salary or pension, one house property, and other sources like interest. Ideal for most salaried taxpayers without capital gains or business income. Quick to file with Form 16 and a 26AS / AIS reconciliation.",
  },
  {
    number: "02",
    title: "ITR-2",
    text: "For individuals and HUFs who have income from capital gains (shares, mutual funds, property), more than one house property, foreign income or assets, or are directors / hold unlisted shares. It covers everything in ITR-1 plus detailed capital-gains and foreign-asset schedules — but has no business or professional income.",
  },
  {
    number: "03",
    title: "ITR-3 & ITR-4 (Sugam)",
    text: "ITR-3 is for individuals and HUFs with income from a proprietary business or profession who maintain books. ITR-4 (Sugam) is for those opting for the presumptive scheme (Sections 44AD / 44ADA / 44AE) with income up to ₹50 lakh — popular with freelancers, consultants, and small traders who want a simpler computation.",
  },
];

const ItrIndFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Individual Income Tax Returns</h2>

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

export default ItrIndFeatures;
