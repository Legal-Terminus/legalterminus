import React from "react";
import "./ItrIndElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Plan Confirmation",
    day: "Day 0",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. Welcome email + intake questionnaire confirming plan tier (Base 1-3 or Plus 1-3 based on your income level + complexity layers).",
  },
  {
    title: "Income Tax Portal Account + Profile Verification",
    day: "Day 0-1",
    text: "Income Tax portal account verified / created (https://www.incometax.gov.in). Profile updated (PAN, Aadhaar, address, bank account for refund). PAN-Aadhaar linkage verified (mandatory).",
  },
  {
    title: "Pre-Filled Data Download + Reconciliation",
    day: "Day 1-2",
    text: "FORM 26AS (TDS / TCS / advance tax credits) + AIS (Annual Information Statement showing high-value transactions, share trades, dividends, MF redemptions, property purchases / sales, large bank deposits) + TIS (Taxpayer Information Summary) downloaded from portal. Reconciled with client's records.",
  },
  {
    title: "Income Computation by Source",
    day: "Day 2-4",
    text: "Income consolidated under 5 heads: (a) Salary + (b) House Property + (c) Capital Gains (Plus tier) + (d) Other Sources (interest, dividends, gifts) + (e) Foreign Income (Enriched+ / Supreme+). For Plus tier: capital gains computation + cost basis + indexation (where applicable) + FTC claim.",
  },
  {
    title: "Old vs New Regime Comparison (Enriched onwards)",
    day: "Day 3-5",
    text: "Tax computed under BOTH regimes: NEW REGIME (default - simpler, no Sec 80 deductions allowed) vs OLD REGIME (Section 80C / 80D / 80CCD / 80G / Home Loan interest / HRA claimed). LOWER-TAX regime selected + filed. For Old Regime filers: Form 10-IEA filed to opt out of New Regime.",
  },
  {
    title: "ITR Form Filling + Schedule-Wise Disclosure",
    day: "Day 4-6",
    text: "Appropriate ITR (ITR-1 / ITR-2) populated with all schedules. For Plus tier: Schedule CG (Capital Gains) + Schedule SI (Special Income capital gains rates) + Schedule FA (Foreign Assets - Enriched+/Supreme+) + Form 67 (FTC - Enriched+/Supreme+). Draft return shared with client.",
  },
  {
    title: "Tax Payment Coordination + ITR Submission",
    day: "Day 5-7",
    text: "If TAX PAYABLE: self-assessment tax challan generated via e-Pay tax - CLIENT PAYS DIRECTLY to Government (per T&C #5). CRN + BSR code captured in ITR. ITR submitted on portal. E-VERIFICATION within 30 days (Aadhaar OTP / Net banking / DEMAT / EVC via bank ATM).",
  },
  {
    title: "ITR-V Delivery + Refund Tracking + Intimation Monitoring",
    day: "Day 7 onwards",
    text: "ITR-V Acknowledgement delivered to client. If refund expected: refund tracking via portal (typical processing 30-45 days post e-Verification). Section 143(1) Intimation Order monitored - any mismatch / demand addressed. STATUS UPDATE COMMITMENT continues through refund issuance + any post-filing notices.",
  },
];

const ItrIndElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for ITR Filing for Individuals in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 2-5 working days from kickoff to ITR filing (Base tier); 5-10 days (Plus tier). Status updates run through ITR processing + refund.
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
