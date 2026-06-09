import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Eligibility Check",
    day: "Day 0",
    text: "30-min call with our startup-expert to confirm: entity type (Pvt Ltd / LLP / Registered Partnership - sole proprietorships not eligible), Odisha presence (registration / operations / 50% workforce), incorporation date (5-year cap; 10 years for Biotech), turnover history (Rs.25 cr cap), business activity, innovation thesis, sector. Honest eligibility review - we tell you upfront if you don't qualify.",
  },
  {
    title: "Entity & Odisha-Presence Verification",
    day: "Day 1",
    text: "Confirm Certificate of Incorporation / LLP Agreement / Partnership Deed, PAN, GSTIN (if registered), and evidence of Odisha presence (registered office address, Odisha bank account, Odisha team / operations, OR payroll evidence of 50% Odisha-based workforce).",
  },
  {
    title: "Innovation Pitch Reviewing",
    day: "Day 1–4",
    text: "Brief description of business + innovation thesis + scalability framework + Odisha-context positioning (how the business fits Odisha's economy / state priorities / employment goals). Sector-tuned narrative. Senior-expert reviewed for Enriched / Supreme.",
  },
  {
    title: "Create User Account",
    day: "Day 3",
    text: "Create user account on the Startup Odisha portal (startupodisha.gov.in). Verify mobile + email. Add entity details.",
  },
  {
    title: "Application Form Filing",
    day: "Day 3–5",
    text: "Application filed with: entity details, founders / directors / partners, business description, innovation write-up, sector classification, Odisha presence details, supporting documents.",
  },
  {
    title: "Document Upload",
    day: "Day 4–5",
    text: "Curated document pack uploaded: COI / LLP Agreement / Partnership Deed, PAN, GSTIN, address proof, founder KYC, IP evidence (if any), awards / recognitions (if any), pitch deck.",
  },
  {
    title: "Startup Cell Review + Query Response",
    day: "Day 5–12",
    text: "The Startup Odisha Cell reviews the application. If clarifications / additional documentation is sought, we handle the response (Elemental: client handles; Enriched: 1 round included; Supreme: up to 3 rounds).",
  },
  {
    title: "Recognition Certificate + Onboarding Kit",
    day: "Day 7–15",
    text: "Startup Odisha Cell issues the Recognition Certificate (digital PDF). We deliver: Certificate, profile screenshot of the startupodisha.gov.in listing. NO grant / benefit application kit - that's out of scope.",
  },
];

const StartupOdishaProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps For Startup Odisha Registration
      </h2>
      <p className="pv-gst-subheading">
        Eight steps. 7-15 working days end-to-end from kick-off to Recognition Certificate.
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
