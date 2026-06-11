import React from "react";
import "./ItrBizElegibility.css";

const steps = [
  {
    title: "Discovery & Form Selection",
    day: "Step 1",
    text: "A short review to map your entity type (proprietor, firm, LLP, company), nature of income, turnover, and presumptive eligibility. We confirm the correct return — ITR-3, ITR-4, ITR-5, or ITR-6 — and flag whether a tax audit under Section 44AB is likely to apply.",
  },
  {
    title: "Document & Data Collection",
    day: "Step 2",
    text: "We share a business-specific checklist. You submit your books / P&L & balance sheet (or turnover summary for presumptive), bank statements, GST returns, TDS certificates, and investment proofs. This is your only real task — we handle the computation.",
  },
  {
    title: "26AS / AIS Reconciliation",
    day: "Step 3",
    text: "We download your Form 26AS, AIS, and TIS and reconcile every TDS credit and reported transaction against your books. Mismatches — unreported interest, high-value entries, GST-vs-ITR turnover gaps — are identified and resolved before filing.",
  },
  {
    title: "Income Computation & Tax Optimisation",
    day: "Step 4",
    text: "We compute business/professional income, apply depreciation, partner remuneration, and Chapter VI-A deductions, and prepare a presumptive-vs-regular comparison where relevant — arriving at the correct, lowest lawful tax liability.",
  },
  {
    title: "Your Review & Tax Payment",
    day: "Step 5",
    text: "You receive a clear computation sheet showing income, deductions, and net tax payable or refund. Any self-assessment tax is paid via challan. Nothing is filed until you approve the numbers.",
  },
  {
    title: "E-Filing & Verification",
    day: "Step 6",
    text: "The return is e-filed on the income tax portal and e-verified (Aadhaar OTP / DSC / net banking). You receive the ITR-V acknowledgement, computation, tax-paid challans, and a carry-forward-loss record for next year.",
  },
];

const ItrBizElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Business ITR Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps. Reconciled, optimised, and e-filed well before the due date — with a CA reviewing every return.
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

export default ItrBizElegibility;
