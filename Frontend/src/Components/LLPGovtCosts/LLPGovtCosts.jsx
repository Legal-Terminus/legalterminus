import React from "react";
import "./LLPGovtCosts.css";

const rows = [
  {
    head: "FiLLiP Filing Fee",
    range: "₹500 – ₹5,000",
    note: "Slab-based on capital contribution (₹500 for ≤ ₹1L)",
  },
  {
    head: "RUN-LLP Name Reservation",
    range: "₹200 – ₹1,000",
    note: "Per attempt; 2 names per attempt",
  },
  {
    head: "Stamp Duty on LLP Agreement",
    range: "₹200 – ₹5,000",
    note: "State-based; capital contribution drives the slab",
  },
  {
    head: "Form 3 (LLP Agreement) Filing",
    range: "₹50 – ₹200",
    note: "Slab-based on capital contribution",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued free along with COI",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,999 / partner",
    note: "Required for all designated partners",
  },
  {
    head: "DPIN / DIN",
    range: "₹500 / partner",
    note: "Auto-applied via FiLLiP for first 2 designated partners",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹4,500 – ₹10,000",
    note: "Lower than Pvt Ltd; varies by state and capital",
    isTotal: true,
  },
];

const LLPGovtCosts = () => {
  return (
    <section className="llp-govtcosts-section">
      <div className="llp-govtcosts-container">
        <h2 className="llp-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="llp-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="llp-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by state and capital contribution.
        </p>

        <div className="llp-govtcosts-table-wrapper">
          <table className="llp-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "llp-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="llp-govtcosts-range">{row.range}</td>
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

export default LLPGovtCosts;
