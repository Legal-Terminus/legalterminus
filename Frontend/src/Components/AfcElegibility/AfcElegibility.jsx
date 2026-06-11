import React from "react";
import "./AfcElegibility.css";

const steps = [
  {
    title: "Onboarding & Compliance Review",
    day: "Step 1",
    text: "We map your company's status — incorporation details, financial year, last filings, auditor, and director DINs. A compliance calendar is built covering AGM, AOC-4, MGT-7, ADT-1, DIR-3 KYC, and DPT-3 due dates so nothing slips.",
  },
  {
    title: "Books Finalisation & Audit",
    day: "Step 2",
    text: "We help finalise your books of accounts and coordinate the statutory audit with a Chartered Accountant. The audited Balance Sheet, Profit & Loss, and Auditor's Report are prepared — the foundation for AOC-4.",
  },
  {
    title: "Board Meeting & AGM Documentation",
    day: "Step 3",
    text: "We draft the notice, Director's Report, and resolutions for the board meeting and Annual General Meeting (AGM), where financials are adopted and the auditor is appointed/ratified. Minutes are prepared and statutory registers updated.",
  },
  {
    title: "Form Preparation & Pre-Validation",
    day: "Step 4",
    text: "We prepare AOC-4, MGT-7 / MGT-7A, and ADT-1 with the correct attachments, verify DSC validity and director KYC, and pre-fill the MCA fee based on your authorised capital — eliminating last-minute upload failures.",
  },
  {
    title: "MCA Filing & Fee Payment",
    day: "Step 5",
    text: "Forms are filed on the MCA portal within their due dates (AOC-4 within 30 days and MGT-7 within 60 days of the AGM). Government fees are paid on your behalf at actuals and the SRN / challan is shared immediately.",
  },
  {
    title: "Acknowledgement & Record-Keeping",
    day: "Step 6",
    text: "You receive all filed forms, SRN/challan receipts, updated statutory registers, and a clean year-end compliance record. We also set reminders for next year's calendar — including DIR-3 KYC by 30 September.",
  },
];

const AfcElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Company Annual Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps, repeated every financial year. Audited, documented, and filed with the MCA before every due date.
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

export default AfcElegibility;
