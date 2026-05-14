import React from "react";
import "./PvtltdProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Share KYC documents and registered office address proof with us (as per checklist). This is your only job at the start — we handle everything from here.",
  },
  {
    title: "Step 2 – Company Name & Objects Finalisation",
    text:
      "We run a preliminary name availability check and help you finalise your company name and business objects (what your company will do). The name must comply with MCA naming guidelines and must not conflict with existing registered companies, LLPs, or trademarks.",
  },
  {
    title: "Step 3 – Name Reservation (SPICe+ Part A)",
    text:
      "We file for name reservation via SPICe+ Part A, proposing up to 2 names. Once approved, the name is reserved for 20 days within which incorporation must be completed.",
  },
  {
    title: "Step 4 – Digital Signature Certificates (DSC)",
    text:
      "DSCs are obtained for all proposed directors and subscribers from authorised Certifying Authorities (e.g., eMudhra, NeSL). All MCA e-filings must be digitally signed — no physical signatures accepted.",
  },
  {
    title: "Step 5 – DIN for Directors",
    text:
      "Director Identification Numbers (DIN) are applied for via Form DIR-3 or auto-allotted through the SPICe+ form for new incorporations. Each director must have a unique DIN issued by the MCA",
  },
  {
    title: "Step 6 – Filing SPICe+ Part B, e-MOA & e-AOA",
    text:
      "We prepare and file the full SPICe+ integrated form covering: company details, capital, registered office, subscribers, directors, PAN/TAN, GST (if applicable), EPFO, ESIC, and the Memorandum of Association (MOA) and Articles of Association (AOA) in electronic form.",
  },
  {
    title: "Step 7 – Processing & Certificate of Incorporation",
    text:
      "The MCA / Registrar of Companies (RoC) reviews the application. Upon approval, the Certificate of Incorporation (CoI) is issued digitally with the Company Identification Number (CIN), PAN, and TAN. Timeline: typically 7–15 working days from submission of complete documents.",
  },
];

const GSTProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for Private Limited Company Registration in India
      </h2>
      <p className="pv-gst-subheading">
        The registration process is entirely online via the MCA portal (www.mca.gov.in) — no physical visits required. Here's how it flows:
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
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GSTProcess;
