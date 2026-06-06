import React from "react";
import "./UdyamRegGovtCosts.css";

const rows = [
  { head: "Udyam Registration Fee", range: "Rs.0", note: "Government fee is GENUINELY NIL - no fee, no exception" },
  { head: "GST Registration (Govt)", range: "Rs.0", note: "SPICe+ / GST portal filing fee NIL" },
  { head: "Trademark Govt Fee (per class)", range: "Rs.4,500", note: "Rs.4,500 with Udyam (50% subsidy); Rs.9,000 without Udyam" },
  { head: "Aadhaar OTP / PAN / GSTN Validation", range: "Rs.0", note: "All auto-fetch, no charge" },
  { head: "Udyam Certificate", range: "Rs.0", note: "Issued instantly online; PDF download free" },
  { head: "Total Out-of-Pocket (Elemental)", range: "Rs.0", note: "Udyam alone costs nothing", isTotal: true },
  { head: "Total Out-of-Pocket (Enriched)", range: "Rs.0", note: "Issued instantly online; PDF download free", isTotal: true },
  { head: "Total Out-of-Pocket (Supreme)", range: "Rs.4,500", note: "Trademark govt fee", isTotal: true },
];

const UdyamRegGovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by plan and applicable scheme.
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

export default UdyamRegGovtCosts;
