import React from "react";
import "./ShopRegProcess.css";

const steps = [
  {
    title: "Expert Consultation & Document Checklist",
    day: "Day 0",
    text: "Brief call with our expert to understand your establishment type, state, number of employees, and premises details. We share a customised document checklist specific to your state's Shop & Establishment Act.",
  },
  {
    title: "Document Collection & Verification",
    day: "Day 1",
    text: "Submit your documents as per the checklist — identity proof (PAN + Aadhaar) of proprietor/partners/directors, address proof of the premises (rent agreement + electricity bill), photograph of the signboard, and number of employees.",
  },
  {
    title: "Preparation of Application",
    day: "Day 1–2",
    text: "Our team prepares the registration application form as per the applicable state rules. We verify all details — establishment name, address, nature of business, working hours, and employee count — before filing.",
  },
  {
    title: "Filing of Application with Local Authority",
    day: "Day 2–3",
    text: "The application is filed online (or in person at the local labour office / municipal body, as applicable for your state). For states with online portals, we handle the submission directly.",
  },
  {
    title: "Payment of Government Fee",
    day: "Day 2–3",
    text: "Government fees are paid online at actuals as per the state fee schedule (typically based on employee count). In Odisha the fee is capped at approximately ₹600 per branch per year.",
  },
  {
    title: "Verification by Authorities",
    day: "Day 3–7",
    text: "The local authority (labour inspector / municipal office) verifies the application and documents. In most online-portal states, this process is automated; in others, a physical inspection may be required.",
  },
  {
    title: "Registration Certificate Issued",
    day: "Day 7–8",
    text: "The Registration Certificate is issued by the competent authority and delivered to you digitally. This certificate must be displayed prominently at the business premises at all times.",
  },
];

const ShopRegProcess = () => {
  return (
    <section className="shopreg-gst-wrapper">
      <h2 className="shopreg-gst-heading">
        Steps for Shop &amp; Establishment Registration in India
      </h2>
      <p className="shopreg-gst-subheading">
        Seven steps. 7–8 working days end-to-end (assuming clean documents and online portal availability in your state).
      </p>

      <div className="shopreg-timeline">
        <div className="shopreg-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`shopreg-timeline-item ${index % 2 === 0 ? "left" : "right"} ${index === 0 ? "first" : ""} ${index === steps.length - 1 ? "last" : ""}`}
          >
            <div className="shopreg-timeline-dot">{index + 1}</div>
            <div className="shopreg-timeline-card">
              <h4>
                {step.title}
                {step.day && <span className="shopreg-day-tag">{step.day}</span>}
              </h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopRegProcess;
