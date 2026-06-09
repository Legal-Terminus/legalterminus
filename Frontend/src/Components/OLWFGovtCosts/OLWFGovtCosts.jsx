import React from "react";
import "../OPCGovtCosts/OPCGovtCosts.css";

const rows = [
  {
    head: "OLWF Registration Fee",
    range: "Rs.0 – Rs.500",
    note: "Government fee per Odisha Labour Welfare Board (subject to current notification)",
  },
  {
    head: "Employer Contribution (half-yearly)",
    range: "Per current Odisha notification",
    note: "Nominal per-worker amount; payable Jan + July",
  },
  {
    head: "Employee Contribution (half-yearly)",
    range: "Per current Odisha notification",
    note: "Deducted from worker wages; also nominal",
  },
  {
    head: "DSC for Authorised Signatory",
    range: "Rs.0 – Rs.1,999",
    note: "Only if digital signing required by the Welfare Board portal",
  },
  {
    head: "Notarisation (if required)",
    range: "Rs.100 – Rs.300",
    note: "Rare; only if a specific affidavit is sought",
  },
  {
    head: "Total Setup Out-of-Pocket",
    range: "Rs.500 – Rs.2,000",
    note: "Just registration fee + (optional) DSC",
    isTotal: true,
  },
];

const OLWFGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          These are estimated government fees and contributions charged over and above our professional fee. Actual amounts are notified by the Odisha Labour Welfare Board.
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

export default OLWFGovtCosts;
