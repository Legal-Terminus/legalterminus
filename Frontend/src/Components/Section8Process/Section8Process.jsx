import React from "react";
import "./Section8Process.css";

const steps = [
  {
    title: "Document Collection & Discovery Call",
    day: "Day 0",
    text: "60-minute call with our CS to confirm directors (min 2), shareholders (min 2), state of registered office, nature of charitable object, and proposed name options. We send the personalised document checklist immediately after.",
  },
  {
    title: "DSC Procurement for Directors & Subscribers",
    day: "Day 0–2",
    text: "Class 3 Digital Signature Certificates issued to all proposed directors and subscribers via Aadhaar e-KYC. Same-day for resident Indians; 3–5 days for NRIs / foreign nationals (apostille documents required).",
  },
  {
    title: "Name Reservation – RUN / INC-1 Filing",
    day: "Day 2–5",
    text: "Application filed on MCA21 V3 with proposed name(s). Names for Section 8 companies may include 'Foundation', 'Association', 'Council', or similar non-profit identifiers. We pre-screen for trademark conflicts and existing registrations before filing.",
  },
  {
    title: "MOA & AOA Drafting + Object Clause Review",
    day: "Day 5–8",
    text: "Memorandum of Association drafted with a strictly charitable object clause — any commercial-leaning language triggers RoC rejection. Articles of Association drafted for governance, board composition, and meeting procedures. Two revision rounds included.",
  },
  {
    title: "SPICe+ Part B + INC-12 Filing",
    day: "Day 8–12",
    text: "Main incorporation form filed: INC-12 (application for Section 8 licence), SPICe+ Part B (director DINs, office address, PAN/TAN), INC-33 (MOA), INC-34 (AOA). Stamp duty paid online. EPFO and ESIC registration also covered.",
  },
  {
    title: "Regional Director / RoC Examination",
    day: "Day 12–20",
    text: "The application is reviewed by the Regional Director (RD) under the Ministry of Corporate Affairs. The RD examines the charitable object, board composition, and compliance with Section 8 requirements. If a clarification is raised, we respond within 24 hours.",
  },
  {
    title: "Licence Grant & Certificate of Incorporation",
    day: "Day 20–25",
    text: "On approval, the RD issues the Section 8 licence under INC-16 / INC-17. The COI is then issued with the CIN. PAN and TAN allotted simultaneously. The company is now legally incorporated and can commence operations, apply for 12A/80G, and open a bank account.",
  },
];

const Section8Process = () => {
  return (
    <section className="s8-process-section">
      <h2 className="s8-process-heading">
        Steps for Section 8 Company Registration in India
      </h2>
      <p className="s8-process-subheading">
        Seven steps. 20–25 working days end-to-end (assuming clean documents and a charitable object clause that clears RoC on first review).
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
