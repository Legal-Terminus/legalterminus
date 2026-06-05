import React from "react";
import "./GSTRegProcess.css";

const steps = [
  {
    title: "Document Collection",
    day: "Day 0–1",
    text: "Secure upload portal opens. Our checklist drives this — PAN, Aadhaar, business proof, bank details and photographs. We chase missing items proactively.",
  },
  {
    title: "Document Vetting",
    day: "Day 1",
    text: "Our paralegals run a 12-point vetting checklist — PAN-Aadhaar linkage, IFSC validation, address proof recency (within 60 days), partnership deed pagination, board resolution wording. Defects flagged within 4 hours.",
  },
  {
    title: "Form REG-01 Filing",
    day: "Day 2",
    text: "Application filed on the GST portal. TRN (Temporary Reference Number) issued instantly. Aadhaar OTP authentication initiated for promoters / authorised signatories.",
  },
  {
    title: "Aadhaar e-KYC & ARN",
    day: "Day 2–3",
    text: "OTP verification completed by you on your registered mobile. ARN (Application Reference Number) generated — your tracking ID for the rest of the process.",
  },
  {
    title: "Officer Examination",
    day: "Day 3–7",
    text: "Proper officer reviews the application within 7 working days under Rule 9. Auto-approval kicks in if no query is raised. We monitor the portal twice daily.",
  },
  {
    title: "Clarification (if any)",
    day: "Day 4–9 (if triggered)",
    text: "If a Notice for Seeking Clarification (REG-03) is issued, we draft and file the response (REG-04) within the 7-day deadline. 90% of our clients don't see this stage.",
  },
  {
    title: "GSTIN & Certificate Issuance",
    day: "Day 5–7",
    text: "GSTIN allotted. Form REG-06 (Registration Certificate) generated — we download it, share it via email + WhatsApp, and send your post-registration onboarding kit.",
  },
];

const GSTRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for GST Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Seven steps. Five working days, end-to-end (assuming Aadhaar e-KYC passes first time).
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

export default GSTRegProcess;
