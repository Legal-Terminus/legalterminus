import React from "react";
import "./PtoopcFeatures.css";

const types = [
  {
    number: "01",
    title: "Single Member, Full Control",
    text: "An OPC has exactly one member who is also typically its sole director — so you keep complete ownership and control of the business, just like in a proprietorship. There are no partners or co-shareholders to consult. You make every decision, while the company structure sits around you to provide the legal protection a proprietorship cannot.",
  },
  {
    number: "02",
    title: "Mandatory Nominee (Form INC-3)",
    text: "Because there is only one member, every OPC must appoint a nominee at incorporation through Form INC-3. The nominee — an Indian citizen and resident — steps into the member's shoes in the event of death or incapacity, ensuring the company continues uninterrupted. This nominee mechanism is what gives an OPC perpetual succession despite having a single owner.",
  },
  {
    number: "03",
    title: "Limited Liability & Separate Entity",
    text: "Once incorporated, the OPC is a distinct legal person separate from its owner. Its debts and obligations are the company's, not yours personally — your liability is limited to the capital you put in. The company can own assets, sue and be sued, and enter contracts in its own name, giving the solo entrepreneur the same protection a larger company enjoys.",
  },
];

const PtoopcFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Key Features of a One Person Company</h2>

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

export default PtoopcFeatures;
