import React from "react";
import "./ItrIndElegibility.css";

const steps = [
  {
    title: "Discovery & Form Selection",
    day: "Step 1",
    text: "A quick review of your income sources — salary, house property, capital gains, business, or foreign income — and residential status. We confirm the correct return (ITR-1, 2, 3, or 4) so the right form is filed from the start.",
  },
  {
    title: "Document Collection",
    day: "Step 2",
    text: "We share a simple checklist. You upload Form 16, bank/interest statements, capital-gains statements, rent receipts, and investment proofs. That's your only task — we take it from there.",
  },
  {
    title: "26AS / AIS Reconciliation",
    day: "Step 3",
    text: "We download your Form 26AS, AIS, and TIS and match every TDS credit and reported transaction against your documents. Mismatches — unreported interest, dividends, or share sales — are identified and resolved before filing.",
  },
  {
    title: "Regime Comparison & Tax Computation",
    day: "Step 4",
    text: "We compute your income, apply all eligible deductions, and run an old-vs-new tax regime comparison on your actual numbers — so you file under the regime that gives you the lower tax and the bigger refund.",
  },
  {
    title: "Your Review & Approval",
    day: "Step 5",
    text: "You receive a clear computation showing income, deductions, tax payable or refund, and the chosen regime. Any balance tax is paid via challan. Nothing is filed until you approve the numbers.",
  },
  {
    title: "E-Filing & E-Verification",
    day: "Step 6",
    text: "The return is e-filed on the income tax portal and e-verified (Aadhaar OTP / net banking) within the 30-day window. You receive the ITR-V acknowledgement and computation, and we track your refund until it's credited.",
  },
];

const ItrIndElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Personal ITR Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps. Reconciled, optimised, and e-filed well before the due date — with an expert reviewing every return.
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

export default ItrIndElegibility;
