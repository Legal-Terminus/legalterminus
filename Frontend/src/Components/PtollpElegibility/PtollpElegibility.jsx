import React from "react";
import "./PtollpElegibility.css";

const steps = [
  {
    title: "Eligibility Check & DSC / DPIN",
    day: "Step 1",
    text: "We confirm the firm qualifies under Section 55 — all partners carrying over, ITRs up to date, no subsisting security interest on assets, and creditor consent available. We then obtain Digital Signature Certificates (DSC) and DPINs for the designated partners.",
  },
  {
    title: "Name Reservation (RUN-LLP)",
    day: "Step 2",
    text: "We check name availability against the MCA and trademark databases and reserve the LLP name through RUN-LLP. Your existing firm name can usually continue, with the legal name ending in 'LLP', subject to approval.",
  },
  {
    title: "Statement of Accounts & Consents",
    day: "Step 3",
    text: "We compile the statement of assets and liabilities of the firm certified by a Chartered Accountant, the list of all creditors with their consent (NOC), and the partners' consent — the core documents the ROC requires for conversion.",
  },
  {
    title: "Filing Form 17 + FiLLiP",
    day: "Step 4",
    text: "Form 17 (the conversion application) is filed together with Form FiLLiP (LLP incorporation), the MOA-equivalent details, and the supporting statements. On approval, the ROC issues the Certificate of Registration converting the firm into an LLP.",
  },
  {
    title: "LLP Agreement (Form 3)",
    day: "Step 5",
    text: "Within 30 days of conversion, we draft and file the LLP agreement in Form 3, setting out profit-sharing, capital contribution, management, and partner rights. The agreement is executed on the appropriate state stamp paper.",
  },
  {
    title: "Intimate Registrar & Migrate Records",
    day: "Step 6",
    text: "We intimate the Registrar of Firms of the conversion (the firm is deemed dissolved), update PAN and migrate GST, bank, Udyam, and licences to the LLP's name, and set up the first-year compliance calendar (Form 8, Form 11, ITR-5).",
  },
];

const PtollpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Partnership to LLP Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility check to a fully operational LLP — the Section 55 conversion and agreement handled together.
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

export default PtollpElegibility;
