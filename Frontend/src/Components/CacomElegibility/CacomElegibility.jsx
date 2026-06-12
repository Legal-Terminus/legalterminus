import React from "react";
import "./CacomElegibility.css";

const steps = [
  {
    title: "Identify the Type of Change",
    day: "Step 1",
    text: "We first confirm how far you're moving — within the same city, to another city in the state, or to another state — because that determines the entire procedure. We map exactly which resolutions, forms, and approvals your change will require.",
  },
  {
    title: "Board Resolution & Address Proof",
    day: "Step 2",
    text: "We draft the board resolution approving the change and verify the new registered-office address proof — a utility bill not older than two months, the rent agreement or ownership document, and a No-Objection Certificate from the owner if the premises are rented.",
  },
  {
    title: "Special Resolution (if required)",
    day: "Step 3",
    text: "For a change beyond local limits, we prepare the EGM notice and special resolution and file Form MGT-14. For a state-to-state change, this resolution also alters the registered-office clause of the MOA.",
  },
  {
    title: "RD Approval & Advertisement (if required)",
    day: "Step 4",
    text: "Where the move crosses ROC jurisdiction or state lines, we publish the newspaper advertisement (Form INC-26) and file the application to the Regional Director (Form INC-23), responding to any objection until the RD order is obtained.",
  },
  {
    title: "Filing Form INC-22",
    day: "Step 5",
    text: "We file Form INC-22 — the notice of change of registered office — with the ROC within the prescribed time, attaching the resolutions, address proof, NOC, and RD order (where applicable). The new address is then recorded on the MCA register.",
  },
  {
    title: "Update PAN, GST, Bank & Licences",
    day: "Step 6",
    text: "Once the change is registered, we help update the new address on the company's PAN, GST registration, bank account, and licences, and provide guidance for letterheads, signage, and statutory displays — so the new office reflects everywhere.",
  },
];

const CacomElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Registered Office Change Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from identifying the type of change to every record updated. The exact path depends on how far you move.
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

export default CacomElegibility;
