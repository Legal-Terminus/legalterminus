import React from "react";
import "./OPCElegibility.css";

const steps = [
  {
    title: "Discovery & Eligibility Check",
    day: "Day 0",
    text: "30-min call with our expert to confirm: Indian citizenship of the sole member, 120-day stay test, eligibility of the nominee, business activity (to flag restricted activities like NBFI), authorised capital, and registered office state.",
  },
  {
    title: "Document Submission & DSC Procurement",
    day: "Day 1–2",
    text: "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificate issued to the sole director and the nominee. Same-day for resident Indians via Aadhaar e-KYC; 3–5 days for NRIs (apostille required).",
  },
  {
    title: "SPICe+ Part A — Name Reservation",
    day: "Day 2–4",
    text: "Filed with 2 proposed names (in order of preference) ending with '(OPC) Private Limited' through MCA21 V3. CRC reviews under Rule 8. Approval: 2–3 working days typical. Reserved name valid for 20 days.",
  },
  {
    title: "MOA & AOA Drafting",
    day: "Day 3–5",
    text: "Memorandum of Association (object clause + capital + state) and Articles of Association (governance, share transfer, conversion-readiness clauses) drafted. One round of revision included.",
  },
  {
    title: "Nominee Consent (Form INC-3)",
    day: "Day 4–5",
    text: "Nominee signs INC-3 declaring willingness to act as nominee on the member's death / incapacity. We draft, get it signed, and file PAN + Aadhaar + address proof of nominee.",
  },
  {
    title: "SPICe+ Part B + AGILE-PRO-S Filing",
    day: "Day 5–6",
    text: "Master incorporation form filed: PAN, TAN, EPFO, ESIC, GSTIN (optional), Professional Tax, Bank Account, Shops & Establishment — all in one shot via INC-32 + INC-33 + INC-34 + INC-35. Stamp duty paid online.",
  },
  {
    title: "CRC Examination & Clarifications",
    day: "Day 6–9",
    text: "CRC reviews under Rule 12. If a deficiency is raised (e.g., minor MOA wording or nominee KYC), we file a re-submission within 24 hours.",
  },
  {
    title: "Certificate of Incorporation & Onboarding",
    day: "Day 7–10",
    text: "COI issued by CRC under Section 7(2). PAN, TAN, and CIN allotted. We deliver: COI PDF, MOA/AOA, share certificate template, statutory registers, INC-20A (commencement of business) reminder, and a 90-day compliance calendar.",
  },
];

const OPCElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps For One Person Company Registration in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. 7–10 working days end-to-end (assuming clean documents, an eligible nominee, and a name that clears CRC on first try).
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
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

export default OPCElegibility;
