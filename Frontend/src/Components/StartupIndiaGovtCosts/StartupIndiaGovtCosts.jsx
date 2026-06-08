import React from "react";
import "../IECGovtCosts/IECGovtCosts.css";

const rows = [
  {
    head: "DPIIT Recognition Application Fee",
    range: "Rs.0",
    note: "Government fee is GENUINELY NIL - filed via nsws.gov.in (National Single Window System)",
  },
  {
    head: "Section 80-IAC Application (IMB)",
    range: "Rs.0",
    note: "No government fee for IMB submission",
  },
  {
    head: "Section 56(2)(viib) Angel Tax",
    range: "Rs.0",
    note: "ABOLISHED from FY 2025-26 via Finance Act 2024 - no filing required for new fundraises",
  },
  {
    head: "Trademark Filing (with 50% rebate)",
    range: "Rs.4,500 (vs Rs.9,000)",
    note: "50% rebate on Class 3 govt fee (same as MSME rate)",
  },
];

const StartupIndiaGovtCosts = () => {
  return (
    <section className="iec-govtcosts-section">
      <div className="iec-govtcosts-container">
        <h2 className="iec-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="iec-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="iec-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by plan and applicable scheme.
        </p>

        <div className="iec-govtcosts-table-wrapper">
          <table className="iec-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.head}</td>
                  <td className="iec-govtcosts-range">{row.range}</td>
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

export default StartupIndiaGovtCosts;
