import React from "react";
import "./TmarkElegibility.css";

const steps = [
  {
    title: "Trademark Search & Class Selection",
    day: "Step 1",
    text: "We run a comprehensive search of the public trademark register for identical and deceptively similar marks, and identify the correct class(es) among the 45 Nice classes for your goods or services. This is where we assess your mark's strength before a rupee of government fee is spent.",
  },
  {
    title: "Document Collection",
    day: "Step 2",
    text: "We share a short checklist. You provide the applicant's details, the logo (if any), proof of claimed use, and — for the concessional fee — Udyam/MSME or startup recognition. Power of Attorney (Form TM-48) is prepared by us for your signature.",
  },
  {
    title: "TM-A Application Filing",
    day: "Step 3",
    text: "We draft and file the application in Form TM-A on the IP India portal with the correct specification of goods/services, applicant type, and class. Once filed, you receive the application number and can start using the ™ symbol immediately.",
  },
  {
    title: "Examination by the Registry",
    day: "Step 4",
    text: "The Trade Marks Registry examines the application and issues an examination report, which may raise objections under Section 9 (non-distinctiveness) or Section 11 (similar existing marks). We analyse the report and prepare a strong, citation-backed reply within the deadline.",
  },
  {
    title: "Publication & Opposition Window",
    day: "Step 5",
    text: "If accepted, the mark is published in the Trademark Journal and opens a 4-month window during which any third party can oppose it. We monitor for oppositions and, where covered, file a reply to protect your application.",
  },
  {
    title: "Registration & ® Certificate",
    day: "Step 6",
    text: "If no opposition is filed (or it is decided in your favour), the Registry issues the registration certificate. Your mark is now registered for 10 years, renewable thereafter, and you can use the ® symbol. We deliver the certificate and brand-protection guidance.",
  },
];

const TmarkElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Trademark Application Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six stages from search to certificate. ™ from day one of filing; ® once registered — typically several months to over a year if smooth.
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

export default TmarkElegibility;
