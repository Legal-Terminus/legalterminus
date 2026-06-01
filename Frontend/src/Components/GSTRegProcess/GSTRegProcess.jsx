import React from "react";
import "./GSTRegProcess.css";

const steps = [
  {
    title: "Document Collection & Verification",
    day: "Day 1",
    text: "Provide PAN, Aadhaar, registration certificate, address proof, and bank statement. Our team validates completeness and flags any mismatches before filing.",
  },
  {
    title: "Application Preparation",
    day: "Day 1–2",
    text: "We prepare the GST REG-01 application — mapping your business activity to the correct HSN/SAC codes, filling principal place of business details, and drafting the authorisation letter.",
  },
  {
    title: "Filing on GST Portal",
    day: "Day 2–3",
    text: "Application submitted on gst.gov.in. On submission, an Application Reference Number (ARN) is generated instantly. ARN is used to track application status.",
  },
  {
    title: "Aadhaar Authentication",
    day: "Day 2–3",
    text: "Aadhaar OTP-based e-KYC for the authorised signatory. This step fast-tracks processing — applications with Aadhaar auth are typically approved within 3 working days.",
  },
  {
    title: "Government Review",
    day: "Day 3–7",
    text: "GST officer reviews the application. If a query is raised (GST REG-03), we respond within 7 working days. Clean applications are approved without queries.",
  },
  {
    title: "GSTIN Certificate Delivery",
    day: "Day 7",
    text: "On approval, GSTIN is issued and the Registration Certificate (GST REG-06) is downloadable from the portal. We deliver it to you as a PDF along with a compliance checklist.",
  },
];

const GSTRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        Steps for GST Registration in India
      </h2>
      <p className="pv-gst-subheading">
        Six steps. 7 working days end-to-end for a clean application with Aadhaar authentication.
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

export default GSTRegProcess;
