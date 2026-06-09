import React from "react";
import "./SocietyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Charitable / Welfare Society",
    text: "The largest category. For NGOs, foundations, welfare associations focused on poverty alleviation, women / children / elderly welfare, disability support, livelihood programmes. Object covers general social welfare. Eligible across CSR Schedule VII categories with CSR-1 + 12A + 80G.",
  },
  {
    number: "02",
    title: "Educational Society",
    text: "For schools, colleges, scholarship bodies, vocational training, skill development, literacy missions. Object focuses on advancement of education. Often pairs with Section 10(23C) of Income Tax Act (alternative to 12A). Affiliation with state board / AICTE / UGC depending on scope.",
  },
  {
    number: "03",
    title: "Cultural / Literary Society",
    text: "For literary clubs, arts circles, cultural promotion bodies, heritage preservation, music / dance / theatre societies, language promotion. Object focuses on advancement of arts / culture / literature. CSR Schedule VII(v) eligible. Smaller donor base typically - 80G crucial.",
  },
  {
    number: "04",
    title: "Scientific / Research Society",
    text: "For research bodies, scientific associations, professional research consortiums, technology promotion. Object focuses on scientific research / advancement of science. Often eligible for DSIR recognition (Department of Scientific & Industrial Research) for tax benefits + grant funding.",
  },
  {
    number: "05",
    title: "Sports / Recreation Society",
    text: "For sports clubs, athletic associations, youth sports development, fitness clubs, recreational bodies. Object focuses on sports promotion. CSR Schedule VII(vii) eligible. Often paired with state sports authority partnerships and federation recognition.",
  },
  {
    number: "06",
    title: "Professional / Trade Association",
    text: "For professional bodies (CAs, doctors, lawyers in regional chapters), industry associations, traders' associations, exporters' bodies, alumni networks. Object focuses on professional / trade advancement. Member-driven governance is the defining feature here.",
  },
];

const SocietyPvtTypes = () => {
  return (
    <section className="soctyp-section">
      <div className="soctyp-container">
        <h2 className="soctyp-title">Types of Society Registration in India</h2>
        <div className="soctyp-cards">
          {types.map((type) => (
            <div className="soctyp-card" key={type.number}>
              <div className="soctyp-number">{type.number}</div>
              <h3 className="soctyp-card-title">{type.title}</h3>
              <p className="soctyp-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocietyPvtTypes;
