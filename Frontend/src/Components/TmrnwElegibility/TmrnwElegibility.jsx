import React from "react";
import "./TmrnwElegibility.css";

const steps = [
  {
    title: "Deadline & Status Check",
    day: "Step 1",
    text: "We pull your trademark's record from the official register to confirm the registration number, class(es), proprietor details, and the exact expiry date — and determine whether it qualifies for on-time renewal, grace-period renewal, or restoration.",
  },
  {
    title: "Document Collection",
    day: "Step 2",
    text: "We share a short checklist. You provide the registration certificate (or TM number), proof of proprietorship, and any change in name/address since registration. We draft the Power of Attorney (Form TM-48) for your signature.",
  },
  {
    title: "Form TM-R Preparation",
    day: "Step 3",
    text: "We prepare the renewal application in Form TM-R with the correct class(es) and applicant details. Where renewal is in the grace period or requires restoration, we compute and include the applicable surcharge or restoration fee.",
  },
  {
    title: "Filing on the IP India Portal",
    day: "Step 4",
    text: "The renewal is filed online with the Trade Marks Registry and the government fee is paid on your behalf at actuals. You receive the filing acknowledgement and reference number immediately after submission.",
  },
  {
    title: "Registry Processing",
    day: "Step 5",
    text: "The Registry processes the renewal and updates the register. For restoration cases, the Registrar may consider the application on its merits before allowing it. We track the status and respond to any query that arises.",
  },
  {
    title: "Renewal Confirmation & Next Reminder",
    day: "Step 6",
    text: "Once processed, your trademark is renewed for a further 10 years. We confirm the new validity date, deliver the updated record, and set an automatic reminder well ahead of the next renewal so you never miss a cycle.",
  },
];

const TmrnwElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Trademark Renewal Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from deadline check to confirmation. File up to a year early for seamless, surcharge-free protection.
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

export default TmrnwElegibility;
