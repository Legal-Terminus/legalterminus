import React from "react";
import "./LabourLicenseElegibility.css";

const steps = [
  {
    title: "Discovery & Role + Threshold Mapping",
    day: "Day 0",
    text: "30-min call with our labour-law specialist to confirm: your role (Contractor / Principal Employer), worker count (verify 50+ threshold per OSH Code 2020), nature of work, geographic spread (single state - our base plan covers one State), inter-state migrant workmen present (add-on), construction nexus (BOCW add-on), and OSH Code 2020 State Rules notification status for your State.",
  },
  {
    title: "Shram Suvidha Portal Account Setup",
    day: "Day 1",
    text: "Create FBO account on the Unified Shram Suvidha Portal (https://shramsuvidha.gov.in) - the Ministry of Labour & Employment's single-window for labour-law compliance. PAN + entity profile + authorised signatory + DSC configured.",
  },
  {
    title: "Form V Certificate Co-Drafting",
    day: "Day 1-3",
    text: "Principal Employer issues Form V certifying engagement of the Contractor - the work covered, the worker count, the period of engagement. This is a PRE-CONDITION for Contractor License. We co-draft Form V from both sides as part of the base plan to ensure the PE-Contractor chain matches at filing.",
  },
  {
    title: "Documents Collection + Welfare Plan",
    day: "Day 2-5",
    text: "Personalised checklist per role. Contractor: PAN, entity proof, Form V from PE, worker schedule + wage details, premises proof (camp / accommodation if any), welfare facility plan (canteen / restrooms / first aid / drinking water). PE: PAN, entity proof, list of contractors engaged, work order copies, premises proof.",
  },
  {
    title: "Application Drafting + Fee Computation",
    day: "Day 5-7",
    text: "Contractor License application OR Principal Employer Registration application drafted with full annexures - worker schedule, welfare facility plan, premises layout, Form V chain. Government fee + security deposit computed per State Rules.",
  },
  {
    title: "Government Fee + Security Deposit Payment",
    day: "Day 7",
    text: "You pay the government fee + security deposit via Shram Suvidha portal payment gateway (or via State portal where Labour Department has not migrated). Receipt captured.",
  },
  {
    title: "Shram Suvidha Filing + Labour Department Processing",
    day: "Day 7-15",
    text: "Application + annexures uploaded to Shram Suvidha. Acknowledgement + reference number captured. Labour Department / Licensing Officer reviews + processes. Any queries (Form V mismatch, wage schedule, welfare facility gap) addressed within 7 days.",
  },
  {
    title: "License Certificate Delivery + 5-Year Calendar",
    day: "Day 15-30",
    text: "Contractor License (5-year validity) OR Principal Employer Registration Certificate issued by the Licensing Officer / Designated Officer. We deliver: License / Registration PDF + welfare facility audit checklist + 5-year compliance calendar with annual return reminders + amendment-process map + 60-day senior-counsel helpline activation.",
  },
];

const LabourLicenseElegibility = () => {
  return (
    <section className="opcelg-wrapper">
      <h2 className="opcelg-heading">
        Steps for Labour Licence Registration in India
      </h2>
      <p className="opcelg-subheading">
        Eight steps. 15-20 working days end-to-end for License issuance in active OSH Code States; 20-30 days in transition States where CLRA Rules still apply.
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

export default LabourLicenseElegibility;
