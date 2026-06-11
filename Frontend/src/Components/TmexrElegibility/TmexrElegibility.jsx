import React from "react";
import "./TmexrElegibility.css";

const steps = [
  {
    title: "Examination Report Analysis",
    day: "Step 1",
    text: "We review your examination report in detail, identify whether the objections are under Section 9, Section 11, or procedural grounds, and pull the cited prior marks (if any). This tells us exactly what the reply must overcome and how strong your position is.",
  },
  {
    title: "Strategy & Evidence Gathering",
    day: "Step 2",
    text: "We decide the line of argument for each objection and tell you precisely what evidence to provide — for descriptiveness objections, proof of use such as invoices, advertisements, packaging, and sales data. Where needed, we plan an affidavit of use.",
  },
  {
    title: "Drafting the Reply",
    day: "Step 3",
    text: "Our attorney drafts a point-by-point reply addressing every objection with reasoning and case-law citations — distinguishing cited marks, establishing distinctiveness, and correcting any procedural defect. The affidavit and supporting documents are prepared alongside.",
  },
  {
    title: "Filing Within 30 Days",
    day: "Step 4",
    text: "The reply, together with any affidavit and evidence, is filed on the IP India portal well within the 30-day deadline from the date of the examination report. You receive the filed reply and acknowledgement for your records.",
  },
  {
    title: "Show-Cause Hearing (if scheduled)",
    day: "Step 5",
    text: "If the Examiner is not satisfied by the written reply, a show-cause hearing may be scheduled. We prepare written submissions and, where included, represent you at the virtual hearing to argue the case before the Registry.",
  },
  {
    title: "Acceptance & Journal Publication",
    day: "Step 6",
    text: "Once the objection is overcome, the mark is accepted and advertised in the Trademark Journal, opening the opposition window on the path to registration. We confirm the status and guide you on the next steps toward the ® certificate.",
  },
];

const TmexrElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Trademark Examination Reply Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six stages from report to acceptance. The reply is filed well within the 30-day deadline to keep your application alive.
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

export default TmexrElegibility;
