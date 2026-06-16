import React from "react";
import "./LtopvtElegibility.css";

const steps = [
  {
    title: "Eligibility Review & Cap-Table Mapping",
    day: "Step 1",
    text: "We confirm eligibility under Section 366 and map the LLP's partners and their capital contribution into the proposed shareholding of the company. With two or more partners, the minimum of two directors and two shareholders is already met; we structure the share capital and any ESOP pool.",
  },
  {
    title: "DSC, DIN & Name Reservation",
    day: "Step 2",
    text: "We obtain DSC and DIN for the directors and reserve the company name through SPICe+ Part A. The LLP's existing name can usually continue, with the legal name ending in 'Private Limited', subject to MCA approval.",
  },
  {
    title: "Registrar NOC & Statement of Accounts",
    day: "Step 3",
    text: "We obtain the No-Objection Certificate from the Registrar where the LLP is registered, and compile the CA-certified statement of the LLP's assets and liabilities, the latest LLP agreement, and the list of creditors with their consent.",
  },
  {
    title: "URC-2 Newspaper Advertisement",
    day: "Step 4",
    text: "A public notice in Form URC-2 is published in an English and a vernacular newspaper inviting objections to the conversion. We draft and coordinate the publication and manage the statutory objection window, responding to any objections raised.",
  },
  {
    title: "Filing URC-1 + SPICe+ Incorporation",
    day: "Step 5",
    text: "Form URC-1 is filed with the ROC together with SPICe+ Part B, the MOA, AOA, and INC-9 declarations. On approval, the company is incorporated under Section 367 and receives its Certificate of Incorporation, CIN, PAN, and TAN.",
  },
  {
    title: "Dissolve LLP & Migrate Records",
    day: "Step 6",
    text: "The Registrar of LLPs is intimated and the LLP stands dissolved on conversion. We register the company for GST, open its bank account, migrate Udyam, IEC, and licences, issue share certificates, and set up the first-year compliance calendar (AOC-4, MGT-7, audit).",
  },
];

const LtopvtElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        LLP to Private Limited Conversion — Step by Step
      </h2>
      <p className="opcelg-subheading">
        Six steps from eligibility review to a fully operational Pvt Ltd — the Section 366 conversion and cap-table setup handled together.
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

export default LtopvtElegibility;
