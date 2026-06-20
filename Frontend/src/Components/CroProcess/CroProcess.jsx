import React from "react";
import "../OPCElegibility/OPCElegibility.css";

const steps = [
  {
    title: "Document Submission",
    day: "Step 1",
    text: "Share the basic KYC of all proposed directors and shareholders — self-attested PAN, ID and address proof, photographs — along with the registered-office proof (utility bill, rent agreement, and NOC).",
  },
  {
    title: "Company Name & Objects Finalization",
    day: "Step 2",
    text: "We help you choose a unique, available company name and finalise the business objects (main activities) that will go into the MOA. Up to 4 choice names are shortlisted to improve approval odds.",
  },
  {
    title: "Name Reservation Application",
    day: "Step 3",
    text: "The chosen name is reserved with the MCA through SPICe+ Part A (or RUN). On approval, the name is held for you while the incorporation documents are prepared.",
  },
  {
    title: "Digital Signature Certificates (DSC)",
    day: "Step 4",
    text: "Class 3 Digital Signature Certificates are obtained for the directors. The DSC is mandatory to sign the incorporation e-forms filed on the MCA portal.",
  },
  {
    title: "Incorporation Document Preparation",
    day: "Step 5",
    text: "We draft the MOA and AOA, the SPICe+ (INC-32) form, AGILE-PRO (for GST, EPF, ESI and bank account) and INC-9 declarations, and prepare all supporting attachments for filing.",
  },
  {
    title: "Final Form Upload & Fee Payment",
    day: "Step 6",
    text: "The complete set of forms is uploaded to the MCA portal and the government fees, stamp duty, and PAN/TAN charges are paid. The application then goes to the ROC for review.",
  },
  {
    title: "Registration Certificate Issuance",
    day: "Step 7",
    text: "On approval, the ROC issues the Certificate of Incorporation with the CIN, along with PAN and TAN. Your company is now legally registered — typically within 10 to 15 working days.",
  },
];

const CroProcess = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Company Registration Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Seven steps from document submission to your Certificate of Incorporation — name approval, DSC,
        MOA &amp; AOA, and SPICe+ filing handled together. Completed in around 10 to 15 working days,
        subject to proper documentation.
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

export default CroProcess;
