import React from "react";
import "./PFRGovtCosts.css";

const rows = [
  {
    head: "Stamp Duty on Partnership Deed",
    range: "₹200 – ₹5,000",
    note: "State + capital based; Odisha ₹200, Maharashtra ₹500, Karnataka up to ₹5K",
  },
  {
    head: "Notarisation of Deed",
    range: "₹100 – ₹500",
    note: "Notary public charges",
  },
  {
    head: "Registrar of Firm (IGR) Registration Fee (Form 1)",
    range: "₹200 – ₹1,000",
    note: "State-based; not applicable if you opt for unregistered firm",
  },
  {
    head: "Total Out-of-Pocket (Unregistered)",
    range: "₹300 – ₹5,000",
    note: "Just stamp duty + notarisation",
    isTotal: true,
  },
  {
    head: "Total Out-of-Pocket (Registered)",
    range: "₹500 – ₹7,500",
    note: "Adds RoF fee + affidavit",
    isTotal: true,
  },
];

const PFRGovtCosts = () => {
  return (
    <section className="pfrgc-section">
      <div className="pfrgc-container">
        <h2 className="pfrgc-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="pfrgc-badge">Billed at Actuals</span>
        </h2>
        <p className="pfrgc-subtitle">
          These are estimated government charges over and above our professional fee. Exact amounts vary by state, capital, and whether you opt for RoF registration.
        </p>

        <div className="pfrgc-table-wrapper">
          <table className="pfrgc-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "pfrgc-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="pfrgc-range">{row.range}</td>
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

export default PFRGovtCosts;
