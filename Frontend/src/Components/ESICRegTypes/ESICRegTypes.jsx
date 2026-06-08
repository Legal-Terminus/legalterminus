import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Factory Establishment ESIC",
    text: "For establishments covered under the Factories Act, 1948 — manufacturing units with 10+ workers using power, or 20+ workers without power. Triggered automatically when the factory commences operation. Most common ESIC variant; covers all wage-eligible workmen + supervisors.",
  },
  {
    number: "02",
    title: "Shop & Commercial Establishment ESIC",
    text: "For Shops & Commercial Establishments covered under state Shops & Establishments Acts — offices, retail outlets, restaurants, cinemas, hotels, etc. ESIC coverage extended to S&E establishments via state notifications. Common for IT / BPO / retail / hospitality businesses.",
  },
  {
    number: "03",
    title: "Notified Industries ESIC",
    text: "Specific industries notified under Section 1(5) — educational institutions, medical institutions, security services, contract employment, cinema, hotels, restaurants. May have different thresholds (10 vs 20) and special compliance norms. Industry-specific advisory needed.",
  },
  {
    number: "04",
    title: "Sub-Code (Branch) Registration",
    text: "When you already have an ESIC Employer Code and open new branches in different ESIC regional offices' jurisdictions. Sub-code allows branch-level compliance under the parent code. Useful for multi-state employers maintaining centralised payroll but distributed operations.",
  },
  {
    number: "05",
    title: "Contractor / Inter-State Worker ESIC",
    text: "For principal employers engaging contractors with their own employees, OR contractors directly registering. Compliance under Section 1(4) read with the Contract Labour (R&A) Act. Critical for IT services, construction, security, housekeeping firms — one compliance gap can shift liability to the principal employer.",
  },
  {
    number: "06",
    title: "Voluntary ESIC Coverage",
    text: "Establishments below 10 employees can voluntarily seek ESIC coverage if employee-employer mutual agreement is in place. Less common than mandatory route; coverage must be sustainable from contribution-day-one. Useful for smaller employers wanting to offer ESIC as a benefit.",
  },
];

const ESICRegTypes = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of ESIC Coverage in India</h2>
        <div className="cpvt-cards">
          {types.map((type) => (
            <div className="cpvt-card" key={type.number}>
              <div className="cpvt-number">{type.number}</div>
              <h3 className="cpvt-card-title">{type.title}</h3>
              <p className="cpvt-card-text">{type.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ESICRegTypes;
