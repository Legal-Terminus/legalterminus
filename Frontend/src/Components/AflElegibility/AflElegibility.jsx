import React from "react";
import "./AflElegibility.css";

const steps = [
  {
    title: "Onboarding & Compliance Review",
    day: "Step 1",
    text: "We map your LLP's status — incorporation details, financial year, last filings, designated partner DINs, and total contribution. A compliance calendar is built covering Form 11 (30 May), Form 8 (30 October), DIR-3 KYC (30 September), and ITR-5 so no due date slips.",
  },
  {
    title: "Accounts & Solvency Finalisation",
    day: "Step 2",
    text: "We help compile your LLP's accounts — assets, liabilities, income, and expenditure — and prepare the Statement of Account & Solvency. Where a tax audit applies (turnover above ₹40 lakh or contribution above ₹25 lakh), we coordinate it with a Chartered Accountant.",
  },
  {
    title: "Partner & Contribution Verification",
    day: "Step 3",
    text: "We confirm the details of all partners and designated partners, total and individual contributions, and any changes during the year — the core data for Form 11. Designated-partner KYC and DSC validity are checked at this stage.",
  },
  {
    title: "Form Preparation & Certification",
    day: "Step 4",
    text: "We prepare Form 11 and Form 8 with the correct attachments and obtain the required professional certification on Form 8. Government fees are pre-filled based on your contribution slab so there are no surprises at filing.",
  },
  {
    title: "MCA Filing & Fee Payment",
    day: "Step 5",
    text: "Form 11 is filed by 30 May and Form 8 by 30 October on the MCA portal. Government fees are paid on your behalf at actuals, and the SRN / challan acknowledgement is shared with you immediately after filing.",
  },
  {
    title: "Acknowledgement & Record-Keeping",
    day: "Step 6",
    text: "You receive all filed forms, SRN/challan receipts, and an updated compliance record. We also set reminders for next year's calendar — including DIR-3 KYC by 30 September and the LLP's ITR-5 income tax return.",
  },
];

const AflElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        LLP Annual Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps, repeated every financial year. Accounts finalised, certified, and filed with the MCA before every due date.
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

export default AflElegibility;
