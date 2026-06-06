import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "EPF Registration Fee",
    range: "₹0",
    notes: "Government fee is GENUINELY NIL — no fee for registration",
  },
  {
    head: "Aadhaar OTP / PAN Validation",
    range: "₹0",
    notes: "All auto-fetch, no charge",
  },
  {
    head: "Form 5A filing for establishment registration",
    range: "₹0",
    notes: "Government fee is GENUINELY NIL — no fee for Form 5A approval",
  },
  {
    head: "UAN activation",
    range: "₹0",
    notes: "Government fee is GENUINELY NIL — no fee for UAN creation",
  },
  {
    head: "Monthly EPF Contribution",
    range: "12% + 12% + 1%",
    notes: "Employee 12% + Employer 12% + 0.50% Admin + 0.50% EDLI — ongoing",
    isTotal: true,
  },
];

const EPFGovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          These are estimated government and statutory costs charged over and above our professional fee. Actual amounts may vary.
        </p>

        <div className="govtcosts-table-wrapper">
          <table className="govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className={row.isTotal ? "govtcosts-range" : ""}>{row.range}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EPFGovtCosts;
