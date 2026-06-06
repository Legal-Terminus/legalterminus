import React from "react";
import "./Section8GovtCosts.css";

const rows = [
  {
    head: "RUN Name Reservation",
    range: "Rs.1,000",
    note: "Per attempt; 2 names per attempt",
  },
  {
    head: "Stamp Duty on MOA/AOA",
    range: "Rs.500 – Rs.2,000",
    note: "Generally lower than commercial Pvt Ltd; state-based",
  },
  {
    head: "PAN + TAN",
    range: "Rs.0",
    note: "Issued free along with COI",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "Rs.1,999 / person",
    note: "For 2 directors + non-director subscribers",
  },
  {
    head: "DIN",
    range: "Rs.500 / director",
    note: "Auto-applied via SPICe+ for first 3 directors",
  },
  {
    head: "12A + 80G Filing (Form 10A/10AB)",
    range: "Rs.0",
    note: "No govt fee; we handle as part of Enriched / Supreme",
  },
];

const Section8GovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by state, capital, and director count.
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
                  <td className="govtcosts-range">{row.range}</td>
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

export default Section8GovtCosts;
