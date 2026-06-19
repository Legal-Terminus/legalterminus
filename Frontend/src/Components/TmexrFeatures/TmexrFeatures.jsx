import React from "react";
import "./TmexrFeatures.css";

const types = [
  {
    number: "01",
    title: "Section 9 Reply — Distinctiveness Defence",
    text: "Examiner objects on absolute grounds: the mark is descriptive / generic / lacking distinctiveness. Reply strategy: cite acquired distinctiveness via continuous use + market evidence + sales data + advertising spend + visual / stylistic distinguishing features. Elemental tier covers the drafting + filing. Most replies of this type succeed on the written reply alone.",
  },
  {
    number: "02",
    title: "Section 11 Reply — Distinguishing from Cited Marks",
    text: "Examiner cites earlier registered / pending marks as similar (the most common scenario). Reply strategy: distinguish on the THREE-FACTOR TEST (phonetic / visual / structural / conceptual), demonstrate class / goods / market difference, file a co-existence agreement (if available with the prior mark holder), provide consumer-confusion analysis. Elemental tier covers this; complex multi-citation cases may need Supreme.",
  },
  {
    number: "03",
    title: "Procedural / Documentation Defect Reply",
    text: "Examiner flags procedural issues — wrong class, missing User Affidavit (for prior use claims), missing translation (for non-English marks), incorrect classification of goods / services. Reply strategy: file Form TM-M (₹900) for amendment + supporting documents + corrections. Elemental tier covers this end-to-end.",
  },
  {
    number: "04",
    title: "Multiple Replies + Hearings",
    text: "Complex matters — the first reply addresses some objections; the Examiner issues a second objection requiring a responsive reply; the matter then proceeds to hearing. Supreme tier covers UP TO 2 REPLY FILINGS + UP TO 2 SHOW CAUSE HEARINGS in one engagement. Typical for cases with multi-citation Section 11 objections or where the application has been amended mid-prosecution.",
  },
];

const TmexrFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Reply of Examination Report</h2>

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

export default TmexrFeatures;
