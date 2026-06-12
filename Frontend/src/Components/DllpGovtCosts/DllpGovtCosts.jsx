import React from "react";
import "./DllpGovtCosts.css";

const rows = [
  {
    head: "Strike-Off Filing Fee (Form 24)",
    range: "₹500 (nominal)",
    note: "Nominal MCA fee for filing the application to strike off the LLP's name",
  },
  {
    head: "Pending Form 8 / Form 11 Fees",
    range: "₹50 – ₹200 per form",
    note: "Slab-based on contribution, plus ₹100/day late fee (uncapped) if overdue",
  },
  {
    head: "Affidavit & Indemnity Stamping",
    range: "₹500 – ₹2,000",
    note: "Stamp paper & notarisation for the affidavit and indemnity from partners",
  },
  {
    head: "DSC (if expired / not available)",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate of designated partner required to sign Form 24",
  },
  {
    head: "CA Certification (Statement of Accounts)",
    range: "Professional charge",
    note: "Nil-asset, nil-liability statement (within 30 days) certified by a CA",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹2,000 – ₹8,000",
    note: "Govt. fee billed at actuals; varies with pending filings & documentation",
    isTotal: true,
  },
];

const DllpGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The Form 24 filing fee and any pending Form 8 / Form 11 fees are charged over and above our professional fee. The total depends on how many annual filings are still pending — and for LLPs the late fee is ₹100 per day with no cap — billed at actuals per the official MCA schedule.
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

export default DllpGovtCosts;
