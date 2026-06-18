import React from "react";
import "./TmarkElegibility.css";

const steps = [
  {
    title: "Discovery & Name Search (Up to 5 Names)",
    day: "Day 0–1",
    text: "60-min call with our IP-counsel to confirm: trademark type (wordmark / logo / combination, Sound, Color), business activity, goods / services + Nice class identification, applicant type (individual / startup / MSME / company), proposed-to-be-used vs prior-use status. We run NAME SEARCH on the IP India database (https://tmrsearch.ipindia.gov.in) for UP TO 5 NAMES + shortlist clear candidates.",
  },
  {
    title: "Class Identification + Objects / Goods Description",
    day: "Day 1–2",
    text: "Map your actual goods + services to the right Nice Class(es) — 1–34 for goods, 35–45 for services. Draft the OBJECTS / GOODS DESCRIPTIONS for the TM-A application — the description determines protection scope. Too narrow = limited protection; too broad = examination objection. Senior-counsel reviewed.",
  },
  {
    title: "Power of Attorney + Authorization Letter + User Affidavit",
    day: "Day 2–4",
    text: "POWER OF ATTORNEY (Form TM-48) drafted — authorizing our TM Agent to file + prosecute the application on your behalf. Stamped + signed by applicant, and we also prepare the authorization letter to sign the POA. For ENRICHED (prior-use marks): USER AFFIDAVIT drafted declaring date of first use + evidence coordination (invoices, advertisements, social media, GST records, website screenshots, packaging samples).",
  },
  {
    title: "Client Confirmation + Government Fee Submission",
    day: "Day 4–7",
    text: "Final TM-A application PDF + POA + user affidavit (if applicable) shared with client for CONFIRMATION. Any revisions handled. GOVERNMENT FEE COMPUTED (₹4,500 / ₹9,000 per class depending on applicant type — Supreme / Supreme Plus help with Udyam to unlock the rebate). Payment made via IP India portal / NEFT / RTGS.",
  },
  {
    title: "TM-A Filing on IP India Portal + Acknowledgement",
    day: "Day 8–10",
    text: "Final TM-A application + POA + (enriched+) user affidavit + supporting documents UPLOADED to IP India online portal (https://ipindiaonline.gov.in). Application Number + Filing Date generated. ACKNOWLEDGEMENT + CHALLAN emailed to client the same day.",
  },
  {
    title: "Monthly Status Updates + (Supreme+) Examination Response",
    day: "Month 1–6",
    text: "We track application status on the IP India portal monthly + send you a STATUS UPDATE EMAIL. EXAMINATION REPORT typically issued within 3–6 months citing Section 9 (descriptive) / Section 11 (similar marks) / Section 18 (clarification) objections. Supreme + Supreme Plus handle up to 2 DEPARTMENTAL QUERY RESPONSES + arguments + case-law citations.",
  },
  {
    title: "(Supreme Plus) Hearing + Counter-Statement Coordination",
    day: "Month 6–18",
    text: "Where examination objections persist OR an opposition is filed (post Trade Marks Journal publication), Supreme Plus covers MAX 2 HEARINGS before the Trade Marks Registry (in-person or video conference) + OPPOSITION HANDLING (1 time) — Counter-Statement filed within 2 months under Section 21 + coordination through the evidence stage.",
  },
  {
    title: "Trade Marks Journal Publication + Registration Certificate",
    day: "Month 12–36+",
    text: "On acceptance, the mark is PUBLISHED in the Trade Marks Journal (Section 20) — a 4-month opposition window opens. If no opposition (or opposition fails), the REGISTRATION CERTIFICATE is issued under Section 23. Valid for 10 YEARS from the application date. We deliver the registration certificate PDF + register-extract + onboarding kit (next renewal calendar, brand-protection guidance). Month 12–24 (clean cases) / Month 24–36+ (contested).",
  },
];

const TmarkElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Trademark Registration in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. End-to-end timeline: 10–15 working days from kickoff to TM-A filing; 12–24 months to registration certificate for clean cases; 24–36+ months where examination objections / oppositions arise. Monthly status updates included in all plans throughout the journey.
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

export default TmarkElegibility;
