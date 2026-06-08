import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Eligibility Check & Discovery Call",
    day: "Day 0",
    text: "30-min call to confirm: entity type (Pvt Ltd / LLP / Partnership), registered office state (must be Odisha), date of incorporation, current investment and headcount, business activity, and sector classification. We also assess eligibility for dual recognition (Startup Odisha + DPIIT) and capital subsidy potential.",
  },
  {
    title: "Document Collection",
    day: "Day 1–2",
    text: "We send you a specific checklist: COI / LLP agreement / Partnership deed with Odisha address, PAN, GSTIN (if applicable), Aadhaar + PAN of authorised signatory, investment details (capital invested, assets), employee list, and a brief business description. No physical documents required — all digital.",
  },
  {
    title: "Business Plan & Innovation Summary",
    day: "Day 2–4",
    text: "We draft the 'Business Innovation Description' and 'How does it benefit Odisha's economy' narrative for the Startup Odisha portal. We also prepare a capital subsidy application summary (investment, employment, sector impact) for use in the subsidy application post-recognition.",
  },
  {
    title: "Startup Odisha Portal Application Filing",
    day: "Day 4–5",
    text: "Application filed on the Startup Odisha portal with entity details, promoter information, innovation description, investment details, and sector classification. Supporting documents uploaded. Application submitted to the State Government for review by the Startup Odisha Evaluation Committee.",
  },
  {
    title: "State Evaluation & Query Response",
    day: "Day 6–21",
    text: "The Startup Odisha Evaluation Committee reviews applications typically within 2–4 weeks. If any clarification is requested, we respond within 24 hours. The committee may request additional proof of investment, innovation, or Odisha operations.",
  },
  {
    title: "Startup Odisha Recognition Certificate",
    day: "Day 21–42",
    text: "The State Government issues the Startup Odisha recognition certificate electronically. The certificate activates your eligibility for all policy benefits — incubation, capital subsidy application, mentor access, and procurement preference. We deliver a post-recognition action plan.",
  },
  {
    title: "Capital Subsidy & Incubation Application",
    day: "Day 42+",
    text: "If you're on Enriched or above plans, we proceed with the capital subsidy application (requires investment proof, bank statements, asset list) and incubation centre application (STPI / KIIT-TBI / IIT TBI). Capital subsidy disbursement timelines are set by the government — typically 3–6 months after application.",
  },
];

const StartupOdishaProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps to Get Startup Odisha Recognition
      </h2>
      <p className="pv-gst-subheading">
        Seven steps. 3–6 weeks for recognition (capital subsidy disbursement takes longer — subject to government timelines).
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

export default StartupOdishaProcess;
