import React from "react";
import "./IncorporationProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Provision of requisite documents/information to us (As per the checklist to be provided by us)",
  },
  {
    title: "Step 2 – Company Name & Object Finalization",
    text:
      "Finalisation of Objects along with Name of the proposed company (Name shall be finalised on the basis of a search report duly conducted & provided by our team)",
  },
  {
    title: "Step 3 – Name Reservation Application",
    text:
      "Filing of Application for Name Reservation in requisite e-form along with applicable government fees",
  },
  {
    title: "Step 4 – Digital Signature Certificates",
    text:
      "Preparation of requisite numbers of DSC with respect to the proposed Promoters & Directors and Registration of DSC in MCA Portal",
  },
  {
    title: "Step 5 – Incorporation Document Preparation",
    text:
      "Preparation of further incorporation documents upon receipt of name approval letter from the department",
  },
  {
    title: "Step 6 – Final Form Upload & Fee Payment",
    text:
      "Uploading of Final Incorporation Forms to the MCA portal along with applicable government fees",
  },
  {
    title: "Step 7 – Registration Certificate Issuance",
    text:
      "Processing of the application by the department and issuance of registration certificate",
  },
];

const IncorporationProcess = () => {
  return (
    <section className="incorp-process-section">
      <h2 className="incorp-process-title">
        Steps For Incorporation of Wholly Owned Subsidiary in India
      </h2>

      <p className="incorp-process-subtitle">
        The broad process of registering a Wholly Owned Subsidiary in India involves the following steps:
      </p>

      <div className="incorp-timeline">
        <div className="incorp-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`incorp-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="incorp-timeline-dot">{index + 1}</div>

            <div className="incorp-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncorporationProcess;
