import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Gap Analysis & Standard Selection",
    day: "Day 0",
    text: "Our ISO consultant conducts a gap analysis of your existing processes against the chosen ISO standard (ISO 9001, 14001, 27001, 45001, or 22000). We identify areas of non-conformance, recommend the right standard for your business scope, and provide a personalised action plan.",
  },
  {
    title: "Documentation & Management System Setup",
    day: "Day 1–7",
    text: "Develop and document your Quality / Environmental / ISMS Management System: quality manual, Standard Operating Procedures (SOPs), process flow charts, work instructions, and mandatory records. We prepare all documentation required by the specific ISO standard and your audit scope.",
  },
  {
    title: "Internal Audit & Management Review",
    day: "Day 8–10",
    text: "Conduct an internal audit against ISO standard requirements to identify any remaining non-conformities before the certifying body audit. Management review meeting is held to validate the system, confirm objectives are met, and sign off on audit-readiness.",
  },
  {
    title: "Stage 1 Audit — Document Review",
    day: "Day 11–14",
    text: "The accredited ISO certifying body conducts a Stage 1 audit — a desk review of your management system documentation. Auditors confirm that scope, objectives, and documented processes meet the ISO standard requirements. Observations are raised and addressed before Stage 2.",
  },
  {
    title: "Stage 2 Audit — Certification Audit",
    day: "Day 15–21",
    text: "On-site certification audit by the accredited certifying body. Auditors verify that your management system is implemented effectively across all locations and functions covered in the scope. Corrective actions from Stage 1 must be closed before or during Stage 2.",
  },
  {
    title: "ISO Certificate Issued",
    day: "Day 22–30",
    text: "Upon successful Stage 2 audit and closure of all non-conformities, the accredited certifying body issues your ISO certificate. Valid for 3 years with mandatory annual surveillance audits. You can immediately use the ISO mark on proposals, packaging, and marketing materials.",
  },
];

const ISOProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">Steps for ISO Certification in India</h2>
      <p className="pv-gst-subheading">
        Six steps. 22–30 days end-to-end (assuming audit-ready documentation and an experienced certification body).
      </p>
      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />
        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="pvtltd-timeline-dot">{index + 1}</div>
            <div className="pvtltd-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="pvtltd-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ISOProcess;
