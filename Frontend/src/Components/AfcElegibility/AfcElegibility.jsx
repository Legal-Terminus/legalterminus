import React from "react";
import "./AfcElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Annual Calendar Setup",
    day: "Day 0 (April)",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. Annual compliance calendar shared (key dates: 30 Apr MSME-1 H1 / 30 Jun DPT-3 / 30 Sep AGM + DIR-3 KYC + Tax Audit Report / 30 Oct AOC-4 + ITR / 29 Nov MGT-7). Assigned CS + CA confirmed.",
  },
  {
    title: "DPT-3 Filing + Books Closure",
    day: "Day 60-90 (May-Jun)",
    text: "DPT-3 filed BY 30 JUNE (Return of Deposits + outstanding loans). For Enriched / Supreme: year-round bookkeeping closed. Schedule III financial statements (P&L + Balance Sheet + Cash Flow + Notes to Accounts + IT Computation) drafted.",
  },
  {
    title: "Secretarial Documents Preparation (Enriched / Supreme)",
    day: "Day 90-150 (Jul-Aug)",
    text: "For Enriched / Supreme: drafting of BOARD REPORT (Section 134) + NOTICE FOR AGM (Section 101) + LIST OF DIRECTORS + LIST OF SHAREHOLDERS / Members Register + AUDITOR APPOINTMENT DOCUMENTS for AGM agenda + Board Meeting + AGM Minutes drafting + Resolutions (Board + Shareholders) drafting. Coordination with directors on signing + circulation.",
  },
  {
    title: "Statutory Audit Coordination (Supreme only — T/o < ₹1 Cr)",
    day: "Day 120-180 (Aug-Sep)",
    text: "For SUPREME (companies under ₹1 crore turnover): Statutory Audit under Section 139 (mandatory for ALL companies) coordinated. LT's panel CA introduced (or client's existing auditor engaged). Audit engagement letter + scope + books handover + audit fieldwork + audit report finalization.",
  },
  {
    title: "AGM (September Sprint)",
    day: "Day 180-185 (Sep)",
    text: "AGM held by 30 SEPTEMBER (Section 96). For Enriched / Supreme: AGM Minutes drafted; AGM resolutions sealed.",
  },
  {
    title: "ADT-1 (Auditor Appointment) Filing",
    day: "Day 185-200",
    text: "Form ADT-1 filed within 15 DAYS OF AGM (typically by 14 Oct). Statutory auditor's appointment intimated to ROC. One-time per 5-year cycle (re-filed at end of auditor's term).",
  },
  {
    title: "AOC-4 (Financial Statements) Filing",
    day: "Day 200-220 (Oct)",
    text: "Form AOC-4 filed by 29 OCTOBER (within 30 days of AGM). Audited financial statements + Board's report + Auditor's report uploaded. DSC affixation by Director.",
  },
  {
    title: "Company ITR-6 Filing",
    day: "Day 220 (Oct-end)",
    text: "Company ITR-6 filed BY 31 OCTOBER (mandatory audit case for ALL companies). All Schedules + Audit Report references + carry-forward losses + computation uploaded. e-Verification + Acknowledgement.",
  },
  {
    title: "MGT-7 / MGT-7A (Annual Return) Filing + Year-End Review",
    day: "Day 240-260 (Nov)",
    text: "Form MGT-7 (or MGT-7A for OPC / Small Company) filed BY 29 NOVEMBER (within 60 days of AGM). Annual Return includes shareholders + directors + share transfers + meetings + KMP details. Year-end compliance review call.",
  },
];

const AfcElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Annual Filing for Company in India
      </h2>
      <p className="opcelg-subheading">
        Nine steps. End-to-end annual compliance calendar across April - June - September - October - November. Status updates run monthly + change-driven throughout the year.
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
