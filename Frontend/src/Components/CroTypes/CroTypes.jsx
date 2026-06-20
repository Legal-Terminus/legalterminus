import React from "react";
import "../OPCFeatures/OPCFeatures.css";

const types = [
  {
    number: "01",
    title: "Private Limited Company",
    text: "The most popular choice for growth-focused businesses. It has a separate legal identity, clear separation of ownership and management, limited liability, and is the structure investors prefer. Needs a minimum of 2 members and 2 directors, with up to 200 members.",
  },
  {
    number: "02",
    title: "One Person Company (OPC)",
    text: "Built for solo entrepreneurs who want a corporate identity with limited liability. A single owner runs the company with liability limited to their shares, while still enjoying the credibility of a registered company — with lighter compliance than a Private Limited.",
  },
  {
    number: "03",
    title: "Limited Liability Partnership (LLP)",
    text: "The simplest corporate structure for professional firms and partnerships. It combines limited liability with the flexibility of a partnership and carries lower compliance requirements, making it cost-effective to run year on year.",
  },
  {
    number: "04",
    title: "Public Limited Company",
    text: "The most transparent form of company, able to raise capital from the public and trade its shares. It builds strong investor trust but carries the heaviest compliance. Needs a minimum of 7 members and 3 directors.",
  },
];

const CroTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Companies You Can Register in Odisha</h2>

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

export default CroTypes;
