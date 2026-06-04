import React from "react";
import "./OPCGovtCosts.css";

const rows = [
  {
    head: "SPICe+ Filing Fee",
    range: "₹143",
    note: "Irrespective of authorized capital",
  },
  {
    head: "RUN Name Reservation",
    range: "₹1,000",
    note: "Per attempt; 2 names per attempt",
  },
  {
    head: "Stamp Duty on MOA/AOA",
    range: "₹500 – ₹2,000",
    note: "It based on State + Authorized capital; OPC stamp duty typically lower than PLC",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued along with COI",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,999 / person",
    note: "Required for director (mandatory) + nominee (recommended)",
  },
  {
    head: "DIN",
    range: "₹0",
    note: "Auto-applied via SPICe+ for the sole director",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹4,000 – ₹6,500",
    note: "Significantly lower than PLC (only 1 director vs 3)",
    isTotal: true,
  },
];

const OPCGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by state and capital.
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

export default OPCGovtCosts;
