import React from "react";
import "./CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Company Limited by Shares",
    subtitle: "Most Common",
    text: "This is the go-to structure for startups and growth-stage businesses. Shareholders' liability is limited to the unpaid amount on their shares — so your personal bank account stays safe even if the business hits a rough patch. Perfect for raising capital from angel investors or VCs.",
  },
  {
    number: "02",
    title: "Company Limited by Guarantee",
    subtitle: "Common for Non-Profits",
    text: "Members commit to contributing a fixed amount in the event of winding up — but there's no share capital involved. Preferred by non-profit entities, trade associations, and charitable organisations that want corporate structure without the equity game.",
  },
  {
    number: "03",
    title: "Unlimited Company",
    subtitle: "Rare",
    text: "No ceiling on members' liability — they're personally on the hook for the company's debts. This structure is rarely used and is typically chosen only by closely held businesses with complete control over operations and very specific financial goals.",
  },
];

const CopyPvtTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">

        <h2 className="cpvt-title">Types of Private Limited Companies in India</h2>

        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="cpvt-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="cpvt-note">
          <strong>Note:</strong> For most founders and entrepreneurs, Company Limited by Shares is the right call. If you're unsure,{" "}
          <strong>Book a Free Consultation</strong> and we'll help you decide.
        </p>

      </div>
    </section>
  );
};

export default CopyPvtTypes;
