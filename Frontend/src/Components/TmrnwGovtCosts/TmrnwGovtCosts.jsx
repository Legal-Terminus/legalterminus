import React from "react";
import "./TmrnwGovtCosts.css";

const rows = [
  {
    head: "Renewal Fee (Form TM-R)",
    range: "₹9,000 / class",
    note: "E-filing fee to renew a registered trademark for a further 10 years, per class",
  },
  {
    head: "Surcharge — Grace-Period Renewal",
    range: "₹4,500 / class",
    note: "Additional fee when renewing within 6 months after the expiry date",
  },
  {
    head: "Restoration + Renewal (Form TM-R)",
    range: "₹9,000 + restoration fee",
    note: "Where the mark has been removed; restoration is possible within 1 year of expiry",
  },
  {
    head: "Per Additional Class",
    range: "Same fee × classes",
    note: "Renewal fees apply separately for each class in which the mark is registered",
  },
  {
    head: "Renewal Validity",
    range: "10 years",
    note: "Each renewal extends protection by another 10 years; renewable indefinitely",
  },
  {
    head: "Total Out-of-Pocket (typical, 1 class)",
    range: "₹9,000 – ₹13,500",
    note: "Govt. fee billed at actuals; surcharge applies only for grace-period/restoration",
    isTotal: true,
  },
];

const TmrnwGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Trademark renewal government fees are charged over and above our professional fee. The amount depends on the number of classes and whether the renewal is on time, within the grace period, or requires restoration — billed at actuals per the official IP India fee schedule.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
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

export default TmrnwGovtCosts;
