import React from "react";
import "./TmhearElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Status Protocol Activation",
    day: "Day 0",
    text: "Within 24 hours of plan selection + payment: Status Update Commitment activated. Welcome email + assigned IP-counsel confirmation. Hearing notice + prior case file uploaded by client.",
  },
  {
    title: "Hearing Notice Review + Case File Analysis",
    day: "Day 1-3",
    text: "Assigned IP-counsel reviews: hearing notice + prior pleadings (Examination Report + Reply OR Opposition + Counter Statement + Evidence) + Registrar's interlocutory orders + cited prior decisions. Hearing strategy memo prepared internally.",
  },
  {
    title: "Discovery + Strategy Call",
    day: "Day 3-7",
    text: "30-min (Elemental) / 60-min (Enriched) / Multiple (Supreme) strategy call with client: review of hearing objectives, factual matrix, key arguments, likely Hearing Officer questions, document availability.",
  },
  {
    title: "Power of Attorney Setup (if LT's associate is new attorney)",
    day: "Day 3-10",
    text: "Where LT is not the prior attorney on file: Form TM-48 POA drafted in LT's associated Attorney's name + Authorisation Letter + ₹100 stamp paper execution + change-of-attorney filing on IP India portal (₹999 + GST).",
  },
  {
    title: "Hearing Brief Drafting (Enriched / Supreme)",
    day: "Day 7-15",
    text: "HEARING BRIEF drafted with: (a) statement of issues, (b) top 3-5 arguments with statutory basis, (c) case-law digest with relevant paragraph highlights, (d) factual chronology, (e) Q&A preparation for likely Hearing Officer questions. Paper-book compiled. Internal review.",
  },
  {
    title: "Pre-Hearing Client Briefing",
    day: "Day 13-15",
    text: "24-48 hours before hearing: pre-hearing call to align on key arguments + likely Q&A + technical setup (joining link, camera test, professional setup). Client may attend hearing as observer.",
  },
  {
    title: "Hearing Day — Online Attendance",
    day: "Day 15-30",
    text: "LT's associated Attorney attends the online video conference hearing at the scheduled time. Oral arguments (10-15 minutes), Hearing Officer Q&A handling, written submissions filed in real time or post-hearing as directed. Hearing minutes recorded by Registry.",
  },
  {
    title: "Post-Hearing Follow-Up + Order Receipt",
    day: "Day 30-120",
    text: "Post-hearing summary to client (1-page Elemental / detailed Enriched / Supreme advisory). Written submissions filed if directed by Hearing Officer. Follow-up on IP India portal for order receipt — typically 30-90 days post-hearing. Order analysis + next-steps advisory (acceptance / appeal under Section 91 / etc.). Status Update Commitment continues through order receipt.",
  },
];

const TmhearElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Trademark Hearing in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 15-30 days from engagement to hearing day; order typically 30-90 days post-hearing. Status updates run monthly + change-driven through order receipt.
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

export default TmhearElegibility;
