import React from "react";
import "./TrustPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Public Charitable Trusts",
    text: "Created for the benefit of the general public — covering education, healthcare, religious activities, or social welfare. Often registered under state laws (e.g., Bombay Public Trust Act) and eligible for 12A and 80G tax benefits.",
  },
  {
    number: "02",
    title: "Private Trusts",
    text: "Formed for the benefit of specific individuals or a particular family. Governed by the Indian Trusts Act, 1882, these trusts serve defined private beneficiaries and typically involve family wealth management.",
  },
  {
    number: "03",
    title: "Public-cum-Private Trusts",
    text: "Trusts with both public and private purposes. Part of the income is used for public charitable activities while the remainder is earmarked for specific private beneficiaries as defined in the trust deed.",
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
