import React from "react";
import "./FoodLicenseElegibility.css";

const steps = [
  {
    title: "Discovery & License Type Confirmation",
    day: "Day 0",
    text: "30-min call to confirm: your annual turnover, business type (manufacturer, trader, restaurant, etc.), whether you need Basic Registration, State License, or Central License, and whether an inspection is likely. We also check if any prior FSSAI registration exists that needs migration or renewal.",
  },
  {
    title: "Document Collection",
    day: "Day 1",
    text: "We share an FSSAI-specific document checklist. You submit: business owner KYC (PAN + Aadhaar), business registration certificate, office/premise address proof, food product list, and premise photos (for State/Central). This is your only task — we handle the rest.",
  },
  {
    title: "Application Preparation & FBO Category Mapping",
    day: "Day 1–2",
    text: "We prepare your FoSCoS application with the correct FBO category, food product categories, and premise details. Documents are verified against FSSAI requirements. We also draft the Food Safety Management System (FSMS) undertaking if required for State/Central license.",
  },
  {
    title: "FoSCoS Portal Filing & Govt Fee Payment",
    day: "Day 2–3",
    text: "Application filed on the FoSCoS portal (foscos.fssai.gov.in). Government fee paid on your behalf at actuals. Filing acknowledgement and Application Reference Number (ARN) shared with you immediately after submission.",
  },
  {
    title: "FSSAI Review, Inspection & Clarifications",
    day: "Day 3–15",
    text: "For Basic Registration: typically approved in 7–10 days. For State/Central: FSSAI may conduct a physical inspection of premises within 30 days of filing. If a deficiency or inspection query is raised, we respond within 24 hours and prepare you for the inspection visit.",
  },
  {
    title: "License Certificate Issuance & Delivery",
    day: "Day 10–30",
    text: "FSSAI issues your Registration Certificate or License. We deliver: FSSAI certificate (PDF), 14-digit FSSAI number for label printing, compliance calendar (renewal due dates), display notice for your premises, and food safety guidelines for your business category.",
  },
];

const FoodLicenseElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for FSSAI Food License Registration in India
      </h2>
      <p className="opcelg-subheading">
        Six steps. 10–30 working days end-to-end depending on license type and FSSAI inspection schedule.
      </p>

      <div className="opcelg-timeline">
        <div className="opcelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`opcelg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="opcelg-timeline-dot">{index + 1}</div>

            <div className="opcelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="opcelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FoodLicenseElegibility;
