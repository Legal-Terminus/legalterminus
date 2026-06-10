import React from "react";
import "./BCGovtCosts.css";

const rows = [
  {
    head: "GS1 India Annual Subscription (1–9 GTINs)",
    range: "₹5,000 – ₹10,000 / year",
    note: "Smallest prefix; suitable for 1–9 product variants",
  },
  {
    head: "GS1 India Annual Subscription (10–99 GTINs)",
    range: "₹10,000 – ₹20,000 / year",
    note: "Mid-size prefix; suitable for growing product catalogues",
  },
  {
    head: "GS1 India Annual Subscription (100–999 GTINs)",
    range: "₹20,000 – ₹50,000 / year",
    note: "Larger prefix for brands with multiple SKUs",
  },
  {
    head: "GS1 Annual Renewal Fee",
    range: "Same as initial subscription",
    note: "Mandatory every year; non-renewal deactivates all GTINs",
  },
  {
    head: "Late Renewal Penalty",
    range: "Up to 50% of subscription",
    note: "Penalty levied by GS1 India for delayed annual renewal",
  },
  {
    head: "Total Out-of-Pocket (typical, 10–99 GTINs)",
    range: "₹10,000 – ₹25,000 / year",
    note: "GS1 annual subscription + GST; varies by prefix tier",
    isTotal: true,
  },
];

const BCGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative GS1 India Subscription &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          GS1 India subscription fees are charged over and above our professional fee. Actual amounts depend on the number of GTINs (product barcodes) you need and are billed at actuals.
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

export default BCGovtCosts;
