import React from "react";
import "./TmexrGovtCosts.css";

const rows = [
  {
    head: "Examination Reply Filing",
    range: "₹0 govt fee",
    note: "Filing the reply to the examination report carries no separate government fee",
  },
  {
    head: "Reply Deadline",
    range: "30 days",
    note: "The reply must be filed within 30 days of receiving the examination report",
  },
  {
    head: "Show-Cause Hearing",
    range: "₹0 govt fee",
    note: "If a hearing is scheduled, attendance/representation carries no government fee",
  },
  {
    head: "Affidavit / Notarisation (if used)",
    range: "₹100 – ₹500",
    note: "Stamp paper & notary charges for an affidavit of use, where evidence is filed",
  },
  {
    head: "Review Petition (Form TM-M, if needed)",
    range: "₹2,700",
    note: "Government fee if a review of the Registrar's decision is later required",
  },
  {
    head: "Total Out-of-Pocket (typical reply)",
    range: "₹0 – ₹500",
    note: "Replying is largely fee-free; our professional fee covers the legal drafting & filing",
    isTotal: true,
  },
];

const TmexrGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Government Fees &amp; Key Timelines
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Replying to a trademark examination report is largely free of government fees — the value is in the quality of the legal argument. Our professional fee covers the analysis, drafting, and filing. Any incidental costs (notarisation, a later review petition) are billed at actuals.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost / Timeline Head</th>
                <th>Typical Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="opc-govtcosts-range">{row.range}</td>
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

export default TmexrGovtCosts;
