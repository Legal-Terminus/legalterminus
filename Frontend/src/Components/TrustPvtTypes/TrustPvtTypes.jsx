import React from "react";
import "./TrustPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Public Charitable Trust",
    text: "The default for NGOs, foundations, and impact vehicles. Object: relief of poverty, advancement of education, healthcare, environment, social welfare, advancement of public utility. Beneficiaries are the public at large (or a class of public). 12A + 80G + CSR-1 + FCRA eligible. Most common Trust type.",
  },
  {
    number: "02",
    title: "Private Trust",
    text: "For specific beneficiaries - family, individuals, or a small group. Governed by the Indian Trusts Act, 1882. Common for estate planning, succession planning, family-purpose vehicles, child / spouse welfare trusts. Income tax treatment differs - typically taxed in the hands of beneficiaries or at maximum marginal rate.",
  },
  {
    number: "03",
    title: "Public Religious Trust",
    text: "For religious purposes - temple management, religious endowments, places of worship. Object focuses on religious teaching, practice, propagation. Religious denomination matters for the object clause. In some states (Maharashtra, Karnataka) governed by separate religious endowment legislation.",
  },
  {
    number: "04",
    title: "Educational Trust",
    text: "Sub-type of Public Charitable - exclusively for advancement of education. Schools, colleges, scholarship trusts, vocational training centres. Section 10(23C) of Income Tax Act may apply (alternative to 12A). Affiliation requirements with state education board / AICTE / UGC depending on scope.",
  },
  {
    number: "05",
    title: "Medical / Healthcare Trust",
    text: "Sub-type of Public Charitable - exclusively for medical relief / healthcare. Hospitals, dispensaries, healthcare research, public health initiatives. Section 10(23C) may apply. Often paired with FCRA for international medical-donor receipts.",
  },
  {
    number: "06",
    title: "Mixed Public Charitable & Religious Trust",
    text: "Combines charitable AND religious objects (e.g., a temple-managed school + dispensary). Common in traditional Indian non-profit structures. Special object-clause drafting needed - charitable activities should be substantial enough that 12A is not denied for religious-heavy bias.",
  },
];

const TrustPvtTypes = () => {
  return (
    <section className="trutyp-section">
      <div className="trutyp-container">
        <h2 className="trutyp-title">Types of Trust Registration in India</h2>
        <div className="trutyp-cards">
          {types.map((type) => (
            <div className="trutyp-card" key={type.number}>
              <div className="trutyp-number">{type.number}</div>
              <h3 className="trutyp-card-title">{type.title}</h3>
              <p className="trutyp-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPvtTypes;
