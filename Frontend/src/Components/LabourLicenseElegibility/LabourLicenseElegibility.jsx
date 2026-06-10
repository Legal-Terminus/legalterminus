import React from "react";
import "./LabourLicenseElegibility.css";

const steps = [
  {
    title: "Discovery & Applicability Confirmation",
    day: "Day 0",
    text: "30-min call to confirm: your role (principal employer or contractor), the number of contract workmen, whether you need a Certificate of Registration (RC), a Contractor Licence, or both, and the applicable state threshold. We also check whether any prior CLRA registration exists that needs renewal or amendment.",
  },
  {
    title: "Document Collection",
    day: "Day 1",
    text: "We share a CLRA-specific document checklist. You submit: entity registration proof, premise address proof, KYC of directors/partners/proprietor, contractor and workmen details, work order, and wage/PF/ESI particulars. This is your only task — we handle the rest.",
  },
  {
    title: "Form V & Application Preparation",
    day: "Day 1–3",
    text: "For a contractor licence we coordinate Form V from the principal employer. We prepare Form I (principal employer) and/or Form IV (contractor) with correct workmen counts, contractor mapping, and security-deposit calculation, verifying every document against department requirements.",
  },
  {
    title: "Department Filing & Govt Fee Payment",
    day: "Day 3–5",
    text: "Application filed with the jurisdictional Registering / Licensing Officer (online or offline as applicable). Government registration/licence fee and refundable security deposit paid on your behalf at actuals. Filing acknowledgement and reference number shared with you immediately.",
  },
  {
    title: "Department Review & Clarifications",
    day: "Day 5–25",
    text: "The officer reviews the application and may seek clarifications or inspect the worksite. If a deficiency or query is raised, we respond within 24 hours and prepare you for any inspection — welfare amenities, wage registers, and muster rolls ready.",
  },
  {
    title: "Certificate / Licence Issuance & Delivery",
    day: "Day 15–30",
    text: "The officer issues the Certificate of Registration (RC) or the Licence in Form VI within ~30 working days of a complete application. We deliver: the certificate/licence (PDF), compliance calendar (renewal due dates), statutory register templates, and a renewal reminder.",
  },
];

const LabourLicenseElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Labour Licence (CLRA) Registration in India
      </h2>
      <p className="opcelg-subheading">
        Six steps. 15–30 working days end-to-end depending on registration type, Form V availability, and department inspection schedule.
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

export default LabourLicenseElegibility;
