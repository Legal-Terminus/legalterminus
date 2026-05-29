import React from "react";
import "./PFRprocess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text: "Share KYC documents and address proof with us as per the checklist. This is your only task at the start — we handle everything from here.",
  },
  {
    title: "Step 2 – Partnership Deed Preparation",
    text: "We prepare a draft Partnership Deed covering profit-sharing ratio, capital contributions, roles, and all agreed terms between the partners.",
  },
  {
    title: "Step 3 – Partnership Deed Execution & Notarization",
    text: "The deed is executed and notarized by all partners with requisite stamp duty as per the state-specific Stamp Act.",
  },
  {
    title: "Step 4 – PAN & TAN Application",
    text: "We apply for PAN (Permanent Account Number) and TAN (Tax Deduction Account Number) for the registered partnership firm.",
  },
];

const PFRProcess = () => {
  return (
    <section className="pfr-process-wrapper">
      <h2 className="pfr-process-heading">
        Steps For Partnership Firm Registration In India
      </h2>
      <p className="pfr-process-subheading">
        The broad process of registering a Partnership Firm involves the following steps:
      </p>

      <div className="pfr-process-timeline">
        <div className="pfr-process-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pfr-process-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="pfr-process-dot">{index + 1}</div>
            <div className="pfr-process-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PFRProcess;
