import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Eligibility Check",
    day: "Day 0",
    text: "30-min call with our startup-expert to confirm: entity type (Pvt Ltd / OPC / LLP / Partnership / Cooperative Society), incorporation date (10-year cap; 20 years for Deep Tech), current + projected turnover (Rs.200 cr cap; Rs.300 cr for Deep Tech), business activity, innovation thesis, sector, IP status, funding history. We pre-screen DPIIT eligibility honestly.",
  },
  {
    title: "Entity Documents Verification",
    day: "Day 1",
    text: "Confirm COI / LLP Agreement / Partnership Deed + PAN + GSTIN + DSC of authorised signatory. Identify gaps (e.g. PAN-Aadhaar non-linkage) that would block filing.",
  },
  {
    title: "Innovation Pitch Reviewing",
    day: "Day 1–3",
    text: "Brief write-up about your business + innovation thesis, scalability mechanism, employment / wealth creation impact, customer validation. This is the soul of the DPIIT application - generic write-ups get rejected. Senior-expert reviewed before filing.",
  },
  {
    title: "Create User Account",
    day: "Day 3",
    text: "Create user account on the NSWS portal (nsws.gov.in). Verify mobile + email. Add entity details. Navigate to 'Add Approvals' → 'Central Approvals' → search 'Registration as a Startup'.",
  },
  {
    title: "DPIIT Recognition Application Filing",
    day: "Day 3–4",
    text: "Application filed with: entity details, founders / directors / partners, business description, innovation write-up, supporting documents (incorporation, business plan, IP, awards, funding).",
  },
  {
    title: "DPIIT Review + Recognition Certificate",
    day: "Day 4–7",
    text: "DPIIT auto-system + manual review processes the application. Recognition Certificate issued in 3-5 working days for clean applications.",
  },
  {
    title: "Recognition Certificate Delivered",
    day: "Day 4–7",
    text: "We download the Start-Up India Recognition Certificate, and share it via email + WhatsApp.",
  },
];

const StartupIndiaProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps For Startup India Registration
      </h2>
      <p className="pv-gst-subheading">
        Ten steps. 3-5 working days for DPIIT recognition itself. Section 80-IAC IMB approval is a separate 3-6 month process that we run in parallel.
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
