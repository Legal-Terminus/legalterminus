import React from "react";
import "./GSTRegTypes.css";

const types = [
  {
    number: "01",
    title: "Regular Taxpayer",
    text: "The default. For businesses crossing the ₹40L (goods) / ₹20L (services) AATO threshold, or registering voluntarily. File GSTR-1 + GSTR-3B monthly or quarterly under QRMP.",
  },
  {
    number: "02",
    title: "Composition Scheme",
    text: "For taxpayers under ₹1.5 cr AATO (₹75L for select states). Pay tax at a flat 1% / 5% / 6% on turnover, file CMP-08 quarterly + GSTR-4 annually. Catch: no ITC, no inter-state outward supply.",
  },
  {
    number: "03",
    title: "Casual Taxable Person (CTP)",
    text: "Pop-up businesses — exhibition stalls, seasonal vendors, event organisers. Registration valid for 90 days max, requires advance tax deposit equal to estimated liability.",
  },
  {
    number: "04",
    title: "Non-Resident Taxable Person",
    text: "Foreign businesses supplying goods / services in India without a fixed place of business. Same 90-day rule as CTP, advance tax deposit mandatory, no ITC on most procurements.",
  },
  {
    number: "05",
    title: "Input Service Distributor (ISD)",
    text: "Mandatory since 1 April 2025 for entities with multiple GSTINs receiving common input service invoices (e.g., HQ rent, group software licences). File GSTR-6 monthly to distribute ITC across branches.",
  },
  {
    number: "06",
    title: "E-Commerce Operator (ECO)",
    text: "Anyone running a marketplace — apps, websites, aggregators. Registration is mandatory regardless of turnover. Must collect 1% TCS (CGST 0.5% + SGST 0.5%, or IGST 1%) and file GSTR-8 monthly.",
  },
  {
    number: "07",
    title: "TDS Deductor",
    text: "Government departments, PSUs, local authorities, and notified entities deducting 2% TDS on contract payments above ₹2.5 lakh. File GSTR-7 monthly.",
  },
  {
    number: "08",
    title: "SEZ Unit / Developer",
    text: "Special Economic Zone entities. Separate GSTIN per SEZ unit, zero-rated supplies, LUT route for exports without IGST. Quarterly compliance overlay with SEZ Online portal.",
  },
];

const GSTRegTypes = () => {
  return (
    <section className="opc-features-section">
      <div className="opc-features-container">

        <h2 className="opc-features-title">Types of GST Registration in India</h2>

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

export default GSTRegTypes;
