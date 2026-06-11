import React from "react";
import "./AflGovtCosts.css";

const rows = [
  {
    head: "Form 11 / Form 8 Normal Filing Fee",
    range: "₹50 – ₹200 per form",
    note: "MCA government fee based on the LLP's total contribution slab",
  },
  {
    head: "Late Filing Additional Fee",
    range: "₹100 / day per form",
    note: "Levied per day of delay for Form 11 and Form 8, with no upper ceiling",
  },
  {
    head: "DIR-3 KYC (Designated Partners)",
    range: "₹0 (on time) / ₹5,000",
    note: "Nil if filed by 30 September; ₹5,000 penalty per partner if the DIN is deactivated",
  },
  {
    head: "Tax Audit (if applicable)",
    range: "Separate CA fee",
    note: "Required only if turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh",
  },
  {
    head: "Event-Based Filing (Form 3 / Form 4)",
    range: "₹50 – ₹200 each",
    note: "Slab-based MCA fee for changes in partners, contribution, or LLP agreement",
  },
  {
    head: "Total Out-of-Pocket (typical, on-time)",
    range: "₹500 – ₹2,000 / year",
    note: "Govt. fees billed at actuals; varies by contribution — penalties apply only on delay",
    isTotal: true,
  },
];

const AflGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          MCA government filing fees are charged over and above our professional fee. Actual amounts depend on your LLP's total contribution and the forms filed — billed at actuals per the official MCA fee schedule. Late filing attracts ₹100 per day, per form, with no maximum cap.
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

export default AflGovtCosts;
