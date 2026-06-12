import React from "react";
import "./CacomGovtCosts.css";

const rows = [
  {
    head: "Form INC-22 Filing Fee",
    range: "₹300 – ₹600",
    note: "MCA fee based on the company's authorised share capital slab",
  },
  {
    head: "Form MGT-14 (Special Resolution)",
    range: "₹300 – ₹600",
    note: "Required where a special resolution is passed (within-state / state change)",
  },
  {
    head: "Newspaper Advertisement (INC-26)",
    range: "₹3,000 – ₹10,000",
    note: "For a state change — publication in vernacular & English newspapers",
  },
  {
    head: "Regional Director Application (INC-23)",
    range: "₹1,000 – ₹5,000",
    note: "Government fee for the RD application in a state-to-state change",
  },
  {
    head: "Stamp Duty / Notarisation",
    range: "₹500 – ₹2,000",
    note: "On affidavits, NOC, and supporting declarations as applicable",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹500 – ₹15,000",
    note: "Low for a local shift; higher for a state change — billed at actuals",
    isTotal: true,
  },
];

const CacomGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The MCA filing fees and any RD or advertisement costs are charged over and above our professional fee. The total depends entirely on the type of change — a shift within the same city is inexpensive, while a state-to-state change involves more steps and cost. Billed at actuals.
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

export default CacomGovtCosts;
