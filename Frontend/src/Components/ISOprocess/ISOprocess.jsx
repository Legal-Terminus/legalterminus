import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Standard Selection",
    day: "Day 0",
    text: "60-min call with our senior consultant to confirm: business model, sector, customer expectations (which standard does your target customer / tender actually require?), employee count, sites, existing process maturity. We recommend single vs IMS approach.",
  },
  {
    title: "Gap Analysis",
    day: "Day 1–7",
    text: "On-site (or virtual) review of your existing processes against the chosen standard's requirements. We deliver a gap report listing what exists, what needs documentation, what needs new implementation.",
  },
  {
    title: "Documentation Development",
    day: "Day 8–21",
    text: "Quality Manual + SOPs + Work Instructions + Forms + Records drafted — customised to your processes (not template-pasted). Process owners review each document.",
  },
  {
    title: "Implementation & Training",
    day: "Day 18–30",
    text: "Process owners trained on the new SOPs. Quality Policy communicated. Document control + record-keeping rituals initiated. Risk register populated (Clause 6.1).",
  },
  {
    title: "Internal Audit",
    day: "Day 30–35",
    text: "We facilitate (or our trained internal auditor conducts) a full internal audit against the standard. Findings documented. Corrective actions agreed with process owners.",
  },
  {
    title: "Management Review",
    day: "Day 35–37",
    text: "Top management review meeting documented per the standard's requirement (Clause 9.3). KPIs reviewed, audit findings discussed, resource decisions taken. MoM signed.",
  },
  {
    title: "CB Selection & Application",
    day: "Day 37–40",
    text: "We recommend 2–3 NABCB-accredited Certification Bodies appropriate to your size + sector + budget. You choose; we file the application with the chosen CB.",
  },
  {
    title: "Stage 1 Audit (Documentation Review)",
    day: "Day 40–45",
    text: "CB auditor reviews your documentation, internal audit, management review — typically at your premises (1 day). Stage 1 closes with a brief report identifying any major gaps before Stage 2.",
  },
  {
    title: "Stage 2 Audit (Implementation Review)",
    day: "Day 45–55",
    text: "CB auditor verifies that your documentation is actually being implemented — interviews staff, walks the floor, samples records. Typically 2–3 days. Closes with a closing meeting + nonconformity report.",
  },
  {
    title: "Certificate Issuance + MSME Subsidy",
    day: "Day 55–60",
    text: "After NC closure (if any), CB issues the ISO Certificate — valid for 3 years. We help you prepare the MSME subsidy application (where eligible). Annual surveillance schedule confirmed.",
  },
];

const ISOProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">Steps for ISO Certification in India</h2>
      <p className="pv-gst-subheading">
        Ten steps. 45–60 working days end-to-end (gap analysis to certificate). Sector + size + standard complexity drives the timeline.
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
