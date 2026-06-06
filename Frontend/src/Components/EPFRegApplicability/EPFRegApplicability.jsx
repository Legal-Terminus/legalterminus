import React from "react";
import "../CopyPvtTypes/CopyPvtTypes.css";

const types = [
  {
    number: "01",
    title: "Mandatory EPF (20+ Employees)",
    text: "The default path. Triggered automatically under Section 1(3)(a) when your headcount touches 20. Must register within 30 days. Establishment Code (Employer ID) issued by RPFC. All employees earning ≤ ₹15K (basic + DA) are mandatorily covered.",
  },
  {
    number: "02",
    title: "Voluntary EPF (Under 20 Employees)",
    text: "Section 1(4) of the Act. Sub-20 establishments can voluntarily register by employer-employee mutual agreement. Common for IT startups offering EPF as a talent-attraction benefit. Once registered, you cannot opt out — so plan ahead.",
  },
  {
    number: "03",
    title: "Notified Establishment EPF (10+ Employees)",
    text: "Section 1(3)(b) — certain industries (cinema, plantations, schools etc.) are notified to trigger at 10 employees instead of 20. Check your industry against EPFO notifications. Same registration process, lower threshold.",
  },
  {
    number: "04",
    title: "International Worker (IW) EPF",
    text: "For establishments employing International Workers (foreign nationals working in India, or Indians working abroad covered under a Social Security Agreement). Triggered regardless of total headcount. Separate Form IW-1 + tighter compliance under Para 83A of the EPF Scheme.",
  },
  {
    number: "05",
    title: "Higher Pension Scheme (HPS) Registration",
    text: "Following the Supreme Court judgment of November 2022, employees can opt to contribute EPS on actual salary instead of the ₹15K cap. Employer must facilitate. Separate joint declaration + diversion mechanism. Out-of-scope for our basic tiers; advisory available.",
  },
  {
    number: "06",
    title: "Multi-Location / Branch EPF",
    text: "A single PAN with multiple branches across states can either (a) operate under one central Establishment Code with branch-level reporting, or (b) seek separate codes per branch. Decision depends on payroll centralisation and PT compliance. We advise on the discovery call.",
  },
];

const EPFRegApplicability = () => {
  return (
    <section className="cpvt-section">
      <div className="cpvt-container">
        <h2 className="cpvt-title">Types of EPF Coverage in India</h2>
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

export default EPFRegApplicability;
