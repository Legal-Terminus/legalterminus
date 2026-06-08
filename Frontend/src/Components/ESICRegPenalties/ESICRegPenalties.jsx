import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "Non-registration penalty",
    detail: "Up to ₹10,000 under Section 85(a)",
    notes: "Per instance; ESIC can also initiate suo-motu coverage",
  },
  {
    head: "Delayed contribution — interest",
    detail: "12% per annum under Section 85B",
    notes: "Calculated daily on outstanding amount",
  },
  {
    head: "Delayed contribution — damages",
    detail: "5% (≤2 months) / 10% (2–4 m) / 15% (4–6 m) / 25% (>6 m)",
    notes: "On arrears of contribution; compounds quickly",
  },
  {
    head: "False return / concealment",
    detail: "Fine up to ₹2,000 + imprisonment up to 1 year",
    notes: "Section 85(c) — intentional non-disclosure",
  },
  {
    head: "Obstruction of ESIC inspector",
    detail: "Fine up to ₹2,000",
    notes: "Section 85(d)",
  },
  {
    head: "Monthly compliance (post-registration)",
    detail: "Contribution by 15th of following month",
    notes: "Form 6 register, attendance register, accident register",
  },
];

const ESICRegPenalties = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Penalties &amp; Post-Registration Compliance
          <span className="govtcosts-badge">Section 85 / 85B</span>
        </h2>
        <p className="govtcosts-subtitle">
          Non-compliance with ESIC is expensive. Here's the penalty structure and ongoing compliance obligations once you're registered:
        </p>

        <div className="govtcosts-table-wrapper">
          <table className="govtcosts-table">
            <thead>
              <tr>
                <th>Non-Compliance / Obligation</th>
                <th>Penalty / Requirement</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.head}</td>
                  <td>{row.detail}</td>
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

export default ESICRegPenalties;
