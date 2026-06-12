import React from "react";
import "./DpvtElegibility.css";

const steps = [
  {
    title: "Eligibility Check & Board Meeting",
    day: "Step 1",
    text: "We confirm the company qualifies for strike-off under Section 248 — never commenced business, or inactive for two financial years, with no pending charges, prosecutions, or investigations. A board meeting is then held to approve the closure and authorise the application.",
  },
  {
    title: "Clear Liabilities & Close Bank Account",
    day: "Step 2",
    text: "All outstanding liabilities are settled and the company is brought to a nil-asset, nil-liability position. The company's bank account(s) are closed and a closure certificate obtained — a prerequisite before the directors can sign the indemnity.",
  },
  {
    title: "Special Resolution & Member Consent",
    day: "Step 3",
    text: "A special resolution (or consent of at least 75% of members by paid-up capital) is passed approving the strike-off. We draft the resolution and the supporting documents, and file the resolution (MGT-14) where required.",
  },
  {
    title: "Drafting Indemnity, Affidavit & Accounts",
    day: "Step 4",
    text: "We prepare the STK-3 indemnity bond and STK-4 affidavit from each director, and coordinate the STK-8 statement of accounts (showing nil assets/liabilities) certified by a Chartered Accountant and dated within 30 days of the application.",
  },
  {
    title: "Filing Form STK-2 with the ROC",
    day: "Step 5",
    text: "Form STK-2 is filed with the Registrar along with all attachments and the ₹10,000 government fee. Any pending annual filings are completed first. We track the application and respond to any ROC query that arises.",
  },
  {
    title: "Public Notice & Strike-Off (STK-7)",
    day: "Step 6",
    text: "The ROC examines the application and issues a public notice (STK-5/STK-6) inviting objections. If none are sustained, the Registrar strikes the company's name off the register and publishes the notice of dissolution in Form STK-7 — the company now legally ceases to exist.",
  },
];

const DpvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Company Strike-Off Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility check to dissolution. Liabilities cleared, documents drafted, and Form STK-2 filed with the ROC.
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

export default DpvtElegibility;
