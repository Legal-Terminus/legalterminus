import React from "react";
import "./PublicltdBenifits.css";

const steps = [
  {
    number: "01",
    title: "Discovery & Structuring Call",
    text: "60-min call with our expert to confirm subscribers (7 minimum), directors (3 minimum), state of registered office, authorised + paid-up capital, and primary business activity. We map you to NIC code and pre-screen 4 name options. Day 0.",
  },
  {
    number: "02",
    title: "Document Submission & DSC Procurement",
    text: "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here. Class 3 Digital Signature Certificates issued to all 3 directors and all 7 subscribers via Aadhaar e-KYC. Same-day for resident Indians; 3–5 days for NRIs / foreign nationals (apostille documents required). Day 1–3.",
  },
  {
    number: "03",
    title: "Company Name & Objects Finalisation",
    text: "We run a preliminary name availability check and help you finalise your company name and business objects (what your company will do). The name must comply with MCA naming guidelines and must not conflict with existing registered companies, LLPs, or trademarks.",
  },
  {
    number: "04",
    title: "SPICe+ Part A — Name Reservation",
    text: "Filed with 2 proposed names (in order of preference) through MCA21 V3. CRC reviews under Rule 8 of the Companies (Incorporation) Rules. Approval: 2–3 working days typical. Reserved name valid for 20 days. Day 4–6.",
  },
  {
    number: "05",
    title: "MOA & AOA Drafting",
    text: "Memorandum of Association (object clause + capital + state) and Articles of Association (governance, share transfer, board powers, ESOP enablement) drafted. Two rounds of revision included. Day 4–7.",
  },
  {
    number: "06",
    title: "SPICe+ Part B + AGILE-PRO-S Filing",
    text: "Master incorporation form filed: PAN, TAN, EPFO, ESIC, GSTIN, Professional Tax, Bank Account, Shops & Establishment — all in one shot via INC-32 + INC-33 + INC-34 + INC-35. Day 8.",
  },
  {
    number: "07",
    title: "Stamp Duty Payment",
    text: "State-specific stamp duty paid on MOA + AOA via the integrated SPICe+ workflow. Rates vary by state and authorised capital — paid through online portal, not physical paper anymore. Day 7.",
  },
  {
    number: "08",
    title: "CRC Examination & Clarifications",
    text: "CRC reviews under Rule 12. If a deficiency is raised (e.g., minor MOA wording), we file a re-submission within 24 hours. Day 8–12.",
  },
  {
    number: "09",
    title: "Certificate of Incorporation Issued",
    text: "COI issued by CRC under Section 7(2). PAN and TAN allotted simultaneously. CIN (Corporate Identification Number) generated. Day 10–13.",
  },
  {
    number: "10",
    title: "Post-Incorporation Onboarding",
    text: "We deliver: COI, MOA, AOA stamped copies, PAN, TAN, EPF and ESI. Post-Incorporation Onboarding kit includes: share certificate templates, statutory registers, first board meeting agenda + minutes draft, INC-20A (commencement of business) filing reminder, and a 90-day compliance calendar. Day 13–15.",
  },
];

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Public Limited Company Registration in India
          </h2>
          <p className="req-subtitle">
            PLC isn't just a bigger version of Private Limited. It's a fundamentally different fundraising and credibility instrument. The benefits compound the moment you start raising real capital.
          </p>
        </header>

        <div className="req-grid req-grid--wide">
          {steps.map((step) => (
            <article className="req-card" key={step.number}>
              <div className="req-step-number">{step.number}</div>
              <h3 className="req-card-title">{step.title}</h3>
              <div className="req-card-underline" />
              <p className="req-card-text">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
