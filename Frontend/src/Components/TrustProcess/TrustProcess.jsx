import React from "react";
import "./TrustProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    day: "Day 1",
    text: "Submission of required documents including PAN, Aadhaar, address proofs of all trustees and settlor.",
  },
  {
    title: "Step 2 – Trust Name & Objects",
    day: "Day 1–2",
    text: "Finalization of the trust name, objects (charitable or private), and identification of settlor and trustees.",
  },
  {
    title: "Step 3 – Trust Deed Drafting",
    day: "Day 2–3",
    text: "Drafting of the Trust Deed on stamp paper specifying the settlor, trustees, beneficiaries, and objectives of the trust.",
  },
  {
    title: "Step 4 – Stamp Paper & Signing",
    day: "Day 3–4",
    text: "Execution of the Trust Deed on appropriate stamp paper, signed by the settlor and trustees in the presence of two witnesses.",
  },
  {
    title: "Step 5 – Registration with Sub-Registrar",
    day: "Day 4–6",
    text: "Filing the Trust Deed with the Sub-Registrar of Assurances along with applicable registration fees and identity proofs.",
  },
  {
    title: "Step 6 – Document Verification",
    day: "Day 6–8",
    text: "Verification of the Trust Deed and supporting documents by the Sub-Registrar's office for completeness and legality.",
  },
  {
    title: "Step 7 – Registered Trust Certificate",
    day: "Day 8–10",
    text: "Issuance of the Registered Trust Deed / Certificate upon successful verification, completing the registration process.",
  },
];

const TrustProcess = () => {
  return (
    <section className="trust-process-section">
      <div className="trust-process-wrapper">
        <h2 className="trust-process-title">
          Steps for Trust Registration in India
        </h2>

        <p className="trust-process-subtitle">
          The complete process of registering a Trust involves the following structured steps:
        </p>

        <div className="trust-timeline">
          <div className="trust-timeline-line" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`trust-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="trust-timeline-dot">{index + 1}</div>

              <div className="trust-timeline-card">
                <h4>
                  {step.title}
                  {step.day && <span className="trust-day-tag">{step.day}</span>}
                </h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustProcess;
