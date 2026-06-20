import React from "react";
import "./AflElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Annual Calendar Setup",
    day: "Day 0 (Apr-May)",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. Annual compliance calendar shared (key dates: 30 April books closure / 30 May Form 11 / 30 Jun ITR books / 31 Jul non-audit ITR / 30 Sep Tax Audit Report / 30 Oct Form 8 + audit ITR).",
  },
  {
    title: "Books Closure + Financial Statement Preparation (Enriched / Supreme)",
    day: "Day 1-30 (April)",
    text: "For Enriched / Supreme: year-round bookkeeping closed by 30 April. Profit & Loss Account + Balance Sheet + Income Tax Computation prepared. Trial Balance reconciliation. Bank statement matching. For Elemental: client provides ready financial statements.",
  },
  {
    title: "Form LLP-11 (Annual Return) Drafting + Filing",
    day: "Day 40-60 (May)",
    text: "Form LLP-11 drafted: Partners + Designated Partners details + contribution details + body corporate information + statement of changes. Form sealed + client confirmation + DSC affixation by Designated Partners + filing on MCA portal. Filed BY 30 MAY 2026.",
  },
  {
    title: "LLP ITR-5 (Non-Audit Cases) Filing",
    day: "Day 90-120 (Jun-Jul)",
    text: "For LLPs without tax audit: ITR-5 prepared with Profit & Loss + Balance Sheet + computation + partner remuneration / interest disclosure. Filed on Income Tax portal BY 31 JULY 2026. e-Verification + Acknowledgement to client.",
  },
  {
    title: "Form LLP-8 (Statement of Account) Drafting + Filing",
    day: "Day 200-240 (October)",
    text: "Form LLP-8 drafted: Statement of Account & Solvency + Profit & Loss + Balance Sheet (CA-certified for statutory/tax audit cases). Form sealed + client confirmation + Designated Partners DSC + filing on MCA portal. Filed BY 30 OCTOBER 2026.",
  },
  {
    title: "LLP ITR-5 (Audit Cases) Filing + Year-End Review",
    day: "Day 210-240 (Oct-Nov)",
    text: "For LLPs with statutory or tax audit: ITR-5 filed BY 31 OCTOBER 2026 with audit report references. Year-end compliance review call — highlighting next year's calendar + any structural changes needed. STATUS UPDATE COMMITMENT reset for next FY cycle.",
  },
];

const AflElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Annual Filing for LLP in India
      </h2>
      <p className="opcelg-subheading">
        Six steps. End-to-end annual compliance calendar across April - May - July - September - October. Status updates run monthly + change-driven throughout.
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
