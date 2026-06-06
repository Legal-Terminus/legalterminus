import React from "react";
import "./IncorporationProcess.css";

const steps = [
  {
    title: "Discovery & Parent-Type Lock",
    day: "Day 0",
    text: "60-min call with our CS to confirm: parent type (Indian / foreign), parent's existing structure, intended business activity (NIC code), authorised + paid-up capital, and (for foreign parents) sectoral FDI route + jurisdiction.",
  },
  {
    title: "Parent KYC Pack Collection",
    day: "Day 0–3",
    text: "Indian-parent: parent's PAN, COI, MOA/AOA, latest financials, Board Resolution authorising investment + nominating director(s). Foreign-parent: same set apostilled / notarised, plus UBO declaration and AD-Bank reference letter.",
  },
  {
    title: "Apostille / Notarisation (Foreign Parent Only)",
    day: "Day 1–10",
    text: "Parent documents apostilled in home jurisdiction (Hague Convention) or notarised + Indian embassy attested (non-Hague). Run in parallel with name reservation. SKIPPED for Indian-parent WOS.",
  },
  {
    title: "DSC + DIN Procurement",
    day: "Day 3–7",
    text: "Class 3 DSC for 2 directors + 1 nominee shareholder. Aadhaar e-KYC (resident) or apostilled passport (non-resident). DIN auto-applied via SPICe+ for first 2 directors.",
  },
  {
    title: "SPICe+ Part A — Name Reservation",
    day: "Day 5–8",
    text: "Filed with 4 proposed names. CRC reviews under Rule 8. 2–3 working days. Reserved name valid for 20 days.",
  },
  {
    title: "MOA & AOA Drafting (Track-Specific)",
    day: "Day 6–10",
    text: "Indian-parent: MOA + AOA with parent reserved matters, RPT framework, transfer restrictions. Foreign-parent: same plus FEMA carve-outs and FDI compliance clauses. Two rounds of revision.",
  },
  {
    title: "SPICe+ Part B + AGILE-PRO-S Filing",
    day: "Day 8–14",
    text: "Master incorporation form filed: PAN, TAN, EPFO, ESIC, GSTIN, Bank Account. Stamp duty paid online. Indian-parent: Day 8–14. Foreign-parent: Day 12–14.",
  },
  {
    title: "CRC Examination & COI Issuance",
    day: "Day 10–22",
    text: "CRC reviews under Rule 12. Indian-parent files: 3–7 days. Foreign-parent files take longer due to foreign-document scrutiny: 5–10 days. COI issued under Section 7(2). PAN, TAN, CIN allotted.",
  },
  {
    title: "Post-Incorporation Onboarding",
    day: "Day 13–30",
    text: "We deliver: COI PDF, MOA/AOA stamped, share certificates, PAS-3 / FC-GPR ack (track-specific), statutory registers, INC-20A reminder, FLA-tracker (foreign only), 90-day compliance calendar.",
  },
];

const IncorporationProcess = () => {
  return (
    <section className="incorp-process-section">
      <h2 className="incorp-process-title">
        Steps For Incorporation of Wholly Owned Subsidiary in India
      </h2>

      <p className="incorp-process-subtitle">
        Indian-parent WOS: 10–15 working days. Foreign-parent WOS: 20–30 working days (apostille is the longest critical-path item). Both run on the same SPICe+ framework — only the documentation pack and post-step FEMA filing differ.
      </p>

      <div className="incorp-timeline">
        <div className="incorp-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`incorp-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="incorp-timeline-dot">{index + 1}</div>

            <div className="incorp-timeline-card">
              <h4>
                {step.title}
                {step.day && (
                  <span className="incorp-day-tag">{step.day}</span>
                )}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncorporationProcess;
