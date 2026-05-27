import React from "react";
import "./IncorporationPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Company Limited by Shares",
    subtitle: "Most Common",
    text: "This is the most widely used structure for a Wholly Owned Subsidiary in India. The parent foreign company holds 100% of the shares, and liability is limited to the unpaid amount on those shares — keeping the parent's global assets fully protected.",
  },
  {
    number: "02",
    title: "Company Limited by Guarantee",
    subtitle: "Non-Profit / Association",
    text: "Members commit to contributing a fixed amount upon winding up, with no share capital involved. This structure is suitable for non-profit WOS entities, trade associations, or liaison-type subsidiaries that require corporate structure without equity participation.",
  },
  {
    number: "03",
    title: "Unlimited Company",
    subtitle: "Rare",
    text: "No cap on members' liability — the parent company bears unlimited responsibility for the subsidiary's debts. This structure is rarely chosen and is typically considered only when the parent seeks maximum control and operates in a tightly held environment.",
  },
];

const IncorporationPvtTypes = () => {
  return (
    <section className="incorp-types-section">
      <div className="incorp-types-container">

        <h2 className="incorp-types-title">Types of Wholly Owned Subsidiary in India</h2>

        <div className="incorp-types-cards">
          {types.map((type) => (
            <div className="incorp-types-card" key={type.number}>
              <div className="incorp-types-number">{type.number}</div>
              <h3 className="incorp-types-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="incorp-types-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="incorp-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="incorp-types-note">
          <strong>Note:</strong> For most foreign companies entering India, Company Limited by Shares is the standard choice for a WOS. If you need guidance on the right structure,{" "}
          <strong>Book a Free Consultation</strong> and our experts will help you decide.
        </p>

      </div>
    </section>
  );
};

export default IncorporationPvtTypes;
