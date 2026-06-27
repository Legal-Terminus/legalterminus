import React from "react";
import "./ItrBizElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Entity-Type Confirmation",
    day: "Day 0",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. Welcome email + intake questionnaire confirming ENTITY TYPE (proprietor vs partnership firm) + business type + turnover + GST status + presumptive scheme suitability + (for PF) Partnership Deed details.",
  },
  {
    title: "Income Tax Portal Account + Pre-Filling Data",
    day: "Day 0-2",
    text: "IT portal account verified / created for entity. PAN-Aadhaar linkage (proprietor) or Partner DSCs verified. Form 26AS + AIS + TIS downloaded - TDS / TCS / advance tax credits + (for PF) Section 194T compliance check.",
  },
  {
    title: "Tally Bookkeeping Setup (Supreme - year-round)",
    day: "Day 1 onwards",
    text: "For SUPREME: Tally ERP / Prime company file setup + Chart of Accounts + (for PF) Partner Capital Accounts + GST configuration (if registered). Monthly transaction recording begins. (Elemental / Enriched skip this.)",
  },
  {
    title: "Books Closure + Balance Sheet + Partner Computations (Enriched / Supreme)",
    day: "Day 3-12",
    text: "For ENRICHED / SUPREME: books closed + Balance Sheet + P&L + IT Computation + depreciation prepared. For PARTNERSHIP FIRM additionally: Section 40(b) partner REMUNERATION (using Budget 2024 Rs.6L first-slab limit) + Section 40(b)(iv) partner INTEREST (12% cap) computed + partner capital accounts reconciled + Section 194T TDS (if applicable, Supreme) deducted + Form 26Q filed.",
  },
  {
    title: "ITR Form Selection + Tax Computation",
    day: "Day 5-12",
    text: "Appropriate ITR form selected: ITR-3 (proprietor regular), ITR-4 Sugam (either presumptive), ITR-5 (PF regular). For PROPRIETOR: Old vs New regime calculation (Enriched / Supreme) + Section 87A rebate applied (if applicable). For PARTNERSHIP FIRM: Flat 30% computation + Section 40(b) deductions + surcharge if T/o > Rs.1Cr + 4% cess + AMT check (Section 115JC).",
  },
  {
    title: "ITR Filling + Client Review",
    day: "Day 7-14",
    text: "ITR populated. Draft return shared with client for review. Tax payable position confirmed. For PARTNERSHIP FIRM: partner-wise share of profit (taxable in partners' hands) computed + Section 194T TDS certificates issued (Supreme).",
  },
  {
    title: "Tax Payment Coordination + ITR Submission",
    day: "Day 10-15",
    text: "If TAX PAYABLE: client makes self-assessment tax payment via challan - PAID DIRECTLY BY CLIENT per T&C #2. CRN + BSR code captured. ITR submitted on portal. E-VERIFICATION within 30 days (Aadhaar OTP for proprietor / DSC for PF).",
  },
  {
    title: "Acknowledgement Delivery + Refund Tracking + Intimation Monitoring",
    day: "Day 15 onwards",
    text: "ITR-V Acknowledgement delivered. Refund tracking. Section 143(1) Intimation typically within 60-90 days. STATUS UPDATE COMMITMENT continues through refund + post-filing notices.",
  },
];

const ItrBizElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for ITR Filing for Business in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 3-7 working days from kickoff to ITR filing (Elemental); 7-15 days (Enriched); year-round engagement (Supreme - monthly bookkeeping cycle). Status updates run through ITR processing + refund.
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
