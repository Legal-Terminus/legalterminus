import React from "react";
import "../OPCFeatures/OPCFeatures.css";

const types = [
  {
    number: "01",
    title: "Employer Registration (RC — Registration Certificate)",
    text: "Any person or entity employing one or more employees must obtain an RC from the state PT authority. The employer deducts PT from employee salaries per the applicable slab and remits the total amount via challan. Monthly returns are filed reporting headcount and deductions.",
  },
  {
    number: "02",
    title: "Self-Employed / Professional Registration (EC — Enrolment Certificate)",
    text: "Self-employed individuals — lawyers, doctors, architects, CAs, consultants, traders — must register independently through an EC. PT is self-assessed and paid annually or in installments. The maximum is ₹2,500/year per constitutional cap.",
  },
  {
    number: "03",
    title: "Company / LLP Registration",
    text: "Companies and LLPs are treated as employers and must obtain an RC. Directors drawing salary from the company are subject to employer deduction at source. Partners in LLPs may need both EC (self) and RC (employer) depending on state rules.",
  },
  {
    number: "04",
    title: "Freelancer / Contract Worker Compliance",
    text: "Freelancers and gig workers engaging clients in PT-applicable states may be liable for EC registration. State-by-state applicability applies — some states exempt freelancers below a threshold. We assess your situation and advise on the applicable registration category.",
  },
];

const ProfTaxTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Professional Tax Registration in India</h2>

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

export default ProfTaxTypes;
