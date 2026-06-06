import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Mandatory Registration (20+ Employees)",
    text: "Establishments employing 20 or more persons are mandatorily covered under the EPF Act from the date they cross the threshold. This applies irrespective of industry, nature of work, or wage levels. Registration must be completed within 30 days of crossing the threshold.",
  },
  {
    number: "02",
    title: "Voluntary Registration (<20 Employees)",
    text: "Establishments with fewer than 20 employees may voluntarily opt for EPF coverage by applying to the regional EPFO office. Once registered voluntarily, the coverage becomes binding and the employer cannot unilaterally withdraw from the scheme.",
  },
  {
    number: "03",
    title: "Notified Industries (Schedule I)",
    text: "Industries specified in Schedule I of the EPF Act — including factories engaged in textiles, metal processing, rubber goods, printing, and engineering — have historically been subject to specific threshold applicability based on Central Government notifications.",
  },
  {
    number: "04",
    title: "Central Government Extension",
    text: "Under Section 1(3)(b) of the EPF Act, the Central Government can extend EPF coverage to any class of establishment not already covered, via notification in the Official Gazette. This has brought new industries and sectors under mandatory coverage over time.",
  },
  {
    number: "05",
    title: "Exempted Establishments",
    text: "Establishments that already run their own provident fund scheme (approved by EPFO) may apply for and be granted exemption from the statutory EPF Scheme. They must maintain equivalent or better benefits than EPFO and comply with all EPFO reporting requirements.",
  },
  {
    number: "06",
    title: "International Workers",
    text: "Foreign nationals working in India (unless covered under a Social Security Agreement country) and Indian employees deputed abroad to SSA countries are covered under EPF as international workers, with separate contribution and withdrawal rules under the International Workers provisions.",
  },
];

const EPFRegApplicability = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of EPF Coverage in India</h2>
        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">{type.title}</h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EPFRegApplicability;
