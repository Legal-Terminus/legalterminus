import React from "react";
import "./PFRtypes.css";

const types = [
  {
    number: "01",
    title: "Partnership at Will",
    subtitle: "Most Flexible",
    text: "A partnership at will is formed without deciding any fixed time period. The partners can decide when they want to continue or dissolve the firm. The profit earned is considered income of each partner, and every partner is responsible for paying the firm's debts.",
  },
  {
    number: "02",
    title: "Particular Partnership",
    subtitle: "Fixed Purpose",
    text: "A particular partnership is created for a specific purpose or project and is usually temporary in nature. It may end after the work is completed or on a decided date, but partners can also extend it with mutual agreement.",
  },
  {
    number: "03",
    title: "Limited Liability Partnership",
    subtitle: "Corporate Structure",
    text: "An LLP is governed by the LLP Act, 2008 and works like a corporate business structure. Partners have limited liability — they are responsible only up to the amount invested. Personal assets are generally protected from business debts.",
  },
];

const PFRTypes = () => {
  return (
    <section className="pfr-types-section">
      <div className="pfr-types-container">

        <h2 className="pfr-types-title">Types of Partnership Firm Registration</h2>

        <div className="pfr-types-cards">
          {types.map((type) => (
            <div className="pfr-types-card" key={type.number}>
              <div className="pfr-types-number">{type.number}</div>
              <h3 className="pfr-types-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="pfr-types-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="pfr-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="pfr-types-note">
          <strong>Note:</strong> Not sure which partnership type suits your business?{" "}
          <strong>Book a Free Consultation</strong> and we'll help you decide.
        </p>

      </div>
    </section>
  );
};

export default PFRTypes;
