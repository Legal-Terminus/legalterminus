import React from "react";
import "./Section8Process.css";

const steps = [
  {
    title: "Discovery & Object Lock",
    day: "Day 0",
    text: "30-min call with our expert to confirm: charitable object (education / health / environment / sports / arts / social welfare), business plan, geographies of operation, member structure, and post-incorporation compliance roadmap (12A / 80G / CSR-1 / Darpan / FCRA).",
  },
  {
    title: "Document Submission & DSC Procurement",
    day: "Day 1–3",
    text: "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificates issued to all directors and subscribers via Aadhaar e-KYC. Same-day for resident Indians; 3–5 days for NRIs / foreign nationals (apostille documents required).",
  },
  {
    title: "Company Name & Objects Finalization",
    day: "Day 3–5",
    text: "We run a preliminary name availability check and help you finalize your company name and business objects (what your company will do). The name must comply with MCA naming guidelines and must not conflict with existing registered companies, LLPs, or trademarks.",
  },
  {
    title: "SPICe+ Part A — Name Reservation",
    day: "Day 3–5",
    text: "Filed with 2 proposed names reflecting the charitable object (e.g., 'Foundation', 'Sansthan', 'Trust', 'Council'). 'Private Limited' / 'Limited' suffix is OPTIONAL for Section 8 companies under Rule 8(7). CRC reviews under Rule 8.",
  },
  {
    title: "MOA + AOA + INC-13 / 14 / 15 Drafting",
    day: "Day 5–10",
    text: "MOA (object clause + capital + state) and AOA (governance, no-dividend clause, application of income) drafted. INC-13 (declaration by promoters), INC-14 (CA / CS declaration), INC-15 (subscriber declaration) drafted.",
  },
  {
    title: "SPICe+ Part B + AGILE-PRO-S Filing",
    day: "Day 15–20",
    text: "Master incorporation form filed with the Section 8 licence attached: PAN, TAN, EPFO, ESIC (where applicable), Bank Account. Stamp duty paid online.",
  },
  {
    title: "CRC Examination & COI + Section 8 Licence Issuance",
    day: "Day 20–23",
    text: "CRC reviews under Rule 12. Section 8 Licence issued, COI issued under Section 7(2). PAN, TAN, CIN allotted. CIN format reflects 'NPL' (non-profit limited) classification.",
  },
  {
    title: "Post-Incorporation Onboarding",
    day: "Day 25",
    text: "We deliver: COI PDF, Section 8 Licence, MOA/AOA stamped copies, share certificate templates, statutory registers, first board meeting agenda + minutes, INC-20A (commencement) reminder, DIR-3 KYC reminder, and a 90-day compliance calendar.",
  },
];

const Section8Process = () => {
  return (
    <section className="s8-process-section">
      <h2 className="s8-process-heading">
        Steps for Section 8 Company Registration in India
      </h2>
      <p className="s8-process-subheading">
        Ten steps. 20–25 working days end-to-end (Section 8 is slower than commercial Pvt Ltd because of the additional Central-Government licence layer).
      </p>

      <div className="s8-proc-timeline">
        <div className="s8-proc-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`s8-proc-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="s8-proc-timeline-dot">{index + 1}</div>

            <div className="s8-proc-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="s8-proc-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section8Process;
