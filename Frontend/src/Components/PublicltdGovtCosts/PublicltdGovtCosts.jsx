import React from "react";
import "./PublicltdGovtCosts.css";

const rows = [
  {
    head: "SPICe+ Filing Fee",
    range: "₹0",
    note: "Free for authorised capital up to ₹15 lakh",
  },
  {
    head: "RUN Name Reservation",
    range: "₹1,000",
    note: "Per attempt; 2 names per attempt",
  },
  {
    head: "Stamp Duty on MOA/AOA",
    range: "₹500 – ₹12,600+",
    note: "State + capital based; payable online via SPICe+",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued free along with COI",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,499 / person",
    note: "Required for all 3 directors + all 7 subscribers",
  },
  {
    head: "DIN (per director)",
    range: "₹500",
    note: "Auto-applied via SPICe+ for first 3 directors",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹17,500 – ₹30,000",
    note: "Varies by state and authorised capital",
    isTotal: true,
  },
];

const PublicltdGovtCosts = () => {
  return (
    <section className="pub-govtcosts-section">
      <div className="pub-govtcosts-container">
        <h2 className="pub-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="pub-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="pub-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by state, capital, and director count.
        </p>

        <div className="pub-govtcosts-table-wrapper">
          <table className="pub-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "pub-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="pub-govtcosts-range">{row.range}</td>
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

export default PublicltdGovtCosts;
