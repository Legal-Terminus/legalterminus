import React from "react";
import "./LtopvtElegibility.css";

const steps = [
  {
    title: "Discovery & LLP Status + Eligibility Audit",
    day: "Day 0",
    text: "60-min call with our Company Secretary to confirm: LLP active status (Form 11 + Form 8 currency), LLP Agreement terms + supplementary deeds, all partners' identities + DPIN + KYC, business activity + NIC code, registered office, capital contribution + profit-sharing ratio of each partner, partner-to-director / shareholder mapping preferences, audited-accounts readiness, creditor list, current GST / FSSAI / Shop & Estd / Trade License / Udyam / Trademarks, and Section 115BAA + DPIIT eligibility.",
  },
  {
    title: "LLP Compliance Catch-Up (if needed) + Audit",
    day: "Day 1–15",
    text: "If your LLP has pending Form 8 / Form 11 backlogs, we file the catch-up returns (late-fee ₹100/day per form). Concurrent audit of the LLP's books to produce a Statement of Accounts not older than 30 days (separate from the LLP's annual Form 8). Duration depends on the size of the backlog.",
  },
  {
    title: "DSC + DIN + SPICe+ Part A Name Reservation",
    day: "Day 15–17",
    text: "DSC procured for partners without an active DSC (designated partners typically have DPIN-linked DSC). DPIN carries over as DIN; fresh DIN auto-applied via SPICe+ for non-DPIN partners. SPICe+ Part A filed with up to 4 proposed names ending with 'Private Limited'. MCA approval typically within this window.",
  },
  {
    title: "URC-2 Newspaper Advertisement — Publication",
    day: "Day 17–18",
    text: "Form URC-2 drafted in compliant format. Published in TWO newspapers — ONE English + ONE in the principal vernacular language of the State / UT where the LLP's registered office is situated. Notice of conversion + invitation for objections from creditors / members / public. The publication date is Day 0 of the statutory 21-day objection window.",
  },
  {
    title: "21-Day Statutory Objection Window",
    day: "Day 18–39",
    text: "Mandatory 21-day window during which creditors / members / public can object to the conversion. We monitor incoming objections, respond to legitimate concerns, and prepare an objection-handling note for URC-1. Most clean cases pass through without objections.",
  },
  {
    title: "URC-1 Application + Capital Mapping + SPICe+ Part B Filing",
    day: "Day 39–41",
    text: "After the 21-day window closes: Form URC-1 application + SPICe+ Part B + AGILE-PRO-S filed in parallel on the MCA portal. Attachments: URC-2 newspaper cuttings, audited statement, list of partners + capital contribution + profit-sharing ratio (per LLP Agreement), list of creditors with consents, declaration of solvency, affidavits, INC-9 declarations by all partner-directors + subscribers, LLP Agreement + LLPIN, share-allotment schedule (per capital contributions), and MOA + AOA.",
  },
  {
    title: "ROC Scrutiny + CoI Issuance",
    day: "Day 41–53",
    text: "The Registrar of Companies reviews URC-1 + SPICe+ Part B. Any queries / objections (typically: URC-2 cutting clarity, audited statement adequacy, capital allotment proportionality, LLP active-status confirmation) are addressed within 7 days. On approval: Certificate of Incorporation issued under Section 367 + PAN + TAN auto-generated + AGILE-PRO-S registrations activated.",
  },
  {
    title: "LLP Dissolution Intimation + GST Migration + Section 115BAA + DPIIT",
    day: "Day 53–70",
    text: "Post-CoI: the LLP is AUTOMATICALLY DEEMED DISSOLVED on issuance of CoI under Section 367. Within 15 DAYS of CoI, the LLP Dissolution Intimation + documents are filed with the LLP Registrar; LLPIN closure tracked to confirmation (Supreme / Supreme Plus). LLP's GSTIN cancelled via Form REG-16; the Pvt Ltd's GSTIN is already active via AGILE-PRO-S. ITC transferred via Form ITC-02. Supreme Plus: Asset Transfer Agreement signed; vendor / customer notifications issued; Shop & Estd / Trade License / Udyam re-registered or amended under the Pvt Ltd name; TM-P trademark assignment + 12-month compliance package.",
  },
];

const LtopvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Converting LLP to a Pvt Ltd
      </h2>
      <p className="opcelg-subheading">
        Eight steps anchored to the URC-1 + URC-2 statutory waiting period. End-to-end timeline: 35–50 working days for clean cases. LLPs with compliance backlogs add 7–15 days for catch-up filings before URC-1.
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

export default LtopvtElegibility;
