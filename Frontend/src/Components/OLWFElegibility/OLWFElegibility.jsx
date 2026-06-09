import React from "react";
import "../OPCElegibility/OPCElegibility.css";

const steps = [
  {
    title: "Discovery & Eligibility Check",
    day: "Day 0",
    text: "30-min call with our state-labour CA to confirm: establishment type (Factory / Shop / Commercial / IT / Hotel / Construction / Mining), current worker count, projected hiring, location in Odisha (district / industrial area), existing GST / PAN / S&E Act registration, current ESIC / EPF status (where applicable).",
  },
  {
    title: "Documents Collection",
    day: "Day 1–2",
    text: "Entity PAN, COI / Partnership Deed / GST Certificate / Trade Licence, address proof of Odisha establishment, cancelled cheque, authorised signatory's Aadhaar + PAN + photo + appointment letter, list of workers with category breakdown.",
  },
  {
    title: "Worker List Mapping",
    day: "Day 2–3",
    text: "Worker / employee list reconciled against wage register. Each worker categorised per OLWF coverage rules. Any exclusions identified (e.g., specific managerial categories per the Act).",
  },
  {
    title: "Form A Drafting",
    day: "Day 3",
    text: "Form A (or current prescribed format) drafted: establishment details, employer details, worker count, contribution commencement date, declaration of compliance.",
  },
  {
    title: "Application to Welfare Commissioner",
    day: "Day 3–4",
    text: "Form A + supporting documents submitted to the District / Regional Welfare Commissioner of the Odisha Labour Welfare Board. May be filed in person, by post, or via the state labour portal (where available).",
  },
  {
    title: "Establishment Code Allotment",
    day: "Day 4–7",
    text: "Welfare Commissioner reviews and allots Establishment Code. Typically 3–5 working days for clean applications. Code remains valid for the life of the establishment subject to ongoing compliance.",
  },
  {
    title: "First Half-Yearly Contribution Walkthrough",
    day: "Day 7–9",
    text: "(Enriched / Supreme) Computation of first half-yearly contribution (employer share + employee share) for the upcoming half-year (Jan–June or Jul–Dec). Payment walkthrough via the Welfare Board's prescribed channel (challan / online portal).",
  },
  {
    title: "Onboarding Kit + Compliance Calendar",
    day: "Day 8–10",
    text: "We deliver: Form A acknowledgement, Establishment Code certificate, worker list register, half-yearly contribution calendar (Jan + Jul payment dates), worker benefit claim guidance sheet (for workers), 1-year free-update tracker.",
  },
];

const OLWFElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps For OLWF Registration
      </h2>
      <p className="opcelg-subheading">
        Eight steps. 7–10 working days end-to-end from kick-off to Establishment Code + first contribution ready.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
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

export default OLWFElegibility;
