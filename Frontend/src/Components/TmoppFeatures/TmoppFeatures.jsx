import React from "react";
import "./TmoppFeatures.css";

const types = [
  {
    number: "01",
    title: "Filing an Opposition (Opponent)",
    text: "If a mark published in the journal is identical or deceptively similar to yours, you can file a Notice of Opposition (Form TM-O) within 4 months to stop it from being registered. Grounds typically rest on prior use and reputation, likelihood of confusion under Section 11, non-distinctiveness under Section 9, or bad-faith filing — all backed by documentary evidence.",
  },
  {
    number: "02",
    title: "Defending an Opposition (Applicant)",
    text: "If your application is opposed, you defend it by filing a Counter-Statement within 2 months, denying the opposition's claims and asserting your right to the mark. You then file evidence establishing your adoption, use, and distinctiveness. A timely, well-evidenced defence keeps your application alive and moving toward registration.",
  },
  {
    number: "03",
    title: "Evidence & Hearing Stages",
    text: "After the counter-statement, both sides file evidence by affidavit — opponent's evidence (Rule 45), applicant's evidence (Rule 46), and opponent's evidence in reply (Rule 47) — each within fixed timelines. The Registrar then holds a hearing where both sides argue, and issues a reasoned decision either allowing or rejecting the opposition.",
  },
];

const TmoppFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">The Two Sides &amp; Stages of Opposition</h2>

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
