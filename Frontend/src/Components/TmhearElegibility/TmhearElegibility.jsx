import React from "react";
import "./TmhearElegibility.css";

const steps = [
  {
    title: "Hearing Notice Received",
    day: "Step 1",
    text: "The Trade Marks Registry issues a hearing notice on the IP India portal, fixing the date and mode (usually video conference). Share it with us the moment you receive it — typically a few weeks in advance — so we have time to prepare a strong case.",
  },
  {
    title: "Case Review & Strategy",
    day: "Step 2",
    text: "We study the underlying objection (examination report) or opposition record, identify the exact grounds to be argued, and build the line of argument — distinctiveness, prior use, differences from cited marks, or rebuttal of the opposition.",
  },
  {
    title: "Written Submissions & Evidence",
    day: "Step 3",
    text: "Our attorney drafts written submissions with case-law citations and compiles your supporting evidence — invoices, advertising, sales, and an affidavit of use where helpful. Submissions are filed in advance to frame the case before the hearing.",
  },
  {
    title: "Hearing Preparation",
    day: "Step 4",
    text: "We brief you on what to expect, confirm the video-hearing logins and schedule, and prepare answers to the questions the Hearing Officer is likely to raise. You walk into the hearing knowing exactly how your case will be argued.",
  },
  {
    title: "Attending the Hearing",
    day: "Step 5",
    text: "On the date, our attorney appears before the Hearing Officer and presents oral arguments, responds to the objection or opposition in real time, and presents your evidence. If genuinely needed, we request an adjournment within the limits allowed.",
  },
  {
    title: "Order & Next Steps",
    day: "Step 6",
    text: "After the hearing, the Hearing Officer passes a reasoned order — accepting the mark (toward registration), refusing it, or seeking more. We analyse the order and advise on the next step, whether that is publication, a review, or an appeal.",
  },
];

const TmhearElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Trademark Hearing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from hearing notice to the Registrar's order. We prepare, file submissions, and argue your case so you are never unprepared.
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

export default TmhearElegibility;
