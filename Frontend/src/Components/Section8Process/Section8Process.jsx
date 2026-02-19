import React from "react";
import "./Section8Process.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Provision of requisite documents/information to us (As per the checklist to be provided by us)",
  },
  {
    title: "Step 2 – Company Name & Objects Finalization",
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
    title: "Step 6 – Final Form Upload and Fee Payment",
    text:
      "Uploading of Final Incorporation Forms to the MCA portal along with applicable government fees",
  },
  {
    title: "Step 7 – Registration Certificate Issuance",
    text:
      "Processing of the application by the department and issuance of registration certificate",
  },
];

const Section8Process = () => {
  return (
    <section className="s8-process-section">
      <h2 className="s8-process-title">
        Steps for Section 8 Company Registration in India
      </h2>

      <p className="s8-process-subtitle">
        The broad process of registering a Sec 8 Company involves following steps:
      </p>

      <div className="s8-timeline">
        <div className="s8-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`s8-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="s8-timeline-dot">{index + 1}</div>

            <div className="s8-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section8Process;
