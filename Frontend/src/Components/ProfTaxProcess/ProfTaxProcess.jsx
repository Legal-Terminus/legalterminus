import React from "react";
import "./ProfTaxProcess.css";

const steps = [
  {
    title: "Discovery &amp; Applicability Check",
    day: "Day 0",
    text: "30-min call to confirm: which state(s) PT applies to, whether you need an EC (employer), RC (employee), or both, your salary slab range vs state threshold, and whether you're in a Maharashtra PTEC scenario.",
  },
  {
    title: "Document Collection",
    day: "Day 1",
    text: "We share a precise document checklist. You submit KYC of owner/director, business registration certificate (COI / GST / UDYAM), registered office proof, employee headcount and salary range. This is your only job.",
  },
  {
    title: "Document Verification &amp; Portal Preparation",
    day: "Day 1–2",
    text: "We verify documents against state-specific requirements, prepare the state portal application, map salary slabs to the correct PT schedule, and draft the registration form for your review.",
  },
  {
    title: "State Portal Filing",
    day: "Day 2–3",
    text: "Application filed on the state tax portal (e.g., Mahagst, KGST, TNPT). Government fee paid at actuals. Filing reference number / acknowledgement shared with you immediately.",
  },
  {
    title: "Department Review &amp; Clarifications",
    day: "Day 3–5",
    text: "State department reviews the application. If a deficiency is raised (missing document, wrong slab), we respond within 24 hours. Most PT registrations are processed without objection.",
  },
  {
    title: "Certificate Issuance &amp; Handover",
    day: "Day 5–7",
    text: "Employer Certificate (EC) and Employee Certificate (RC) issued by the state authority. We deliver: certificate PDFs, compliance calendar, monthly challan template, and first return due date.",
  },
];

const ProfTaxProcess = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Professional Tax Registration in India
      </h2>
      <p className="opcelg-subheading">
        Six steps. 5–7 working days end-to-end (assuming clean documents and a straightforward state portal review).
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
                <span dangerouslySetInnerHTML={{ __html: step.title }} />
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

export default ProfTaxProcess;
