import React from "react";
import "./TmhearFeatures.css";

const types = [
  {
    number: "01",
    title: "Show-Cause Hearing (Examination)",
    text: "Scheduled when the Examiner is not satisfied with your written reply to the examination report. The Hearing Officer gives you a chance to 'show cause' why the mark should be registered despite the objection under Section 9 or Section 11. You argue distinctiveness, prior use, or differences from cited marks — and the Officer then accepts, refuses, or seeks more material.",
  },
  {
    number: "02",
    title: "Opposition Hearing",
    text: "Held during opposition proceedings, after the notice of opposition, counter-statement, and evidence stages are complete. Both the opponent and the applicant present oral arguments before the Hearing Officer, who weighs the grounds, evidence of use and reputation, and likelihood of confusion before passing a reasoned decision allowing or rejecting the opposition.",
  },
  {
    number: "03",
    title: "Adjournment & Review Hearings",
    text: "A hearing may be adjourned a limited number of times (via Form TM-M) if more time is genuinely needed, at the Registry's discretion. After an order, a review hearing can arise where a party seeks reconsideration of the Registrar's decision. We handle adjournment requests and review proceedings as part of full-service representation.",
  },
];

const TmhearFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Trademark Hearings</h2>

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

export default TmhearFeatures;
