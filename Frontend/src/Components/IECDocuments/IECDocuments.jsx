import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Consultation & Document Checklist",
    day: "Day 0",
    text: "Our expert reviews your entity type (proprietorship / partnership / company) and provides a personalised IEC document checklist. We confirm your PAN, business name, registered address, and bank account details to avoid DGFT rejection on first attempt.",
  },
  {
    title: "Document Collection & Verification",
    day: "Day 1",
    text: "Submit KYC documents: entity PAN, Aadhaar of authorised signatory, business registration proof (COI / Partnership Deed / MSME Udyam), registered office address proof (utility bill ≤ 60 days), and a cancelled cheque / bank certificate. Our team verifies all documents for DGFT compliance before filing.",
  },
  {
    title: "DGFT Portal Registration & Form Filing",
    day: "Day 1–2",
    text: "Create your account on the DGFT portal and file the ANF 2A IEC application form with all required details: entity type, business activity, bank account, directors / partners, and registered office address. DSC-signed where required.",
  },
  {
    title: "Government Fee Payment",
    day: "Day 2",
    text: "Pay the DGFT government fee of ₹500 online via the portal (net banking / debit card / UPI). Receipt is auto-generated. The fee is flat and the same regardless of entity type or business volume.",
  },
  {
    title: "DGFT Examination & Approval",
    day: "Day 2–3",
    text: "DGFT examines your application and supporting documents through the ICEGATE system. For clean applications with correct PAN, matching bank details, and valid address proof, approval is typically granted within 1–2 working days. We handle any DGFT queries or deficiencies within 24 hours.",
  },
  {
    title: "IEC Certificate Issued",
    day: "Day 3",
    text: "Your 10-digit IEC code is issued and downloadable from the DGFT portal as a PDF certificate. Valid for the lifetime of the entity — no renewal required. You can immediately begin importing and exporting goods and services globally with your new IEC.",
  },
];

const IECDocuments = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">Steps for IEC Registration in India</h2>
      <p className="pv-gst-subheading">
        Six steps. 2–3 working days end-to-end (assuming clean documents and correct PAN / bank details).
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
