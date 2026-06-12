import React from "react";
import "./DpvtGovtCosts.css";

const rows = [
  {
    head: "Strike-Off Filing Fee (Form STK-2)",
    range: "₹10,000",
    note: "Fixed government fee payable to the MCA with the strike-off application",
  },
  {
    head: "Pending Annual Filing Fees",
    range: "₹300 – ₹600 per form",
    note: "AOC-4 / MGT-7 for any year not yet filed, plus ₹100/day late fee if overdue",
  },
  {
    head: "Affidavit & Indemnity Stamping",
    range: "₹500 – ₹2,000",
    note: "Stamp paper & notarisation for STK-3 (indemnity bond) and STK-4 (affidavit)",
  },
  {
    head: "DSC (if expired / not available)",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate of director required to sign Form STK-2",
  },
  {
    head: "CA Certification (STK-8)",
    range: "Professional charge",
    note: "Statement of accounts (not older than 30 days) certified by a Chartered Accountant",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹10,000 – ₹15,000",
    note: "Govt. fee billed at actuals; varies with pending filings & documentation needs",
    isTotal: true,
  },
];

const DpvtGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The MCA strike-off fee and any pending-filing fees are charged over and above our professional fee. The total depends on how many annual filings are still pending and the documentation required — billed at actuals per the official MCA fee schedule.
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

export default DpvtGovtCosts;
