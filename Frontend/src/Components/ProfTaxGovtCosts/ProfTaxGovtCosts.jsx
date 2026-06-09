import React from "react";
import "./ProfTaxGovtCosts.css";

const rows = [
  {
    head: "PT Registration Fee",
    range: "₹0 – ₹2,500",
    note: "Varies by state; many states charge ₹0 for online registration",
  },
  {
    head: "PTEC (Employer Enrollment)",
    range: "₹2,500 / year",
    note: "Maharashtra PTEC annual payment; other states have similar levies",
  },
  {
    head: "PTRC (Employee Deduction)",
    range: "₹0 – ₹200 / employee",
    note: "Per-employee slab tax; max ₹200/month for salary ≥ ₹10,000",
  },
  {
    head: "Late Payment Penalty",
    range: "1% – 2% per month",
    note: "Charged on unpaid PT amount; state-specific rates apply",
  },
  {
    head: "Digital Signature (if required)",
    range: "₹1,999 / person",
    note: "Needed in some states for online portal submission",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹2,500 – ₹8,000",
    note: "Depends on state, number of employees, and registration type",
    isTotal: true,
  },
];

const ProfTaxGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts vary by state and number of employees.
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

export default ProfTaxGovtCosts;
