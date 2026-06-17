import React from "react";
import "./PvtllpElegibility.css";

const steps = [
  {
    title: "Eligibility, Charge & Tax Review",
    day: "Step 1",
    text: "We confirm eligibility under Section 56 / Third Schedule, check that no security interest (charge) is subsisting on the company's assets, and review Section 47(xiiib) conditions so the conversion stays tax-neutral. Shareholders are mapped to partners and capital contribution is structured from the existing shareholding.",
  },
  {
    title: "DSC, DPIN & LLP Name Reservation",
    day: "Step 2",
    text: "We obtain DSC and DPIN for the designated partners and reserve the LLP name through RUN-LLP / FiLLiP. The company's existing name can usually continue, with the legal name ending in 'LLP', subject to MCA approval.",
  },
  {
    title: "Clear Charges & Up-to-Date Filings",
    day: "Step 3",
    text: "We ensure all ROC annual filings (AOC-4, MGT-7) and income-tax returns are up to date, satisfy or obtain NOCs for any subsisting charges, and collect the written consent of all shareholders and secured creditors along with the statement of assets and liabilities.",
  },
  {
    title: "Filing Form 18 + FiLLiP",
    day: "Step 4",
    text: "Form 18 (the conversion application and statement) is filed with the ROC together with FiLLiP for LLP incorporation, attaching the shareholder and creditor consents, the latest ITR, and the statement of accounts. The Registrar reviews the application and may raise queries.",
  },
  {
    title: "LLP Incorporation & Form 3 Agreement",
    day: "Step 5",
    text: "On approval, the LLP is incorporated and receives its Certificate of Incorporation, LLPIN, PAN, and TAN. The LLP agreement — setting out profit sharing, roles, and contribution — is executed on stamp paper and filed in Form 3 within 30 days.",
  },
  {
    title: "Form 14 Intimation & Migration",
    day: "Step 6",
    text: "Form 14 intimation is filed with the Registrar of Companies within 15 days and the company is deemed dissolved. We amend GST, update PAN/TAN, open / update the bank account, migrate Udyam, IEC, and licences, and set up the lean LLP compliance calendar (Form 8, Form 11, ITR).",
  },
];

const PvtllpElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Private Limited to LLP Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility and charge review to a fully operational LLP — the Section 56 conversion, compliance closure, and tax check handled together.
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

export default PvtllpElegibility;
