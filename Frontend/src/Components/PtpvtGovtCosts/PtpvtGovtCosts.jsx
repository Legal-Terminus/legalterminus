import React from "react";
import "./PtpvtGovtCosts.css";

const rows = [
  {
    head: "DSC for Directors",
    range: "₹1,000 – ₹2,000 each",
    note: "Digital Signature Certificates for the directors of the new company",
  },
  {
    head: "Name Reservation (SPICe+ Part A)",
    range: "₹0 – ₹1,000",
    note: "MCA fee to reserve the proposed company name",
  },
  {
    head: "URC-2 Newspaper Advertisement",
    range: "₹3,000 – ₹10,000",
    note: "Mandatory notice in one English + one vernacular newspaper inviting objections",
  },
  {
    head: "MCA Fees — URC-1 + SPICe+",
    range: "Slab-based",
    note: "Government fees on conversion & incorporation, by authorised capital slab",
  },
  {
    head: "Stamp Duty (MOA / AOA)",
    range: "₹1,000 – ₹5,000+",
    note: "State-specific stamp duty on the incorporation documents",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹6,000 – ₹20,000",
    note: "Higher than a fresh incorporation due to URC-1 / URC-2 — billed at actuals",
    isTotal: true,
  },
];

const PtpvtGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          A Section 366 conversion costs more than a fresh incorporation because of the URC-1 statutory pack and the mandatory URC-2 newspaper notice. The MCA fees, DSC, stamp duty, and advertisement charges are over and above our professional fee — billed at actuals per the official MCA schedule and applicable state stamp law.
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

export default PtpvtGovtCosts;
