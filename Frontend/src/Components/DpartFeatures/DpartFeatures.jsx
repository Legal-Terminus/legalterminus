import React from "react";
import "./DpartFeatures.css";

const types = [
  {
    number: "01",
    title: "Dissolution by Agreement / Notice",
    text: "The most common and amicable route. Under Section 40, partners can dissolve the firm at any time with mutual consent through a dissolution deed. For a partnership at will, Section 43 lets any partner dissolve the firm by giving written notice to the others. This is the cleanest way to close — everyone agrees, signs the deed, and settles accounts.",
  },
  {
    number: "02",
    title: "Dissolution on Contingency / Compulsory",
    text: "A firm may dissolve automatically on certain events under Section 42 — expiry of a fixed term, completion of the venture it was formed for, or the death or insolvency of a partner (subject to the deed). Under Section 41, dissolution is compulsory when all but one partner become insolvent, or the business becomes unlawful. We document the closure that follows these events.",
  },
  {
    number: "03",
    title: "Dissolution by the Court",
    text: "Where partners cannot agree, Section 44 allows a partner to petition the court to dissolve the firm — on grounds such as a partner's unsoundness of mind, permanent incapacity, misconduct, persistent breach of the agreement, transfer of interest, continuous losses, or any other just and equitable ground. This is the contested route, used when an amicable dissolution is not possible.",
  },
];

const DpartFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Modes of Dissolving a Partnership Firm</h2>

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

export default DpartFeatures;
