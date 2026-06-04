import React from "react";
import "./PublicltdFeatures.css";

const types = [
  {
    number: "01",
    title: "Listed Public Company",
    subtitle: "IPO / Exchange-Traded",
    text: "Shares listed on NSE / BSE or another SEBI-recognised exchange. Bound by SEBI (LODR) Regulations on top of the Companies Act. The 'gold standard' structure for IPO-bound businesses.",
  },
  {
    number: "02",
    title: "Unlisted Public Company",
    subtitle: "Pre-IPO / Private PLC",
    text: "Same PLC structure, no exchange listing. Most common starting point — gives you the 7-subscriber / 3-director template without the SEBI compliance overhead. Conversion to Listed via IPO at any time.",
  },
  {
    number: "03",
    title: "Government Company",
    subtitle: "PSU / State-Owned",
    text: "Public Sector Undertaking (PSU) where ≥ 51% of paid-up share capital is held by the Central / State Government or jointly. Defined under Section 2(45). Subject to CAG audit and special governance norms.",
  },
  {
    number: "04",
    title: "Foreign Subsidiary Public Company",
    subtitle: "FDI / FEMA Governed",
    text: "An Indian PLC where ≥ 50% of share capital is held by a foreign body corporate. Treated as 'Indian' for Companies Act purposes but triggers FEMA, RBI FDI reporting (FC-GPR), and transfer pricing compliance.",
  },
  {
    number: "05",
    title: "Holding Public Company",
    subtitle: "Parent Entity",
    text: "A PLC that controls (≥ 50% voting / board control) one or more subsidiary companies. Requires consolidated financials, related-party-transaction disclosure under Section 188, and a longer audit perimeter.",
  },
  {
    number: "06",
    title: "Statutory Public Company",
    subtitle: "Act of Parliament",
    text: "Created by a special Act of Parliament or State Legislature (e.g., LIC, RBI, IRCTC pre-listing). Governance is a hybrid of the parent statute + Companies Act. Rare; mostly relevant for legacy public sector reforms.",
  },
];

const PublicltdFeatures = () => {
  return (
    <section className="pub-types-section">
      <div className="pub-types-container">

        <h2 className="pub-types-title">Types of Public Limited Company in India</h2>

        <div className="pub-types-cards">
          {types.map((type) => (
            <div className="pub-types-card" key={type.number}>
              <div className="pub-types-number">{type.number}</div>
              <h3 className="pub-types-card-title">
                {type.title}
                {type.subtitle && (
                  <span className="pub-types-card-subtitle"> ({type.subtitle})</span>
                )}
              </h3>
              <p className="pub-types-card-text">{type.text}</p>
            </div>
          ))}
        </div>

        <p className="pub-types-note">
          <strong>Note:</strong> For most businesses, a Listed Public Company is chosen when they plan to raise funds from the public through the stock exchange. If you need guidance on the right structure,{" "}
          <strong>Book a Free Consultation</strong> and our experts will help you decide.
        </p>

      </div>
    </section>
  );
};

export default PublicltdFeatures;
