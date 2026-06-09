import React from "react";
import "./ProfTaxTypes.css";

const types = [
  {
    number: "01",
    title: "Employer Certificate of Registration (EC)",
    text: "Mandatory for every employer who pays salary or wages. The EC authorises the employer to deduct PT from employee salaries and deposit it to the state government. Must be obtained before the first payroll run. Failure to register attracts retrospective assessment plus penalty.",
  },
  {
    number: "02",
    title: "Employee Certificate of Enrollment (RC)",
    text: "Required for individual employees and self-employed professionals earning above the state threshold. In most states, the employer obtains the RC on behalf of employees. Self-employed persons (doctors, CAs, architects, consultants) enroll independently and pay PT directly.",
  },
  {
    number: "03",
    title: "PTEC — Maharashtra Employer Enrollment",
    text: "Unique to Maharashtra: in addition to PTRC (employee deduction), the employer itself must obtain a PTEC and pay ₹2,500/year on its own income. PTEC is not a deduction — it is a direct levy on the business entity. Applies to companies, LLPs, firms, and sole proprietors in Maharashtra.",
  },
  {
    number: "04",
    title: "Self-Employed / Professional PT",
    text: "Freelancers, consultants, and professionals in PT-applicable states must self-enroll and pay PT annually or as per the state schedule. Applicable professions vary by state — lawyers, doctors, engineers, chartered accountants, and architects are commonly included. The self-employed PT rate is typically ₹2,500/year.",
  },
];

const ProfTaxTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Professional Tax Registration in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProfTaxTypes;
