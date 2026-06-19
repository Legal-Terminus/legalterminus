import React from "react";
import "./TmoppElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Status Protocol Activation",
    day: "Day 0",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. Welcome email + monthly status calendar date + assigned IP-counsel confirmation. Discovery call scheduled to determine: (a) Scenario A or B, (b) grounds count + complexity, (c) evidence availability.",
  },
  {
    title: "Discovery + Strategy Call",
    day: "Day 1-3",
    text: "30-min call with assigned IP-counsel: review of the cited mark (Scenario A) or the opposition notice received (Scenario B); assessment of grounds (Section 9 / 11 / 13 / 14); evidence requirements (use proof / market presence / prior right); strategy finalisation. Confirmation if scope exceeds 25 grounds.",
  },
  {
    title: "Pleading Drafting (Notice OR Counter Statement)",
    day: "Day 3-15",
    text: "Drafting of Notice of Opposition (Scenario A) or Counter Statement (Scenario B) under Form TM-O — up to 25 grounds covering Section 9 / 11 / 13 / 14 as applicable. Each ground argued with statutory basis + case-law citations + factual matrix. Internal review by senior counsel.",
  },
  {
    title: "Client Review + Filing",
    day: "Day 15-30",
    text: "Draft shared with client for review + comments + sign-off. Iteration as needed. Final pleading sealed. Filing on IP India online portal via Form TM-O with DSC affixation by LT's associated Attorney. Govt fee ₹2,700/class paid (Scenario A only). Challan + Acknowledgement emailed to client. Well within statutory windows.",
  },
  {
    title: "Evidence Stage — Drafting Affidavit (Enriched / Supreme)",
    day: "Day 60-120",
    text: "Within 2 months of the next-stage trigger: drafting of Evidence Affidavit (Rule 45 if opposer / Rule 46 if applicant). Documentary evidence compilation (use evidence / market presence / sales data / advertising material / prior registration certificates). Notarisation coordination. Service on opposite party.",
  },
  {
    title: "Reply Evidence Stage — Opposer's Rebuttal (Supreme — opposer side)",
    day: "Day 180-300",
    text: "If opposer side (Scenario A): within 1 month + 1 month extension under Rule 47, drafting of Reply Evidence Affidavit addressing the applicant's evidence. Document analysis + counter-evidence + supplementary case-law.",
  },
  {
    title: "Hearing Brief Preparation (Supreme)",
    day: "Day 300-450",
    text: "Once pleadings + evidence closed: HEARING BRIEF drafted with summary of pleadings + key evidence highlights + case-law digest + adjournment management strategy. Paper-book preparation. Pre-hearing call with client to align on key arguments.",
  },
  {
    title: "Final Hearing + Registrar's Order (Supreme)",
    day: "Day 365-1500+",
    text: "Online video conference hearing under Rule 50. LT's associated Attorney attends + argues + handles cross-questions. Written submissions filed. Registrar's order typically issued 30-90 days post-hearing. Order communicated to client + next steps discussed (if accept / refuse / conditional). Full lifecycle.",
  },
];

const TmoppElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Trademark Opposition in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end opposition lifecycle: 2-5 YEARS typical from pleadings to Registrar's order. Status updates run monthly + change-driven across the entire lifecycle.
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

export default TmoppElegibility;
