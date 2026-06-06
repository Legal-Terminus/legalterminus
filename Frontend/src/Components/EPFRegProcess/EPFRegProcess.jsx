import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Trigger Check",
    day: "Day 0",
    text: "30-min call with our payroll-expert to confirm: current headcount, projected 12-month hiring, entity type (Pvt Ltd / LLP / Partnership / Proprietorship / Trust / Society), industry (to check Section 1(3)(b) notification), wage structure (basic vs gross), and existing GSTIN / PAN.",
  },
  {
    title: "Documents & Checklist Collection",
    day: "Day 1",
    text: "Entity PAN, COI / Partnership Deed / GST Certificate, address proof of establishment, cancelled cheque, authorised signatory's Aadhaar + PAN + photo + appointment letter. For ESIC bundle: same set.",
  },
  {
    title: "Documents Collection",
    day: "Day 1–2",
    text: "Entity PAN, COI / Partnership Deed / GST Certificate, address proof of establishment, cancelled cheque, authorised signatory's Aadhaar + PAN + photo + appointment letter. For ESIC bundle: same set.",
  },
  {
    title: "Form Filing Online",
    day: "Day 3",
    text: "Application filed on epfindia.gov.in. Establishment details, employer details, employee count, wage structure, contribution start date. DSC-signed submission.",
  },
  {
    title: "Establishment Code Allotment",
    day: "Day 3–5",
    text: "EPFO regional office reviews the application. Establishment Code (Employer ID) allotted — typically 7-character alphanumeric (XX/XX/0000000). Issued in 3–5 working days.",
  },
  {
    title: "e-Sign Activation and Form 5A Filing",
    day: "Day 5–6",
    text: "Application filing for add DSC or e-sign along with the submission of Form 5A with relevant documents.",
  },
  {
    title: "UAN Activation for Employees",
    day: "Day 7–10",
    text: "For each employee, we either activate an existing UAN (Universal Account Number) or generate a fresh UAN. KYC linkage — Aadhaar, PAN, bank account — verified for each employee.",
  },
  {
    title: "ECR Setup + Salary Structure Validation",
    day: "Day 7–10",
    text: "We help configure your payroll system for monthly ECR generation. Validate basic + DA + HRA + allowances split (only basic + DA attracts EPF).",
  },
];

const EPFRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        EPF Registration Process for Employers
      </h2>
      <p className="pv-gst-subheading">
        Eight steps. 7–10 working days end-to-end for EPF.
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

export default EPFRegProcess;
