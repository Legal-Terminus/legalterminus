import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Section 366 Eligibility Audit",
    day: "Day 0",
    text: "60-min call with our Company Secretary to confirm: founder's Indian-citizen + 120-day-residency status (Rule 3), nominee identification + consent, single-OPC rule check, business activity + NIC code, registered office, authorised capital, proprietorship's books-audit readiness, list of creditors, current GST / FSSAI / Shop & Estd / Trade License / Udyam / Trademarks.",
  },
  {
    title: "Documents + Audited Statement Preparation",
    day: "Day 1–7",
    text: "Personalised checklist: founder's PAN + Aadhaar + photograph, nominee's PAN + Aadhaar + INC-3 consent + photograph, registered office proof + NOC, audited statement of accounts of the proprietorship (not older than 30 days from URC-1 filing - we coordinate audit if not ready), list of members + creditors with consents, last 3 years' ITRs + GST returns.",
  },
  {
    title: "DSC + DIN + SPICe+ Part A Name Reservation",
    day: "Day 7–9",
    text: "DSC procured for director + nominee. DIN auto-applied via SPICe+. SPICe+ Part A filed on MCA portal with up to 4 proposed names ending with '(OPC) Private Limited'. MCA approval typically Day 7-9.",
  },
  {
    title: "URC-2 Newspaper Advertisement - Publication",
    day: "Day 9–10",
    text: "Form URC-2 drafted in compliant format. Published in TWO newspapers - ONE English + ONE in the principal vernacular language of the State / UT where the proprietorship is situated. Notice of conversion + invitation for objections from creditors / members / public. Publication date is Day 0 of the statutory 21-day objection window.",
  },
  {
    title: "21-Day Statutory Objection Window",
    day: "Day 10–31",
    text: "Mandatory 21-day window during which creditors / members / public can object to the conversion. We monitor incoming objections, respond to legitimate concerns, and prepare an objection-handling note for URC-1. Most clean cases pass through without objections.",
  },
  {
    title: "URC-1 Application + SPICe+ Part B Filing",
    day: "Day 31–33",
    text: "After the 21-day window closes: Form URC-1 application + SPICe+ Part B + AGILE-PRO-S filed in parallel on MCA portal. Attachments: URC-2 newspaper cuttings, audited statement, list of members + creditors with consents, declaration of solvency, affidavits, INC-3 nominee consent, INC-9 declaration, MOA + AOA.",
  },
  {
    title: "ROC Scrutiny + CoI Issuance",
    day: "Day 33–45",
    text: "Registrar of Companies reviews URC-1 + SPICe+ Part B. Any queries / objections (typically: URC-2 cutting clarity, audited statement adequacy, NIC code match) addressed within 7 days. On approval: Certificate of Incorporation issued under Section 367 + PAN + TAN auto-generated + AGILE-PRO-S registrations activated.",
  },
  {
    title: "GST Migration + Asset Transfer + License Migration",
    day: "Day 45–90",
    text: "Enriched / Supreme / Supreme Plus: Proprietorship GST cancelled via Form REG-16; OPC's GSTIN already active via AGILE-PRO-S. ITC transferred via Form ITC-02. Corporate bank account opened. Supreme / Supreme Plus: Asset Transfer Agreement signed; FSSAI / Shop & Estd / Trade License / Udyam re-registered or amended under OPC name; proprietorship wound down. Supreme Plus: TM-P trademark assignment.",
  },
];

const PtoopcSteps = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for Converting Proprietorship to an OPC
      </h2>
      <p className="pv-gst-subheading">
        Eight steps anchored to the URC-1 + URC-2 statutory waiting period. End-to-end timeline: 35-50 working days for clean cases (URC-2 publication + 21-day objection window + URC-1 filing + ROC scrutiny + CoI). Migration items (GST, bank, licenses) run in parallel where possible.
      </p>

      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="pvtltd-timeline-dot">{index + 1}</div>

            <div className="pvtltd-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="pvtltd-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PtoopcSteps;
