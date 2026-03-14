import React from "react";
import "./ChangeLlpProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    text:
      "Provision of requisite documents / information to us (as per the checklist to be provided by us).",
  },
  {
    title: "Step 2 – Company Name & Objects Finalization",
    text:
      "Finalisation of objects along with name of the proposed company (based on a search report duly conducted and provided by our team).",
  },
  {
    title: "Step 3 – Name Reservation Application",
    text:
      "Filing of application for name reservation in requisite e-form along with applicable government fees.",
  },
  {
    title: "Step 4 – Digital Signature Certificates",
    text:
      "Preparation of requisite numbers of DSC with respect to the proposed promoters & directors and registration of DSC in the MCA portal.",
  },
  {
    title: "Step 5 – Incorporation Document Preparation",
    text:
      "Preparation of further incorporation documents upon receipt of the name approval letter from the department.",
  },
  {
    title: "Step 6 – Final Form Upload & Fee Payment",
    text:
      "Uploading of final incorporation forms to the MCA portal along with applicable government fees.",
  },
  {
    title: "Step 7 – Registration Certificate Issuance",
    text:
      "Processing of the application by the department and issuance of the registration certificate.",
  },
];

const ChangeLlpProcess = () => {
  return (
    <section className="Change-llp-Process-wrapper">
      <h2 className="Change-llp-Process-heading">
        STEPS FOR PRIVATE LIMITED COMPANY REGISTRATION IN INDIA
      </h2>
      <p className="Change-llp-Process-gst-subheading">
        The broad process of registering a Private Limited company involves
        the following steps:
      </p>

      <div className="Change-llp-Process-timeline">
        <div className="Change-llp-Process-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`Change-llp-Process-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="Change-llp-Process-timeline-dot">{index + 1}</div>

            <div className="Change-llp-Process-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChangeLlpProcess;
