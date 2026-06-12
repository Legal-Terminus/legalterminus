import React from "react";
import "./LabourLicenseFeatures.css";

const types = [
  {
    number: "01",
    title: "Contractor License - New (OSH Code 2020 Sec 47)",
    badge: "In Plan",
    text: "Contractors engaging 50+ contract workers need a License from the appropriate Government (Central / State Labour Department). 5-year validity. Single license covers all the contractor's establishments. Filed on Shram Suvidha (https://shramsuvidha.gov.in). Form V from Principal Employer is a pre-condition.",
  },
  {
    number: "02",
    title: "Principal Employer Registration (OSH Code 2020 Sec 45)",
    badge: "In Plan",
    text: "Every establishment engaging 50+ contract labour through one or more contractors needs Registration as Principal Employer. One-time registration (no periodic renewal; amendable as PE grows). Statutory basis: Section 45 of OSH Code 2020 (replaces Section 7 of CLRA).",
  },
  {
    number: "03",
    title: "Form V Certificate (PE → Contractor)",
    badge: "Included",
    text: "Mandatory pre-condition for a Contractor to apply for License. Principal Employer issues Form V certifying the engagement, the work covered, the worker count, and the period of engagement. Often where mismatched filings derail - we co-draft Form V on both sides as part of the base plan.",
  },
  {
    number: "04",
    title: "Contractor License - Renewal (5-Year Cycle)",
    badge: "Add-On",
    text: "Renewal before expiry of the 5-year license. Same Shram Suvidha portal, separate workflow. Late renewal attracts surcharge per State Rules. Our base plan includes 5-year calendar reminders; actual renewal filing is a separately-quoted add-on as the 5-year cycle elapses.",
  },
  {
    number: "05",
    title: "Inter-State Migrant Workmen (ISMW) - OSH Code Ch XI",
    badge: "Add-On Rs.8,500",
    text: "Contractor engaging 5 OR MORE inter-state migrant workmen needs LICENSE specifically under the Inter-State Migrant Workmen provisions of OSH Code 2020 Chapter XI (consolidating the old ISMW Act 1979). Special welfare obligations + journey allowance + displacement allowance apply.",
  },
  {
    number: "06",
    title: "BOCW Cess + Registration (Construction)",
    badge: "Add-On Rs.10,000",
    text: "For construction projects of value Rs.10 lakh+: Building and Other Construction Workers (BOCW) provisions apply - registration of establishment, payment of BOCW Cess at 1% of construction cost to the State BOCW Welfare Board, worker registration with the Board. Cess continues post-OSH Code 2020.",
  },
  {
    number: "07",
    title: "Amendment - Worker Scaling / Address / Activity",
    text: "Existing licensees needing: scaling up worker count (more workers covered), address change, additional establishment addition, change in nature of work, partner / proprietor change. Filed on Shram Suvidha as amendment. 1 amendment within 12 months is FREE in the base plan; additional amendments at Rs.1,499 each.",
  },
  {
    number: "08",
    title: "License Surrender + Security Deposit Refund",
    badge: "Custom Quote",
    text: "Voluntary surrender of License when contract operations end or worker count drops below threshold. Refund of security deposit on Labour Department clearance + settlement of dues + welfare facility surrender. Quoted separately based on portfolio scale.",
  },
];

const LabourLicenseFeatures = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of Labour Licence Registration in India</h2>

        <div className="opc-features-cards">
          {types.map((type) => (
            <div className="opc-features-card" key={type.number}>
              <div className="opc-features-number">{type.number}</div>
              <h3 className="opc-features-card-title">{type.title}</h3>
              {type.badge && <span className="opc-features-card-subtitle">{type.badge}</span>}
              <p className="opc-features-card-text">{type.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LabourLicenseFeatures;
