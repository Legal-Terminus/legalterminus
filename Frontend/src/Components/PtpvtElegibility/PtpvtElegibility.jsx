import React from "react";
import "./PtpvtElegibility.css";

const steps = [
  {
    title: "Discovery & Partnership Deed + Eligibility Audit",
    day: "Day 0",
    text: "60-min call with our Company Secretary to confirm: Partnership Deed terms + registration status under Partnership Act 1932, all partners' identities + KYC, business activity + NIC code, registered office, capital contribution + profit-sharing ratio of each partner, partner-to-director / shareholder mapping preferences, audited-accounts readiness, creditor list, current GST / FSSAI / Shop & Estd / Trade License / Udyam / Trademarks, and Section 115BAA + DPIIT eligibility.",
  },
  {
    title: "Documents + Audited Statement Preparation",
    day: "Day 1–7",
    text: "Personalised checklist: each partner's PAN + Aadhaar + photograph + KYC, registered office proof + NOC, audited statement of accounts of the firm (not older than 30 days from URC-1 filing — we coordinate the audit if not ready), Capital Account statement of each partner, list of creditors with consents, last 3 years' firm ITRs + GST returns, and the registration certificate of the firm.",
  },
  {
    title: "DSC + DIN + SPICe+ Part A Name Reservation",
    day: "Day 7–9",
    text: "DSC procured for ALL partner-directors (Class 3 Individual, 2-year). DIN auto-applied via SPICe+. SPICe+ Part A filed on the MCA portal with up to 4 proposed names ending with 'Private Limited'. MCA approval typically within 1–2 days.",
  },
  {
    title: "URC-2 Newspaper Advertisement — Publication",
    day: "Day 9–10",
    text: "Form URC-2 drafted in compliant format. Published in TWO newspapers — ONE English + ONE in the principal vernacular language of the State / UT where the firm is situated. Notice of conversion + invitation for objections from creditors / members / public. The publication date is Day 0 of the statutory 21-day objection window.",
  },
  {
    title: "21-Day Statutory Objection Window",
    day: "Day 10–31",
    text: "Mandatory 21-day window during which creditors / members / public can object to the conversion. We monitor incoming objections, respond to legitimate concerns, and prepare an objection-handling note for URC-1. Most clean cases pass through without objections.",
  },
  {
    title: "URC-1 Application + Capital Mapping + SPICe+ Part B Filing",
    day: "Day 31–33",
    text: "After the 21-day window closes: Form URC-1 application + SPICe+ Part B + AGILE-PRO-S filed in parallel on the MCA portal. Attachments: URC-2 newspaper cuttings, audited statement, list of partners + capital accounts + profit-sharing ratio, list of creditors with consents, declaration of solvency, affidavits, INC-9 declarations by all partner-directors + subscribers, Partnership Deed, share-allotment schedule (per capital accounts), and MOA + AOA.",
  },
  {
    title: "ROC Scrutiny + CoI Issuance",
    day: "Day 33–45",
    text: "The Registrar of Companies reviews URC-1 + SPICe+ Part B. Any queries / objections (typically: URC-2 cutting clarity, audited statement adequacy, NIC code match, capital allotment proportionality vs Section 47(xiii)) are addressed within 7 days. On approval: Certificate of Incorporation issued under Section 367 + PAN + TAN auto-generated + AGILE-PRO-S registrations activated.",
  },
  {
    title: "Partnership Dissolution + GST Migration + Asset Transfer",
    day: "Day 45–90",
    text: "Post-CoI: Firm's GSTIN cancelled via Form REG-16; the Pvt Ltd's GSTIN is already active via AGILE-PRO-S. ITC transferred via Form ITC-02. Corporate bank account opened. Supreme Plus: Asset Transfer Agreement signed; vendor / customer change-of-entity notifications issued; Shop & Estd / Trade License / Udyam re-registered or amended under the Pvt Ltd name; existing contracts assigned / novated; firm formally wound down; TM-P trademark assignment + 12-month compliance package activated.",
  },
];

const PtpvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Converting Partnership Firm to a Pvt Ltd
      </h2>
      <p className="opcelg-subheading">
        Eight steps anchored to the URC-1 + URC-2 statutory waiting period. End-to-end timeline: 35–50 working days for clean cases (URC-2 publication + 21-day objection window + URC-1 filing + ROC scrutiny + CoI). Migration items (GST, bank, licenses) run in parallel where possible.
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

export default PtpvtElegibility;
