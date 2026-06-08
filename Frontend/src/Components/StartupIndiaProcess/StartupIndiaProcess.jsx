import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Eligibility Check & Discovery Call",
    day: "Day 0",
    text: "30-min call to confirm: entity type (Pvt Ltd / LLP / Partnership), date of incorporation, current annual turnover, business activity, and whether the entity has been formed by splitting an existing business. We run a quick innovation-narrative assessment to gauge 80-IAC prospects before you commit.",
  },
  {
    title: "Document Collection",
    day: "Day 1–2",
    text: "We send you a specific checklist: COI / LLP agreement / partnership deed, PAN, GSTIN (if applicable), authorised signatory's Aadhaar + PAN, director/partner details, and a brief description of the innovative product/process/service. No physical documents required — all digital.",
  },
  {
    title: "Innovation Narrative Drafting",
    day: "Day 2–3",
    text: "We draft the 'Nature of Business' and 'How is it innovative' description that DPIIT reviewers read. This is the most critical piece of the application — generic descriptions get rejected or delayed. Our senior team reviews the narrative and aligns it with DPIIT's category classifications.",
  },
  {
    title: "DPIIT Portal Application Filing",
    day: "Day 3–4",
    text: "Application filed on the Startup India portal (startupindia.gov.in) with all required details: entity information, authorised signatory, innovation description, revenue and funding details, and sector/category. Supporting documents uploaded. Application submitted for DPIIT review.",
  },
  {
    title: "DPIIT Review & Query Response",
    day: "Day 5–18",
    text: "DPIIT reviews the application typically within 2–4 weeks. If any clarification or additional document is requested, we respond within 24 hours on your behalf. DPIIT may ask for additional proof of innovation, IP filings, or entity documents.",
  },
  {
    title: "DPIIT Recognition Certificate Issued",
    day: "Day 14–28",
    text: "DPIIT issues the recognition certificate electronically via the Startup India portal. Certificate includes your DPIIT number, entity name, date of recognition, and sector. This certificate is the gateway to all Startup India benefits. We deliver a post-recognition kit with next steps.",
  },
  {
    title: "80-IAC & Angel Tax Filing (Optional)",
    day: "Day 28+",
    text: "If you're on Supreme or Supreme Plus plan, we proceed with the 80-IAC application to the IMB (Inter-Ministerial Board) and Form 2 filing for angel tax exemption. IMB review takes 30-90 days. Angel tax Form 2 processing is typically 2-4 weeks. Both are filed immediately after recognition.",
  },
];

const StartupIndiaProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps to Get Startup India (DPIIT) Recognition
      </h2>
      <p className="pv-gst-subheading">
        Seven steps. 2–4 weeks end-to-end (assuming clean documents and a strong innovation narrative).
      </p>

      <div className="pvtltd-timeline">
        <div className="pvtltd-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`pvtltd-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
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

export default StartupIndiaProcess;
