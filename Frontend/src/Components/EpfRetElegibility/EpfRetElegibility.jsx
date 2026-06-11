import React from "react";
import "./EpfRetElegibility.css";

const steps = [
  {
    title: "Onboarding & Setup",
    day: "Step 1",
    text: "We map your EPF establishment code, employer portal credentials, wage structure, and current member list. A monthly compliance calendar is set up locked to the 15th-of-next-month ECR deadline so no filing is ever missed.",
  },
  {
    title: "Monthly Data Collection",
    day: "Step 2",
    text: "Each month you share the wage sheet, attendance/LOP, and details of new joiners and exits. We provide a simple template; this is your only recurring task, due a few working days before the deadline.",
  },
  {
    title: "UAN, KYC & Member Updates",
    day: "Step 3",
    text: "We generate UANs for new joiners, seed and approve KYC (Aadhaar, PAN, bank), and mark Date of Exit for separated employees. The member roster is reconciled so the ECR reflects exactly who is on the rolls this month.",
  },
  {
    title: "Contribution Computation",
    day: "Step 4",
    text: "We compute employee PF (12%), employer EPF/EPS split (3.67% / 8.33%), EDLI, and admin charges on the correct wage base, handling arrears and wage revisions — arriving at the exact dues for the month.",
  },
  {
    title: "ECR Upload & Your Approval",
    day: "Step 5",
    text: "The ECR text file is prepared and uploaded on the EPFO Unified Portal. A contribution summary is shared with you for confirmation, and the challan (TRRN) is generated for payment.",
  },
  {
    title: "Challan Payment & Confirmation",
    day: "Step 6",
    text: "Dues are paid online by the 15th. You receive the paid challan (TRRN), ECR statement, and a monthly compliance log. The cycle repeats every month, keeping your establishment continuously compliant.",
  },
];

const EpfRetElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        EPF Return Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps, repeated every month. Members reconciled, contributions computed, and the challan paid before the 15th — every time.
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

export default EpfRetElegibility;
