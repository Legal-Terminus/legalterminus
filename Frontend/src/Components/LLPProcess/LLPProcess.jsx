import React from "react";
import "./LLPProcess.css";

const steps = [
  {
    title: "Discovery & Structuring Call",
    day: "Day 0",
    text: "30-min call with our CS to confirm: number of partners, designated partners (min 2, at least 1 resident), capital contribution, profit-share model, registered office state, and primary business activity.",
  },
  {
    title: "Document Submission & DSC Procurement",
    day: "Day 1–2",
    text: "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificate issued to the sole director and the nominee. Same-day for resident Indians via Aadhaar e-KYC; 3–5 days for NRIs (apostille required).",
  },
  {
    title: "RUN-LLP — Name Reservation",
    day: "Day 3–5",
    text: "Filed with 2 proposed names (in order of preference) ending with 'LLP' through MCA21 V3. CRC reviews under Rule 18 of the LLP Rules, 2009. Approval: 2–3 working days typical. Reserved name valid for 3 months.",
  },
  {
    title: "DPIN / DIN Application",
    day: "Day 4",
    text: "DPIN (Designated Partner Identification Number) — now unified with DIN — applied for the first 2 designated partners directly through the FiLLiP form.",
  },
  {
    title: "FiLLiP Filing",
    day: "Day 7–8",
    text: "Master incorporation form (Form for Incorporation of LLP) filed: name + registered office + partner details + DPIN + capital. Includes integrated PAN/TAN application.",
  },
  {
    title: "CRC Examination & Clarifications",
    day: "Day 8–12",
    text: "Registrar reviews the application within 14 days under Rule 11. If a deficiency is raised (e.g., minor naming or address), we file a re-submission within 24 hours.",
  },
  {
    title: "Certificate of Incorporation",
    day: "Day 10–14",
    text: "COI issued in Form 16 by the Registrar. PAN + TAN + LLPIN (LLP Identification Number) allotted simultaneously.",
  },
  {
    title: "LLP Agreement Drafting",
    day: "Day 12–14",
    text: "Custom LLP Agreement drafted: contribution schedule, profit-sharing, management rights, decision thresholds, exit clauses, IP assignment, dispute resolution. Two rounds of revision included.",
  },
  {
    title: "Form 3 + Onboarding Kit",
    day: "Day 14–15",
    text: "LLP Agreement filed in Form 3 within 30 days (we file within 7 days of COI). Stamp duty paid online. We deliver: COI PDF, stamped LLP Agreement, statutory registers, audit-threshold tracker, and a 90-day compliance calendar.",
  },
];

const LLPProcess = () => {
  return (
    <section className="llpproc-wrapper">
      <h2 className="llpproc-heading">
        Steps For Limited Liability Partnership Registration In India
      </h2>
      <p className="llpproc-subheading">
        Nine steps. 10–15 working days end-to-end (assuming clean documents and a name that clears RUN-LLP on first try).
      </p>

      <div className="llpproc-timeline">
        <div className="llpproc-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`llpproc-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="llpproc-timeline-dot">{index + 1}</div>

            <div className="llpproc-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="llpproc-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LLPProcess;
