import React from "react";
import "./OPCFeatures.css";

const types = [
  {
    number: "01",
    title: "OPC Limited by Shares",
    subtitle: "Most Common",
    text: "This is the most widely used structure for a One Person Company. The owner's liability is limited only to the amount of share capital that is still unpaid. The owner holds shares to show ownership and investment in the business. This structure is best for businesses that want to earn profits and grow.",
  },
  {
    number: "02",
    title: "OPC Limited by Guarantee",
    subtitle: "Non-Profit / Social",
    text: "Mostly used for non-profit organisations, social businesses, or professional groups. In this type, there are no shares. Instead, the owner promises to pay a fixed amount only if the company is wound up. The owner's liability is limited only to this guaranteed amount.",
  },
];

const OPCFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of One Person Company Registration in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="opc-features-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="opc-features-note">
          <strong>Note:</strong> For most solo founders and individual entrepreneurs, OPC Limited by Shares is the standard and most suitable choice. If you need guidance on the right structure,{" "}
          <strong>Book a Free Consultation</strong> and our experts will help you decide.
        </p>

      </div>
    </section>
  );
};

export default OPCFeatures;
