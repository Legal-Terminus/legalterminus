import React from "react";
import "./CocomElegibility.css";

const steps = [
  {
    title: "Drafting the New Object Clause",
    day: "Step 1",
    text: "We understand the new business you want to add or pivot into and draft the amended object clause — worded to clearly authorise the new activity while being broad enough to support related growth, and reviewed against MCA naming and activity norms.",
  },
  {
    title: "Board Meeting & EGM Notice",
    day: "Step 2",
    text: "A board meeting is held to approve the proposed alteration and to call an Extraordinary General Meeting (EGM). We draft the board resolution and the EGM notice with the explanatory statement setting out the proposed change of objects.",
  },
  {
    title: "Special Resolution at the EGM",
    day: "Step 3",
    text: "At the EGM, the members pass a special resolution (at least 75% majority) approving the alteration of the object clause. We prepare the resolution and minutes and ensure the meeting and voting are conducted in line with the Companies Act.",
  },
  {
    title: "Filing Form MGT-14",
    day: "Step 4",
    text: "Form MGT-14 — the filing of the special resolution and the altered MOA — is filed with the ROC within 30 days of passing the resolution, signed with the director's DSC. The amended MOA and notice/explanatory statement are attached.",
  },
  {
    title: "ROC Approval & Updated MOA",
    day: "Step 5",
    text: "The ROC examines and registers the alteration. On approval, the object clause stands amended on the MCA record and the company holds an updated Memorandum of Association legally empowering it to carry on the new activities.",
  },
  {
    title: "Align GST, Licences & Records",
    day: "Step 6",
    text: "We assess consequential changes — updating GST business activities, applying for any new sector licences, and refreshing statutory registers — and advise on a name change if the company's name was tied to the old objects, so the diversification is fully compliant.",
  },
];

const CocomElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Object Clause Change Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from drafting the new objects to an updated MOA — and every downstream registration aligned.
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

export default CocomElegibility;
