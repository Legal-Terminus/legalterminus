import React from "react";
import "./PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Structuring Call",
    day: "Day 0",
    text: "60-min call with our CS to confirm: directors (min 2), shareholders (min 2), state of registered office, authorised + paid-up capital, primary business activity (NIC code), and tax-regime preference (115BAA vs default). We pre-screen 4 name options.",
  },
  {
    title: "Document Submission & DSC Procurement",
    day: "Day 1–3",
    text: "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificates issued to all 3 directors and all 7 subscribers via Aadhaar e-KYC. Same-day for resident Indians; 3–5 days for NRIs / foreign nationals (apostille documents required).",
  },
  {
    title: "Company Name & Objects Finalization",
    day: null,
    text: "We run a preliminary name availability check and help you finalize your company name and business objects (what your company will do). The name must comply with MCA naming guidelines and must not conflict with existing registered companies, LLPs, or trademarks.",
  },
  {
    title: "SPICe+ Part A — Name Reservation",
    day: "Day 4–6",
    text: "Filed with 4 proposed names (in order of preference) ending with 'Private Limited' through MCA21 V3. CRC reviews under Rule 8 of the Companies (Incorporation) Rules. Approval: 2–3 working days typical. Reserved name valid for 20 days.",
  },
  {
    title: "MOA & AOA Drafting",
    day: "Day 4–7",
    text: "Memorandum of Association (object clause + capital + state) and Articles of Association (governance, share transfer, board powers, ESOP enablement, drag/tag, valuation, founder vesting) drafted. Two rounds of revision included.",
  },
  {
    title: "SPICe+ Part B + AGILE-PRO-S Filing",
    day: "Day 7–8",
    text: "Master incorporation form filed: PAN, TAN, EPFO, ESIC, GSTIN, Professional Tax, Bank Account, Shops & Establishment — all in one shot via INC-32 + INC-33 + INC-34 + INC-35. Stamp duty paid online.",
  },
  {
    title: "CRC Examination & COI Issuance",
    day: "Day 7–10",
    text: "CRC reviews under Rule 12 — typically 3–7 working days for clean applications. If a deficiency is raised, we file a re-submission within 24 hours. COI issued under Section 7(2). PAN, TAN, and CIN allotted simultaneously.",
  },
  {
    title: "Post-Incorporation Onboarding",
    day: "Day 9–10",
    text: "We deliver: COI PDF, MOA/AOA stamped copies, share certificate templates, statutory registers, first board meeting agenda + minutes, INC-20A (commencement) reminder, DIR-3 KYC reminder, and a 90-day compliance calendar.",
  },
  {
    title: "Certificate of Incorporation Issued",
    day: "Day 10–13",
    text: "COI issued by CRC under Section 7(2). PAN and TAN allotted simultaneously. CIN (Corporate Identification Number) generated.",
  },
];

const GSTProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for Private Limited Company Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Nine steps. 7–10 working days end-to-end (assuming clean documents and a name that clears CRC on first try).
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

export default GSTProcess;
