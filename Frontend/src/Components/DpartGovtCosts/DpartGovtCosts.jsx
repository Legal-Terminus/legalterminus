import React from "react";
import "./DpartGovtCosts.css";

const rows = [
  {
    head: "Dissolution Deed Stamp Duty",
    range: "₹100 – ₹1,000",
    note: "State-specific stamp duty on the dissolution deed; varies by state",
  },
  {
    head: "Notarisation",
    range: "₹200 – ₹1,000",
    note: "Notary charges for the dissolution deed and any affidavits",
  },
  {
    head: "Registrar of Firms Notice",
    range: "₹0 – ₹500",
    note: "Nominal fee to record the notice of dissolution (for a registered firm)",
  },
  {
    head: "Public Notice Publication",
    range: "₹1,000 – ₹5,000",
    note: "Newspaper publication cost for the public notice of dissolution",
  },
  {
    head: "PAN / GST Surrender",
    range: "₹0 govt fee",
    note: "Cancellation of the firm's PAN and GST registration carries no government fee",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹1,500 – ₹7,000",
    note: "Stamp duty, notary &amp; publication billed at actuals; varies by state",
    isTotal: true,
  },
];

const DpartGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Dissolving a partnership firm has no heavy government filing fee — the main costs are state stamp duty on the deed, notarisation, and newspaper publication of the public notice. These are charged over and above our professional fee and billed at actuals.
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

export default DpartGovtCosts;
