import React from "react";
import "./CacomFeatures.css";

const types = [
  {
    number: "01",
    title: "Within the Same City / Local Limits",
    text: "The simplest change — shifting the registered office within the same city, town, or village. It needs only a board resolution and the filing of Form INC-22 with the new address proof within 30 days. No special resolution or Regional Director approval is required, so it is the quickest and cheapest type of change.",
  },
  {
    number: "02",
    title: "Within the State (Different City / ROC)",
    text: "Moving to a different city or town within the same state. This requires a special resolution passed by the members (filed in Form MGT-14) in addition to Form INC-22. Where the move shifts the company to the jurisdiction of a different Registrar of Companies, Regional Director approval is also needed before the change is registered.",
  },
  {
    number: "03",
    title: "From One State to Another",
    text: "The most involved change, as it alters the registered-office clause of the Memorandum of Association. It requires a special resolution, a newspaper advertisement (Form INC-26), and an application to the Regional Director (Form INC-23). After the RD's order is obtained and filed (Form INC-28), Form INC-22 records the new address, coordinating with both the old and new ROCs.",
  },
];

const CacomFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Registered Office Change</h2>

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

export default CacomFeatures;
