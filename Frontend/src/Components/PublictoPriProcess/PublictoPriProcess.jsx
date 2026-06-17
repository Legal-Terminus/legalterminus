import React from "react";
import "../ProFOPCProcess/ProFOPCProcess.css";

const steps = [
  {
    title: "Step 1 – Board Meeting",
    text:
      "Convene a board meeting to approve the conversion, fix the date of the EGM, and authorise alteration of the MOA & AOA.",
  },
  {
    title: "Step 2 – Special Resolution (EGM)",
    text:
      "Pass a special resolution in the extraordinary general meeting approving the conversion and the altered Articles of Association.",
  },
  {
    title: "Step 3 – MGT-14 Filing",
    text:
      "File the special resolution with the Registrar of Companies in Form MGT-14 within 30 days of passing it.",
  },
  {
    title: "Step 4 – Notices & Advertisement",
    text:
      "Publish Form INC-25A in an English and a vernacular newspaper, and serve notice on creditors, debenture holders, the RoC and the Regional Director.",
  },
  {
    title: "Step 5 – RD-1 Application",
    text:
      "File the application for conversion with the Regional Director in Form RD-1 within 60 days of the special resolution, along with all attachments.",
  },
  {
    title: "Step 6 – RD Hearing & Order",
    text:
      "Respond to any objections received; the Regional Director examines the application and passes the order approving the conversion.",
  },
  {
    title: "Step 7 – INC-28 Filing",
    text:
      "File the certified copy of the Regional Director's order with the Registrar of Companies in Form INC-28.",
  },
  {
    title: "Step 8 – Fresh Certificate of Incorporation",
    text:
      "The Registrar issues a fresh Certificate of Incorporation reflecting the company's new Private Limited status.",
  },
];

const PublictoPriProcess = () => {
  return (
    <section className="profopc-process-wrapper">
      <h2 className="profopc-process-heading">
        STEPS TO CONVERT PUBLIC LIMITED INTO PRIVATE LIMITED
      </h2>
      <p className="profopc-process-subheading">
        The broad process of converting a Public Limited company into a Private
        Limited company involves the following steps:
      </p>

      <div className="profopc-process-timeline">
        <div className="profopc-process-timeline-line" />

        {steps.map((step, index) => (
          <div
            key={index}
            className={`profopc-process-timeline-item ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="profopc-process-timeline-dot">
              {index + 1}
            </div>

            <div className="profopc-process-timeline-card">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublictoPriProcess;
