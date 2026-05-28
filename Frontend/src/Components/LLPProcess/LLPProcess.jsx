import React from "react";
import "./LLPProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Provision of requisite documents/information to us (As per the checklist to be provided by us)",
  },
  {
    title: "Step 2 – LLP Name & Objects Finalization",
    text:
      "Finalisation of Objects along with Name of the proposed LLP (Name shall be finalised on the basis of a search report duly conducted & provided by our team)",
  },
  {
    title: "Step 3 – Name Reservation Application",
    text:
      "Filing of application for name reservation in requisite e-form along with applicable government fees.",
  },
  {
    title: "Step 4 – Digital Signature Certificates",
    text:
      "Preparation of requisite numbers of DSC with respect to the proposed Designated Partners/ Partners and Registration of DSC in MCA Portal",
  },
  {
    title: "Step 5 – Incorporation Document Preparation",
    text:
      "Preparation of further incorporation documents upon receipt of name approval letter from the department",
  },
  {
    title: "Step 6 – Form Upload and Fee Payment",
    text:
      "Uploading of Final Incorporation Forms to the MCA portal along with applicable government fees",
  },
  {
    title: "Step 7 – Registration Certificate Issuance",
    text:
      "Processing of the application by the department and issuance of the registration certificate",
  },
  {
    title: "Step 8 – LLP Agreement Preparation",
    text:
      "Preparation, Execution & Notarisation of LLP agreement",
  },
  {
    title: "Step 9 – LLP Agreement Filing",
    text:
      "Filing of LLP Agreement in requisite e-form within a period of 30 days of the incorporation of the LLP along with requisite Government Fees",
  },
];

const LLPProcess = () => {
  return (
    <section className="llpproc-wrapper">
      <h2 className="llpproc-heading">
        Steps For Limited Liability Partnership Registration In India
      </h2>
      <p className="llpproc-subheading">
        The broad process of registering an LLP involves the following steps:
      </p>

      <div className="llpproc-timeline">
        <div className="llpproc-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`llpproc-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } ${index === 0 ? "first" : ""} ${
              index === steps.length - 1 ? "last" : ""
            }`}
          >
            <div className="llpproc-timeline-dot">{index + 1}</div>

            <div className="llpproc-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LLPProcess;
