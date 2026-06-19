import React from "react";
import "./TmexrElegibility.css";

const steps = [
  {
    title: "Engagement Acceptance + Status Protocol Activation",
    day: "Day 0",
    text: "Within 24 hours of plan selection + payment: STATUS UPDATE COMMITMENT activated. You receive a welcome email confirming the engagement + the monthly status calendar date + the IP-counsel assigned to your matter.",
  },
  {
    title: "Examination Report Analysis + Discovery Call",
    day: "Day 1–3",
    text: "30-min call with the assigned IP-counsel: we walk through each objection in the ER, assess legal merit, identify required evidence (use claims / co-existence agreements / market data), and finalise the reply strategy.",
  },
  {
    title: "Attorney Change Procedure (Enriched / Supreme — if applicable)",
    day: "Day 3–10",
    text: "If you're switching attorney to LT: Form TM-48 POA drafted in LT's associated Attorney's name + Authorisation Letter for the POA signatory + ₹100 stamp paper execution coordination + change-of-attorney filing on the IP India portal. (For Enriched / Supreme cases only.)",
  },
  {
    title: "Document Collection + Evidence Compilation",
    day: "Day 3–8",
    text: "Personalised checklist: existing TM application + filed ER, use evidence (invoices / advertising / market presence — for Section 9 replies), prior user affidavits (if Section 9 acquired distinctiveness), co-existence agreements (for Section 11 replies), supporting case-law research.",
  },
  {
    title: "Reply Letter Drafting + Internal Review",
    day: "Day 8–15",
    text: "Reply drafted by IP-counsel addressing each objection with: (a) legal arguments, (b) case-law citations, (c) supporting documents / affidavits / evidence. Internal review by senior counsel.",
  },
  {
    title: "Client Review + Confirmation",
    day: "Day 12–18",
    text: "Draft reply shared with client for review + comments + sign-off. Iteration as needed. Final reply sealed + ready for filing. CLIENT CONFIRMATION required before submission.",
  },
  {
    title: "Reply Filing on IP India Portal + DSC Affixation",
    day: "Day 18–25",
    text: "Reply filed under the Miscellaneous head 'Reply to Examination Report' on the IP India online portal (https://ipindiaonline.gov.in). DSC AFFIXATION by LT's associated Attorney. Application reference number generated. CHALLAN + ACKNOWLEDGEMENT emailed to client immediately (well within the Rule 29 30-day window).",
  },
  {
    title: "Show Cause Hearing — Brief Preparation (Supreme only)",
    day: "Day 90–180",
    text: "If the Examiner schedules a Show Cause Hearing (Rule 33) post-reply: LT prepares the HEARING BRIEF with arguments + evidence compilation + case-law summary. Adjournment via Form TM-M (₹900 pass-through) only if genuinely needed. (Depending on the Registry hearing calendar.)",
  },
  {
    title: "Show Cause Hearing — Online Attendance (Supreme only)",
    day: "Day 90–180+",
    text: "LT's associated Attorney attends the online video-conference hearing + argues the matter + handles cross-questions from the Hearing Officer + submits final written submissions. Up to 2 hearings covered under Supreme.",
  },
  {
    title: "Final Disposition + Status Update",
    day: "Day 180–365",
    text: "Once the Registry issues its decision (Accepted + published in Journal / Refused under Section 18(5) / Conditional acceptance), we notify you within 1–2 days. If accepted + published, the public opposition window opens (4 months). If refused, we discuss appeal options (separate engagement). Status updates continue through final disposition.",
  },
];

const TmexrElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Reply of Examination Report in India
      </h2>
      <p className="opcelg-subheading">
        End-to-end timeline: typically 7–20 working days from kickoff to reply filing (within the Rule 29 30-day window). Show Cause Hearing (Supreme) typically scheduled 3–6 months post-reply by the Registry. Status updates run monthly + change-driven through to final disposition.
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

export default TmexrElegibility;
