import React from "react";
import "./SocietyProcess.css";

const steps = [
  {
    title: "Discovery & Object Lock",
    day: "Day 0",
    text: "60-min call with our professionals to confirm: Society purpose (charitable / educational / cultural / sports / professional / scientific), state of registered office, 7 founding members, proposed Office Bearers (President / Secretary / Treasurer), initial activities.",
  },
  {
    title: "Members & Office Bearers Identification",
    day: "Day 0–2",
    text: "Identify 7 founding members. Check state-specific eligibility (e.g., different families requirement in AP / Telangana). Designate Founder Office Bearers. Aadhaar + PAN + photo + address proof collected from each.",
  },
  {
    title: "Name, Objects Finalization and MoA Drafting",
    day: "Day 2–5",
    text: "Name, registered office, object clause (precisely drafted - the foundation of 12A approval if pursued later), list of founding members with occupation + signatures. Two rounds of revision.",
  },
  {
    title: "Rules & Regulations Drafting",
    day: "Day 4–8",
    text: "Governance constitution: admission of members, removal of members, election of Office Bearers, General Body meetings, Executive Committee meetings, quorum, voting, financial powers, annual reports, dissolution clause.",
  },
  {
    title: "Affidavits + Declarations",
    day: "Day 6–9",
    text: "Founder President's affidavit on stamp paper certifying compliance with the Act. Affidavits from members confirming participation. NoC from registered office property owner.",
  },
  {
    title: "Stamp Paper + Notarisation",
    day: "Day 9–11",
    text: "MoA + Rules printed on appropriate stamp paper (state-specific rates). All 7 members + Office Bearers sign before a Notary. Witnesses sign.",
  },
  {
    title: "Registrar of Societies Filing",
    day: "Day 11–13",
    text: "Application + MoA + Rules + affidavits + NoC + address proof + members' KYC submitted to the District / State Registrar of Societies. Registration fee paid.",
  },
  {
    title: "Registration Certificate Issuance",
    day: "Day 13–18",
    text: "Registrar reviews + issues Registration Certificate (with Society Registration Number). Typically 5-7 working days for clean applications. Society now has legal existence.",
  },
  {
    title: "Society PAN + Bank Account",
    day: "Day 16–22",
    text: "Society PAN applied via NSDL using the Registration Certificate. PAN issued in 7-10 days. Bank account opened documents coordination in Society's name.",
  },
  {
    title: "Udyam + GST (Enriched / Supreme) + Onboarding Kit",
    day: "Day 18–25",
    text: "Enriched: Udyam Registration on udyamregistration.gov.in (1-2 days, same-day issuance typical). Supreme: also GST Registration in 1 state (3-7 days). We deliver onboarding kit: Registration Certificate + PAN + Udyam + GSTIN + 90-day calendar.",
  },
];

const SocietyProcess = () => {
  return (
    <section className="society-process-section">
      <div className="society-process-wrapper">
        <h2 className="society-process-title">
          Steps for Society Registration in India
        </h2>

        <p className="society-process-subtitle">
          Ten steps. 15-22 working days for Society Registration. Udyam (Enriched) adds 1-2 days. GST (Supreme) adds 3-7 days.
        </p>

        <div className="society-timeline">
          <div className="society-timeline-line" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`society-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="society-timeline-dot">{index + 1}</div>

              <div className="society-timeline-card">
                <h4>
                  {step.title}
                  {step.day && <span className="society-day-tag">{step.day}</span>}
                </h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocietyProcess;
