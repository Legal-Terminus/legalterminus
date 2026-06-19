import React from "react";
import "./TmrnwElegibility.css";

const steps = [
  {
    title: "Reminder Triggered (90 Days Before Expiry) — Our Lifelong Calendar",
    day: "Day −90",
    text: "Our LIFELONG REMINDER CALENDAR triggers automatically 90 days before your trademark expiry date. We email you to flag the upcoming renewal + suggest filing immediately to avoid surcharge. Reminder repeats at 60 / 30 / 7 days if no action.",
  },
  {
    title: "Discovery, Plan Selection & Status Verification",
    day: "Day −90 to −60",
    text: "30-min call with our IP-counsel to confirm: existing trademark registration number + class(es) + proprietor name + applicant type + WHO is the current agent of record (this determines if Enriched is needed). We RUN A STATUS CHECK on the IP India portal (https://tmrsearch.ipindia.gov.in) to verify mark status + expiry date + any pending Form TM-M / TM-P transactions.",
  },
  {
    title: "Attorney Change Procedure (Enriched / Supreme only — if applicable)",
    day: "Day −60 to −45",
    text: "If you're switching Attorney to LT's Attorney: we draft FORM TM-48 (Power of Attorney) + Authorisation Letter for the POA signatory + coordinate ₹100 stamp paper execution + file change-of-agent on the IP India portal. Acknowledgement received. Once the Attorney change is processed, we proceed to renewal filing.",
  },
  {
    title: "Document Collection + Final Review",
    day: "Day −45 to −30",
    text: "Personalised checklist: existing Trademark Registration Certificate, proprietor's PAN + identity proof, MSME / Startup / Individual status documents (for the 50% fee rebate context). For Restoration cases: additional documents supporting the Statement of Case.",
  },
  {
    title: "Form TM-R Drafting + Client Confirmation",
    day: "Day −45 to −30",
    text: "Form TM-R drafted with the correct trademark number + class(es) + applicant name + applicant category. We share the draft for CLIENT CONFIRMATION before submission.",
  },
  {
    title: "Government Fee Computation + Payment",
    day: "Day −30 to −7",
    text: "Government fee computed per class based on applicant category + surcharge if late + restoration fee if applicable. (Note: renewal Govt fee is uniform ₹9,000 per class — no MSME rebate at renewal.) Total fee shared with client. Payment made via IP India portal payment gateway / NEFT / RTGS.",
  },
  {
    title: "Form TM-R Filing + DSC Affixation",
    day: "Day −7 to 0",
    text: "Form TM-R uploaded on the IP India online portal (https://ipindiaonline.gov.in). DSC AFFIXATION BY LT as your registered TM agent. Application reference number generated. CHALLAN + ACKNOWLEDGEMENT emailed to client immediately (or post-expiry depending on plan).",
  },
  {
    title: "Renewal Certificate Issuance",
    day: "Day 30–60",
    text: "The Trade Marks Registry processes the renewal. RENEWAL CERTIFICATE typically issued within 30–60 days from filing. We deliver: Renewal Certificate PDF + register-extract showing renewed status + updated 10-year validity period.",
  },
  {
    title: "Trademark Watch Activated (Supreme) + Next-Cycle Calendar Set",
    day: "Day 60+",
    text: "Once renewal is complete: (a) for SUPREME clients — 12-MONTH TRADEMARK WATCH SERVICES activated; monthly watch reports start; Journal monitoring for similar marks begins; (b) the LIFELONG REMINDER CALENDAR is RESET for the NEXT 10-YEAR CYCLE. Reminders at 90 / 60 / 30 / 7 days before the new expiry. CONTINUES INDEFINITELY for every subsequent 10-year cycle.",
  },
];

const TmrnwElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Trademark Renewal in India
      </h2>
      <p className="opcelg-subheading">
        End-to-end timeline: 7–10 working days from kickoff to TM-R filing (10–15 days if Agent Change is involved). Renewal Certificate typically issued in 30–60 days from filing. Plus our reminder calendar runs in the background for the next 10-year cycle + beyond, and (Supreme only) 12 months of Trademark Watch starts on Certificate issuance.
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

export default TmrnwElegibility;
