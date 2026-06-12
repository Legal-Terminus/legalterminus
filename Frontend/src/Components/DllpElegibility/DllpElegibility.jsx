import React from "react";
import "./DllpElegibility.css";

const steps = [
  {
    title: "Eligibility Check & Cease Operations",
    day: "Step 1",
    text: "We confirm the LLP qualifies for Form 24 strike-off — never commenced business, or ceased commercial activity for one year or more, with no pending liabilities. The partners formally decide to close the LLP and cease any remaining operations.",
  },
  {
    title: "Clear Liabilities & Close Bank Account",
    day: "Step 2",
    text: "All outstanding liabilities are settled and the LLP is brought to a nil-asset, nil-liability position. The LLP's bank account is closed and a closure certificate obtained — a prerequisite before the partners can sign the indemnity.",
  },
  {
    title: "Bring Pending Filings Up to Date",
    day: "Step 3",
    text: "Overdue Form 8 and Form 11 are filed up to the end of the financial year in which the LLP ceased business, along with the final income tax return (ITR-5). This clears the compliance record so the ROC will accept the strike-off.",
  },
  {
    title: "Partners' Consent, Affidavit & Indemnity",
    day: "Step 4",
    text: "We draft the consent of all partners to the strike-off, along with an affidavit and indemnity bond from each designated partner declaring that all liabilities are settled. These are executed on stamp paper and notarised.",
  },
  {
    title: "Filing Form 24 with the ROC",
    day: "Step 5",
    text: "Form 24 is filed with the Registrar along with the CA-certified statement of accounts (nil assets/liabilities, within 30 days), the LLP agreement, and all supporting documents. We track the application and respond to any ROC query.",
  },
  {
    title: "Public Notice & Strike-Off",
    day: "Step 6",
    text: "The ROC examines the application and publishes a public notice inviting objections. If none are sustained, the Registrar strikes the LLP's name off the register and notifies the dissolution — the LLP now legally ceases to exist.",
  },
];

const DllpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        LLP Strike-Off Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility check to dissolution. Liabilities cleared, documents drafted, and Form 24 filed with the ROC.
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

export default DllpElegibility;
