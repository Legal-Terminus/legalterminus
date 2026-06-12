import React from "react";
import "./IacapElegibility.css";

const steps = [
  {
    title: "Check the Articles of Association",
    day: "Step 1",
    text: "We first verify that the company's AOA authorises an increase in authorised capital. If the Articles are silent or restrictive, they are amended by a special resolution (filed in Form MGT-14) before the increase can proceed — so the path is clear from the start.",
  },
  {
    title: "Board Meeting & EGM Notice",
    day: "Step 2",
    text: "A board meeting is held to approve the proposed increase and to call an Extraordinary General Meeting (EGM). We draft the board resolution and the EGM notice with the explanatory statement setting out the new authorised capital and the altered capital clause.",
  },
  {
    title: "Resolution at the General Meeting",
    day: "Step 3",
    text: "At the EGM, the members pass the resolution (ordinary, unless the Articles require special) to increase the authorised capital and alter the MOA's capital clause. We prepare the resolution and minutes and ensure the meeting is conducted correctly.",
  },
  {
    title: "Compute Fee & Stamp Duty",
    day: "Step 4",
    text: "We calculate the MCA government fee and the state stamp duty payable on the amount of the increase — the main out-of-pocket cost — so the exact figure is known and paid correctly, avoiding any shortfall that could cause rejection.",
  },
  {
    title: "Filing Form SH-7",
    day: "Step 5",
    text: "Form SH-7 — the notice of alteration of share capital — is filed with the ROC within 30 days of the resolution, signed with the director's DSC, attaching the altered MOA, the resolution, and the notice/explanatory statement.",
  },
  {
    title: "Updated Capital & Share Allotment",
    day: "Step 6",
    text: "On registration, the increased authorised capital is reflected on the MCA record. The company can now allot fresh shares — and where included, we handle the allotment, Form PAS-3, share certificates, and the updated cap table.",
  },
];

const IacapElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Authorised Capital Increase Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from the AOA check to updated capital — and the headroom ready to issue new shares.
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

export default IacapElegibility;
