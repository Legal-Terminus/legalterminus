import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "ESIC Registration Fee",
    range: "₹0",
    notes: "Government fee is GENUINELY NIL — no fee for registration",
  },
  {
    head: "Aadhaar OTP / PAN Validation",
    range: "₹0",
    notes: "All auto-fetch, no charge",
  },
  {
    head: "IP Generation per Employee",
    range: "₹0",
    notes: "Free via ESIC portal",
  },
  {
    head: "Pehchan Card per Employee + Family",
    range: "₹0",
    notes: "Issued free by ESIC for medical-facility access",
  },
  {
    head: "Monthly ESIC Contribution (Employee)",
    range: "0.75% of gross wages",
    notes: "Deducted from monthly salary; ongoing",
    isTotal: true,
  },
  {
    head: "Monthly ESIC Contribution (Employer)",
    range: "3.25% of gross wages",
    notes: "On covered employees; ongoing",
    isTotal: true,
  },
];

const ESICGovtCosts = () => {
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

export default ESICGovtCosts;
