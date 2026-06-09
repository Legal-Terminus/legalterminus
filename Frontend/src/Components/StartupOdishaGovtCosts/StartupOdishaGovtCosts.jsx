import React from "react";
import "../IECGovtCosts/IECGovtCosts.css";

const rows = [
  {
    head: "Startup Odisha Application Fee",
    range: "Rs.0",
    note: "Government fee is GENUINELY NIL",
  },
  {
    head: "Central DPIIT Application Fee",
    range: "Rs.0",
    note: "Government fee is GENUINELY NIL (Enriched / Supreme)",
  },
  {
    head: "Class 3 Organizational DSC",
    range: "Rs.2,500 - Rs.4,000",
    note: "Pricier than individual DSCs; 2-yr validity (Enriched / Supreme)",
  },
  {
    head: "Trademark Govt Fee per Class",
    range: "Rs.4,500",
    note: "With DPIIT 50% rebate (from Rs.9,000); Supreme only",
  },
  {
    head: "Notarisation (if required)",
    range: "Rs.100 - Rs.300",
    note: "Rare; case-specific",
  },
  {
    head: "Total Out-of-Pocket (Elemental)",
    range: "Rs.0",
    note: "Startup Odisha alone is genuinely free",
  },
  {
    head: "Total Out-of-Pocket (Enriched)",
    range: "Rs.2,500 - Rs.4,000",
    note: "Just the Organizational DSC",
  },
  {
    head: "Total Out-of-Pocket (Supreme)",
    range: "Rs.7,000 - Rs.8,500",
    note: "DSC + Trademark govt fee combined",
  },
];

const StartupOdishaGovtCosts = () => {
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

export default StartupOdishaGovtCosts;
