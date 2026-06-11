import React from "react";
import "./EsiRetElegibility.css";

const steps = [
  {
    title: "Onboarding & Setup",
    day: "Step 1",
    text: "We map your ESI establishment code, employer portal credentials, wage structure, and current employee list. A monthly compliance calendar is set up locked to the 15th-of-next-month deadline so no contribution filing is ever missed.",
  },
  {
    title: "Monthly Data Collection",
    day: "Step 2",
    text: "Each month you share the wage sheet, attendance/LOP, and details of new joiners and exits. We provide a simple template; this is your only recurring task, due a few working days before the deadline.",
  },
  {
    title: "IP Registration & Member Updates",
    day: "Step 3",
    text: "We register new eligible employees as Insured Persons, generate e-Pehchaan cards, capture dependant details, and mark Date of Leaving for separated employees. The IP roster is reconciled so the return reflects exactly who is covered this month.",
  },
  {
    title: "Contribution Computation",
    day: "Step 4",
    text: "We compute employee (0.75%) and employer (3.25%) contributions on gross wages, applying the ₹21,000 wage ceiling and the contribution-period continuation rule — arriving at the exact dues for the month.",
  },
  {
    title: "Return Upload & Your Approval",
    day: "Step 5",
    text: "Wages are uploaded on the ESIC portal and a contribution challan is generated. A summary is shared with you for confirmation before any payment is made.",
  },
  {
    title: "Challan Payment & Confirmation",
    day: "Step 6",
    text: "Dues are paid online by the 15th. You receive the paid challan, the IP-wise contribution statement, and a monthly compliance log. The cycle repeats every month, keeping your establishment continuously compliant.",
  },
];

const EsiRetElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        ESI Return Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps, repeated every month. IPs reconciled, contributions computed, and the challan paid before the 15th — every time.
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

export default EsiRetElegibility;
