import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Coverage Check",
    day: "Day 0",
    text: "30-min call with our payroll-expert to confirm: current headcount, projected hiring, entity type, industry (Factory / Shop / Notified), location (verify ESIC-notified area), wage structure (gross wages of each employee against ₹21K threshold), and existing GSTIN / PAN.",
  },
  {
    title: "Documents Collection",
    day: "Day 1–2",
    text: "Entity PAN, COI / Partnership Deed / GST Certificate, address proof of establishment, cancelled cheque, authorised signatory's Aadhaar + PAN + photo + appointment letter, list of covered employees with KYC.",
  },
  {
    title: "Form 1 Filing on ESIC Portal",
    day: "Day 3",
    text: "Application filed on the ESIC portal. Establishment details, employer details, employee count, wage structure, contribution start date, industry classification. DSC-signed submission.",
  },
  {
    title: "Employer Code Allotment",
    day: "Day 3–5",
    text: "ESIC regional office reviews the application. Employer Code (17-digit alphanumeric) allotted within 3–5 working days. Provisional code may be issued immediately, with permanent code following document verification.",
  },
  {
    title: "Insurance Number (IP) Generation",
    day: "Day 5–6",
    text: "For each covered employee, we generate Insurance Number via Form 1A (Declaration). KYC linkage — Aadhaar + bank account — captured. Family declaration (spouse, parents, children) recorded for dependants' benefits.",
  },
  {
    title: "Dispensary / Hospital Mapping",
    day: "Day 6",
    text: "Each employee mapped to the nearest ESIC dispensary based on residential address. Pehchan Card (photo identity for ESIC medical facilities) generated for employee + each dependent family member.",
  },
  {
    title: "First Contribution Walkthrough + Onboarding Kit",
    day: "Day 7",
    text: "We walk you through the first monthly contribution (due by 15th of next month). Deliver onboarding kit: Employer Code certificate, IP list, Pehchan tracker, ESIC compliance calendar (monthly + half-yearly RC returns), 1-year free-update tracker.",
  },
];

const ESICRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for ESIC Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Seven steps. 5–7 working days end-to-end from kick-off to first successful monthly contribution.
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

export default ESICRegProcess;
