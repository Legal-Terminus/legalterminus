import React from "react";
import "./CnllpElegibility.css";

const steps = [
  {
    title: "Name Search & Partner Approval",
    day: "Step 1",
    text: "We check the proposed new name against the MCA database and the trademark register for availability and guideline compliance, and shortlist conflict-free options. The partners then approve the change and authorise the filing.",
  },
  {
    title: "Name Reservation (RUN-LLP)",
    day: "Step 2",
    text: "We apply to reserve the chosen name through the RUN-LLP service on the MCA portal, with a backup option. Once the Registrar approves and reserves the name, the LLP can proceed to formalise the change.",
  },
  {
    title: "Supplementary LLP Agreement",
    day: "Step 3",
    text: "We draft a supplementary LLP agreement recording the new name and any consequential changes. It is executed by all partners and stamped per the applicable state stamp duty — the legal basis for the name change.",
  },
  {
    title: "Filing Form 5 (Notice of Name Change)",
    day: "Step 4",
    text: "Form 5 — the notice for change of name — is filed with the ROC within the prescribed time, signed with the designated partner's DSC. The reserved-name approval and partners' consent are filed as attachments.",
  },
  {
    title: "Filing Form 3 & Fresh COI",
    day: "Step 5",
    text: "Form 3 is filed to record the supplementary LLP agreement. On approval, the Registrar issues a fresh Certificate of Incorporation bearing the new name, confirming the change on the official record.",
  },
  {
    title: "Update PAN, GST, Bank & Licences",
    day: "Step 6",
    text: "We help update the new name on the LLP's PAN, GST registration, bank account, Udyam, and other licences, and provide guidance for stationery, signage, and invoices — so the new name is reflected everywhere.",
  },
];

const CnllpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        LLP Name Change Process — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from name search to a fresh Certificate of Incorporation — and every downstream record updated.
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

export default CnllpElegibility;
