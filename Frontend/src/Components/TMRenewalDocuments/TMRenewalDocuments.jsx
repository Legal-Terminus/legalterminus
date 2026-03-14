import React from "react";
import "./TMRenewalDocuments.css";

const steps = [
  {
    id: "01",
    title: "KYC Documents",
    desc: "KYC documents of all proposed directors and shareholders such as PAN, Aadhaar, address proof (telephone/mobile bill) and savings bank statement.",
    position: "left",
    color: "teal",
  },
  {
    id: "02",
    title: "Passport Size Photograph",
    desc: "Passport size photograph of all proposed directors and shareholders.",
    position: "left",
    color: "blue",
  },
  {
    id: "03",
    title: "Electricity Bill",
    desc: "Electricity bill corresponding to the registered office address of the company.",
    position: "left",
    color: "navy",
  },
  {
    id: "04",
    title: "Rent Agreement",
    desc: "Duly notarised rent agreement for the registered office address (if the premises are rented).",
    position: "right",
    color: "red",
  },
  {
    id: "05",
    title: "No Objection Certificate",
    desc: "No Objection Certificate (NOC) from the owner allowing the use of premises as the registered office.",
    position: "right",
    color: "pink",
  },
  {
    id: "06",
    title: "Other Documents",
    desc: "Any other documents required will be prepared and provided by our team as per compliance needs.",
    position: "right",
    color: "orange",
  },
];

const TMRenewalDocuments = () => {
  return (
    <section className="TMRenew-Doc-infographic-section">
      <div className="TMRenew-Doc-infographic-wrapper">
        {/* Left Steps */}
        <div className="TMRenew-Doc-infographic-steps-column">
          {steps
            .filter((s) => s.position === "left")
            .map((step) => (
              <div key={step.id} className={`step-card ${step.color}`}>
                <div className="TMRenew-Doc-infographic-step--number">{step.id}</div>
                <div className="TMRenew-Doc-infographic-step--content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Center */}
        <div className="center-circle">
          <h2>Documents<br />Required</h2>
        </div>

        {/* Right Steps */}
        <div className="TMRenew-Doc-infographic-steps-column">
          {steps
            .filter((s) => s.position === "right")
            .map((step) => (
              <div key={step.id} className={`step-card ${step.color}`}>
                <div className="TMRenew-Doc-infographic-step--number">{step.id}</div>
                <div className="TMRenew-Doc-infographic-step--content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TMRenewalDocuments;
