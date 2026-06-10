import React from "react";
import "./TradeLicenseElegibility.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Submission of required documents and details to our team as per the checklist provided for Trade License registration.",
  },
  {
    title: "Step 2 – Application Preparation",
    text:
      "Preparation of your trade license application along with necessary attachments based on the business type and municipal zone.",
  },
  {
    title: "Step 3 – Fee Payment & Verification",
    text:
      "Payment of applicable government or municipal fees followed by internal verification of the application and documents.",
  },
  {
    title: "Step 4 – Site Inspection (If Required)",
    text:
      "In some cases, a physical site inspection may be conducted by municipal officials to verify business premises and operations.",
  },
  {
    title: "Step 5 – Departmental Review",
    text:
      "Your application is reviewed by the municipal authority for compliance with safety, health, and environmental guidelines.",
  },
  {
    title: "Step 6 – License Approval",
    text:
      "Once approved, your trade license number is generated and issued electronically by the respective local authority.",
  },
  {
    title: "Step 7 – Certificate Issuance",
    text:
      "You receive your official Trade License certificate — legally permitting your business operations within the specified jurisdiction.",
  },
];

const TradeLicenseElegibility = () => {
  return (
    <section className="tradeelg-wrapper">
      <h2 className="tradeelg-heading">
        STEPS FOR TRADE LICENSE REGISTRATION IN INDIA
      </h2>
      <p className="tradeelg-subheading">
        The broad process of obtaining a Trade License involves the
        following key steps:
      </p>

      <div className="tradeelg-timeline">
        <div className="tradeelg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`tradeelg-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="tradeelg-timeline-dot">{index + 1}</div>

            <div className="tradeelg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="tradeelg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TradeLicenseElegibility;
