import React from "react";
import "./TmoppFeatures.css";

const types = [
  {
    number: "01",
    title: "Notice of Opposition — Section 9 Grounds (Offensive)",
    text: "You spot an application in the Journal that's descriptive / generic / deceptive / lacking distinctiveness. We file Notice of Opposition under Section 9 absolute grounds — arguing the mark is unregistrable. Common where a competitor tries to register an industry-descriptive term to monopolise it. Up to 25 grounds drafted; usually 8-15 grounds suffice.",
  },
  {
    number: "02",
    title: "Notice of Opposition — Section 11 Grounds (Offensive)",
    text: "You spot a copycat mark similar to YOUR existing trademark / pending application / well-known mark. We file Notice of Opposition under Section 11(1)/(2) — arguing likelihood of confusion + dilution + unfair advantage. Includes phonetic / visual / structural / conceptual comparison + class / goods overlap + market presence evidence. The MOST COMMON opposition scenario in India.",
  },
  {
    number: "03",
    title: "Counter Statement — Defending Section 9 Opposition (Defensive)",
    text: "Someone opposed your application alleging it's descriptive / generic / lacking distinctiveness (Section 9). We draft Counter Statement under Rule 44 admitting / denying each ground + asserting acquired distinctiveness + market presence evidence. Must be filed within rigid 2-month window. Available across all plan tiers.",
  },
  {
    number: "04",
    title: "Counter Statement — Defending Section 11 Opposition (Defensive)",
    text: "Someone opposed your application citing their earlier mark (Section 11). We draft Counter Statement distinguishing on three-factor test + class / goods difference + co-existence arguments + prior use claim. Strongest defence when supported by evidence of independent adoption + actual use in commerce. Available across all plan tiers.",
  },
  {
    number: "05",
    title: "Full Lifecycle with Evidence + Hearing",
    text: "Complex opposition matters that proceed through full lifecycle: pleadings → evidence (Rules 45 / 46) → reply evidence (Rule 47) → final hearing (Rule 50) → Registrar's order. Supreme tier covers end-to-end ownership + adjournment management. Typical timeline 2-5 years from start to order. Most contested oppositions follow this path.",
  },
  {
    number: "06",
    title: "Well-Known Mark + Defensive Marketing (Offensive Premium)",
    text: "Where the opposed application is by a copycat exploiting a well-known mark (Section 11(2)) — we plead expanded grounds including reputation evidence + cross-class protection + dilution arguments. Often requires market research + advertising expenditure evidence + brand recognition surveys. Recommended Enriched / Supreme tier for the evidence weight required.",
  },
];

const TmoppFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Opposition</h2>

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

export default TmoppFeatures;
