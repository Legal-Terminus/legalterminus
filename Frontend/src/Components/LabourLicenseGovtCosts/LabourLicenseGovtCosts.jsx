import React from "react";
import "./LabourLicenseGovtCosts.css";

const rows = [
  {
    head: "Principal Employer Registration Fee",
    range: "₹60 – ₹2,250 (one-time)",
    note: "Slab-based on the number of contract workmen engaged; varies by state schedule",
  },
  {
    head: "Contractor Licence Fee",
    range: "₹15 – ₹90 / workman",
    note: "Per-workman slab fee under CLRA; depends on maximum number of workmen and state",
  },
  {
    head: "Security Deposit (Contractor)",
    range: "₹20 – ₹90 / workman",
    note: "Refundable deposit paid to the licensing authority; rate varies by state",
  },
  {
    head: "Renewal Fee",
    range: "Same as licence fee",
    note: "Payable each year; licence is valid for 1 year and must be renewed before expiry",
  },
  {
    head: "Late Renewal Surcharge",
    range: "25% of fee",
    note: "Applies if renewal is filed after the due date — per CLRA Central Rules / state rules",
  },
  {
    head: "Total Out-of-Pocket (typical, 50 workmen)",
    range: "₹5,000 – ₹12,000",
    note: "Govt. fee + refundable security deposit; billed at actuals, varies by state & workmen count",
    isTotal: true,
  },
];

const LabourLicenseGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          CLRA government fees and the refundable security deposit are charged over and above our professional fee. Actual amounts depend on the number of contract workmen and the state in which the establishment operates — billed at actuals per the applicable state schedule.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="opc-govtcosts-range">{row.range}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default LabourLicenseGovtCosts;
