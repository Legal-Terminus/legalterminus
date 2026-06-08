import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Nature Check",
    day: "Day 0",
    text: "30-min call with our foreign-trade CA to confirm: nature of trade (goods / services / both), entity type (Proprietorship / Partnership / LLP / Pvt Ltd / HUF / Trust), products / services to be exported / imported, target markets, existing PAN / GSTIN status, bank account where foreign proceeds will land.",
  },
  {
    title: "PAN-Aadhaar Linkage Verification",
    day: "Day 0–1",
    text: "Confirm authorised signatory's PAN-Aadhaar linkage status (post-30 June 2023, unlinked PANs are inoperative and IEC application fails). If not linked, we fix it before filing - takes 1-2 days.",
  },
  {
    title: "DSC Procurement (if not available)",
    day: "Day 1",
    text: "Class 3 Digital Signature Certificate for the authorised signatory (mandatory for entities; optional for proprietorship using Aadhaar OTP). Same-day issuance via Aadhaar e-KYC.",
  },
  {
    title: "DGFT Portal Registration",
    day: "Day 1",
    text: "Create / log in to dgft.gov.in user account using PAN. Email + mobile OTP verification.",
  },
  {
    title: "Form ANF 2A Filing",
    day: "Day 1–2",
    text: "Application form filed with entity details, signatory details, business activity, address, bank details. Documents uploaded (PAN, Aadhaar, address proof, bank proof, photograph). DSC / Aadhaar OTP signature.",
  },
  {
    title: "Govt Fee Payment (Rs.500)",
    day: "Day 2",
    text: "DGFT fee of Rs.500 paid online via net banking / debit card / UPI. Receipt auto-generated and attached to application.",
  },
  {
    title: "IEC Issuance",
    day: "Day 2–3",
    text: "DGFT system auto-processes the application. IEC number generated and IEC certificate (PDF) issued to the applicant's email - typically within 1-2 working days.",
  },
  {
    title: "AD Code Setup + Onboarding Kit",
    day: "Day 5–10",
    text: "(Enriched / Supreme) AD Code registration with your bank linking it to your IEC on ICEGATE customs portal. We deliver onboarding kit: IEC certificate, AD Code letter, annual update calendar reminder (April-June), FIRC / BRC banking checklist.",
  },
];

const IECDocuments = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">Steps for IEC Registration in India</h2>
      <p className="pv-gst-subheading">
        Eight steps. 1-3 working days end-to-end from kick-off to IEC certificate in your inbox.
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

export default IECDocuments;
