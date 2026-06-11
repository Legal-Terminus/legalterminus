import React from "react";
import "./ItrBizGovtCosts.css";

const rows = [
  {
    head: "Late Filing Fee — Sec 234F (income > ₹5L)",
    range: "₹5,000",
    note: "For belated returns filed after the due date; reduced to ₹1,000 if total income ≤ ₹5 lakh",
  },
  {
    head: "Interest on Unpaid Tax — Sec 234A",
    range: "1% / month",
    note: "On the outstanding self-assessment tax from the due date until the date of filing",
  },
  {
    head: "Interest — Sec 234B / 234C",
    range: "1% / month",
    note: "For non-payment / short-payment / deferment of advance tax during the year",
  },
  {
    head: "Tax Audit Penalty — Sec 271B",
    range: "0.5% of turnover",
    note: "Up to ₹1,50,000 if accounts liable to audit u/s 44AB are not audited / report not filed",
  },
  {
    head: "Non-Filing Prosecution — Sec 276CC",
    range: "Imprisonment + fine",
    note: "For wilful failure to furnish return where tax sought to be evaded is significant",
  },
  {
    head: "Total Out-of-Pocket (typical, on-time filing)",
    range: "₹0 govt fee",
    note: "Filing the return itself carries no government fee — only penalties/interest if delayed",
    isTotal: true,
  },
];

const ItrBizGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Penalties &amp; Interest for Late / Non-Filing
          <span className="opc-govtcosts-badge">Statutory</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Filing your business ITR on time carries no government fee. Late-filing fees, interest, and audit penalties under the Income Tax Act apply only on delay or default and are over and above our professional fee — charged by the department at actuals.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Amount</th>
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

export default ItrBizGovtCosts;
