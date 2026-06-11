import React from "react";
import "./GstFilingElegibility.css";

const steps = [
  {
    title: "Onboarding & GSTIN Review",
    day: "Step 1",
    text: "We map your GSTIN(s), filing frequency (monthly or QRMP), scheme (regular/composition), and applicable returns. A filing calendar is set up with every due date — GSTR-1, GSTR-3B, and annual returns — so nothing is left to memory.",
  },
  {
    title: "Data Collection",
    day: "Step 2",
    text: "Each period you share your sales register, purchase register, bank statement, and any debit/credit notes. We provide a simple template; this is your only recurring task. Cut-off is at least 3 working days before the due date.",
  },
  {
    title: "ITC Reconciliation",
    day: "Step 3",
    text: "We download your GSTR-2B and reconcile it against your purchase register — identifying eligible ITC, mismatches, and vendor non-uploads. You get a clear list of credits to claim, reverse, or chase with suppliers.",
  },
  {
    title: "Return Preparation & Tax Computation",
    day: "Step 4",
    text: "We prepare GSTR-1 (outward supplies, HSN summary) and GSTR-3B (tax liability net of ITC). The net tax payable in cash is computed and shared with you for confirmation before any filing.",
  },
  {
    title: "Your Approval & Tax Payment",
    day: "Step 5",
    text: "You review the summary and pay the net tax via challan / net banking. We guide the offset of liability against available ITC and cash ledger so you pay exactly what's due — no more, no less.",
  },
  {
    title: "Filing & ARN Confirmation",
    day: "Step 6",
    text: "Returns are filed on the GST portal before the due date. You receive the ARN acknowledgement, a tax summary, and an updated compliance log. Annual returns (GSTR-9/9C) follow the same flow at year-end.",
  },
];

const GstFilingElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        GST Return Filing Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps, repeated every filing period. Reconciled, reviewed, and filed before the due date — every time.
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

export default GstFilingElegibility;
