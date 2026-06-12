import React from "react";
import "./CnllpFeatures.css";

const types = [
  {
    number: "01",
    title: "Voluntary Rebranding",
    text: "The most common reason — partners decide to change the name to reflect a new brand, a wider scope of business, a new market, or simply a fresher identity. This is a planned change driven entirely by the partners' decision, recorded through a supplementary LLP agreement and filed with the ROC.",
  },
  {
    number: "02",
    title: "Conflict or Trademark Issue",
    text: "Sometimes a change is necessary — the existing name is found to be identical or deceptively similar to another company, LLP, or registered trademark, or a third party objects. Changing to a clean, conflict-free name protects the LLP from disputes and removes the risk of being directed to change it later.",
  },
  {
    number: "03",
    title: "Direction by the Registrar / Change in Partners",
    text: "The Registrar may direct a change where a name was registered in error or is undesirable. A change is also often made when a partner whose personal name forms part of the LLP's title exits the firm, so the name no longer misrepresents who is involved. In each case the same RUN-LLP, Form 5, and Form 3 process applies.",
  },
];

const CnllpFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Common Reasons to Change an LLP's Name</h2>

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

export default CnllpFeatures;
