import React from "react";
import "./PtopvtElegibility.css";

const steps = [
  {
    title: "Structuring & DSC / DIN",
    day: "Step 1",
    text: "We confirm eligibility under Section 366 and structure the minimum two members and two directors — you bring in at least one co-shareholder. We then obtain Digital Signature Certificates (DSC) and Director Identification Numbers (DIN) for the directors.",
  },
  {
    title: "Name Reservation (SPICe+ Part A)",
    day: "Step 2",
    text: "We check name availability against the MCA and trademark databases and reserve the company's name through SPICe+ Part A. Your existing brand can usually continue, with the legal name ending in 'Private Limited', subject to approval.",
  },
  {
    title: "URC-1 Statutory Pack",
    day: "Step 3",
    text: "We prepare the URC-1 documentation — the audited statement of accounts of the proprietorship (not older than 30 days), the list of members and creditors with consent, the declaration of solvency, and the affidavits confirming compliance with Section 366.",
  },
  {
    title: "URC-2 Newspaper Advertisement",
    day: "Step 4",
    text: "A public notice in Form URC-2 is published in an English and a vernacular newspaper inviting objections to the conversion. We draft the notice and coordinate publication, and address any objections raised within the notice period.",
  },
  {
    title: "Filing URC-1 + SPICe+ Incorporation",
    day: "Step 5",
    text: "Form URC-1 is filed with the ROC together with the SPICe+ incorporation forms, MOA, AOA, and INC-9 declarations. On approval, the Private Limited Company receives its Certificate of Incorporation, CIN, PAN, and TAN.",
  },
  {
    title: "Migrate Registrations & Set Up Compliance",
    day: "Step 6",
    text: "We register the company for GST, open its bank account, migrate Udyam, IEC, and licences to the company's name, surrender the old proprietorship registrations, and set up the first-year compliance calendar (AOC-4, MGT-7, audit, board meetings).",
  },
];

const PtopvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Proprietorship to Private Limited Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from structuring to a fully operational Pvt Ltd — the Section 366 conversion and business migration handled together.
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

export default PtopvtElegibility;
