import React from "react";
import "./SocietyProcess.css";

const steps = [
  {
    title: "Step 1 – Document Submission",
    day: "Day 1",
    text: "Submission of required documents and information as per the checklist provided by our team.",
  },
  {
    title: "Step 2 – Name & Object Finalization",
    day: "Day 1–2",
    text: "Finalization of society name and objectives based on a name search conducted by our experts.",
  },
  {
    title: "Step 3 – Drafting of MOA & Rules",
    day: "Day 2–3",
    text: "Drafting of the Memorandum of Association and Rules & Regulations of the Society as per the Societies Registration Act.",
  },
  {
    title: "Step 4 – Preparation of Forms",
    day: "Day 3–4",
    text: "Preparation of all required forms and affidavits for governing body members along with their signatures.",
  },
  {
    title: "Step 5 – Filing with Registrar",
    day: "Day 4–5",
    text: "Submission of application with the Registrar of Societies along with required documents and applicable government fees.",
  },
  {
    title: "Step 6 – Scrutiny by Registrar",
    day: "Day 5–7",
    text: "Review and scrutiny of documents by the Registrar of Societies for completeness and compliance.",
  },
  {
    title: "Step 7 – Certificate of Registration",
    day: "Day 7–10",
    text: "Issuance of the Certificate of Registration by the Registrar upon successful verification of all documents.",
  },
];

const SocietyProcess = () => {
  return (
    <section className="society-process-section">
      <div className="society-process-wrapper">
        <h2 className="society-process-title">
          Steps for Society Registration in India
        </h2>

        <p className="society-process-subtitle">
          The complete process of registering a Society involves the following structured steps:
        </p>

        <div className="society-timeline">
          <div className="society-timeline-line" />

          {steps.map((step, index) => (
            <div
              key={index}
              className={`society-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="society-timeline-dot">{index + 1}</div>

              <div className="society-timeline-card">
                <h4>
                  {step.title}
                  {step.day && <span className="society-day-tag">{step.day}</span>}
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

export default SocietyProcess;
