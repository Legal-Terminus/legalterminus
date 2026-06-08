import React from "react";
import "../PvtltdProcess/PvtltdProcess.css";

const steps = [
  {
    title: "Discovery & Eligibility Check",
    day: "Day 0",
    text: "30-min call to confirm: current headcount, state of operations (10-employee threshold vs 20-employee states), industry category (factories, shops, restaurants, cinemas etc.), wage structure, and any existing EPFO registration (for simultaneous bundle).",
  },
  {
    title: "Documents Collection",
    day: "Day 1",
    text: "Entity PAN, COI / Partnership Deed / GST Certificate, establishment address proof, cancelled cheque, authorised signatory's Aadhaar + PAN + photo. Employee roster with names, DOB, DOJ, wages, and Aadhaar numbers.",
  },
  {
    title: "ESIC Portal Sign-Up & Form-1 Filing",
    day: "Day 2–3",
    text: "Employer account created on the ESIC portal. Employer Registration Form-1 filed with establishment details, unit type, employee count, and wage structure. DSC-signed submission by authorised signatory.",
  },
  {
    title: "Employer Code Allotment",
    day: "Day 3–5",
    text: "ESIC regional office reviews Form-1. 17-digit Employer Code (ESIC Registration Number) allotted and sent via email. Registration Letter C-11 issued — acts as valid proof of ESIC registration.",
  },
  {
    title: "Employee IP Number Generation",
    day: "Day 5–7",
    text: "For each covered employee, an Insurance Number (IP Number) is generated. Employee details — Aadhaar, bank account, nominee — linked to the IP number. ESIC Pehchan cards facilitated for covered employees.",
  },
  {
    title: "First Contribution Challan Walkthrough",
    day: "Day 7–10",
    text: "We walk you through generating and paying the first monthly ESI challan on the portal. Contribution amount calculated as 3.25% (employer) + 0.75% (employee) of each covered employee's gross wages. Due by the 15th of every month.",
  },
];

const ESICRegProcess = () => {
  return (
    <section className="pvtltd-gst-wrapper">
      <h2 className="gst-heading">
        ESIC Registration Process for Employers
      </h2>
      <p className="pv-gst-subheading">
        Six steps. 7–10 working days end-to-end for ESIC.
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

export default ESICRegProcess;
