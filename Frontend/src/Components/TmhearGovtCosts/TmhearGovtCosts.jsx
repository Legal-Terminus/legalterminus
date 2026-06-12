import React from "react";
import "./TmhearGovtCosts.css";

const rows = [
  {
    head: "Attending the Hearing",
    range: "₹0 govt fee",
    note: "Appearing at a show-cause or opposition hearing carries no government fee",
  },
  {
    head: "Hearing Notice Period",
    range: "~15–30 days",
    note: "The Registry typically notifies the hearing date a few weeks in advance",
  },
  {
    head: "Adjournment Request (Form TM-M)",
    range: "₹900",
    note: "Government fee to request an adjournment; limited adjournments are allowed",
  },
  {
    head: "Mode of Hearing",
    range: "Video conference",
    note: "Hearings are largely conducted online before the Hearing Officer",
  },
  {
    head: "Review Petition (Form TM-M, if needed)",
    range: "₹2,700",
    note: "Government fee if a review of the Registrar's order is sought after the hearing",
  },
  {
    head: "Total Out-of-Pocket (typical hearing)",
    range: "₹0 – ₹900",
    note: "Largely fee-free; our professional fee covers preparation & representation",
    isTotal: true,
  },
];

const TmhearGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Government Fees &amp; Key Timelines
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Attending a trademark hearing is largely free of government fees — the value is in the quality of preparation and advocacy. Our professional fee covers the written submissions and representation. Incidental fees (an adjournment or a later review) are billed at actuals.
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

export default TmhearGovtCosts;
