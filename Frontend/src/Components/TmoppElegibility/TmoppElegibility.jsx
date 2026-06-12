import React from "react";
import "./TmoppElegibility.css";

const steps = [
  {
    title: "Notice of Opposition",
    day: "Stage 1",
    text: "Within 4 months of a mark's publication in the Trademark Journal, the opponent files a Notice of Opposition (Form TM-O) setting out the grounds. We draft the grounds around prior use, Section 9/11, and likelihood of confusion, and file it with the government fee before the window closes.",
  },
  {
    title: "Counter-Statement",
    day: "Stage 2",
    text: "The applicant must file a Counter-Statement within 2 months of receiving the opposition, denying the claims and asserting rights to the mark. Miss this deadline and the application is abandoned — so we act immediately on receipt of the notice.",
  },
  {
    title: "Opponent's Evidence (Rule 45)",
    day: "Stage 3",
    text: "The opponent files evidence by affidavit supporting the opposition — proof of prior use, reputation, sales, advertising, and similarity — within the prescribed time, or may waive it and rely on the notice. We compile and present this evidence to make the strongest case.",
  },
  {
    title: "Applicant's Evidence (Rule 46)",
    day: "Stage 4",
    text: "The applicant files evidence by affidavit in support of the application — establishing honest adoption, use, distinctiveness, and differences from the cited mark. This is the applicant's chance to rebut the opposition with documents, and we structure it for maximum impact.",
  },
  {
    title: "Evidence in Reply (Rule 47)",
    day: "Stage 5",
    text: "The opponent may file evidence strictly in reply to the applicant's evidence within the prescribed period. This closes the evidence stage. We ensure all affidavits are filed on time and properly attested so nothing is rejected on technical grounds.",
  },
  {
    title: "Hearing & Decision",
    day: "Stage 6",
    text: "The Registrar sets a hearing where both sides present oral arguments. After the hearing, the Registrar issues a reasoned decision allowing or rejecting the opposition. We prepare submissions, represent you at the hearing, and advise on next steps after the order.",
  },
];

const TmoppElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Trademark Opposition Process — Stage by Stage
      </h2>
      <p className="opcelg-subheading">
        Six stages from notice to decision, each on a strict statutory deadline. Timely action and strong evidence carry the case.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TmoppElegibility;
