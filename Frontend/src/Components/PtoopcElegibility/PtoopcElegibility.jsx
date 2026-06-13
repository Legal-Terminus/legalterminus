import React from "react";
import "./PtoopcElegibility.css";

const steps = [
  {
    title: "Eligibility Check & DSC / DIN",
    day: "Step 1",
    text: "We confirm you qualify to form an OPC — an Indian citizen and resident — and identify a nominee. We then obtain the Digital Signature Certificate (DSC) and Director Identification Number (DIN) for you as the sole director and member.",
  },
  {
    title: "Name Reservation (SPICe+ Part A)",
    day: "Step 2",
    text: "We check name availability against the MCA and trademark databases and reserve the OPC's name through SPICe+ Part A. The name must end with '(OPC) Private Limited' and comply with the naming guidelines.",
  },
  {
    title: "Drafting MOA, AOA & Nominee Consent",
    day: "Step 3",
    text: "We draft the company's Memorandum and Articles of Association reflecting your business objects, and prepare the nominee's consent in Form INC-3 along with their KYC. The registered office address proof and declarations are compiled.",
  },
  {
    title: "SPICe+ Incorporation Filing",
    day: "Step 4",
    text: "The SPICe+ Part B form is filed with the ROC along with MOA, AOA, INC-3, and address proof. On approval, the OPC receives its Certificate of Incorporation, CIN, PAN, and TAN — the new company is born.",
  },
  {
    title: "Business Takeover Agreement",
    day: "Step 5",
    text: "We draft and execute a takeover/transfer agreement under which the proprietorship's business — assets, liabilities, and contracts — is transferred to the OPC. This is the step that actually moves your business into the new company.",
  },
  {
    title: "Migrate Registrations & Wind Down",
    day: "Step 6",
    text: "We register the OPC for GST, open its bank account, and migrate Udyam, IEC, and licences to the company's name — then surrender the old proprietorship registrations and set up the OPC's first-year compliance calendar.",
  },
];

const PtoopcElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Proprietorship to OPC Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility check to a fully operational OPC — incorporation and business takeover handled together.
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

export default PtoopcElegibility;
