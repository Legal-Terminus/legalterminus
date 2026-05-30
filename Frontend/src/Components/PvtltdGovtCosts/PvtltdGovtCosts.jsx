import React from "react";
import "./PvtltdGovtCosts.css";

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
    range: "₹500 – ₹12,600",
    note: "State-based; Maharashtra/Delhi low, Punjab/Kerala high",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued free along with COI",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,999 / person",
    note: "Required for both directors and any non-director subscribers",
  },
  {
    head: "DIN",
    range: "₹500 / director",
    note: "Auto-applied via SPICe+ for first 3 directors",
  },
  {
    head: "INC-20A (Commencement)",
    range: "₹200 – ₹400",
    note: "Filed within 180 days of incorporation",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹4,500 – ₹17,000",
    note: "Lower than PLC; varies by state and capital",
    isTotal: true,
  },
];

const PvtltdGovtCosts = () => {
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

export default PvtltdGovtCosts;
