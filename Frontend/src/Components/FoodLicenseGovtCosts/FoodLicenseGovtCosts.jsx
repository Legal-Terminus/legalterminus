import React from "react";
import "./FoodLicenseGovtCosts.css";

const rows = [
  {
    head: "FSSAI Basic Registration Fee",
    range: "₹100 / year",
    note: "For FBOs with annual turnover < ₹12 lakhs; valid for 1–5 years",
  },
  {
    head: "State FSSAI License Fee",
    range: "₹2,000 – ₹5,000 / year",
    note: "Varies by business category (manufacturer, trader, restaurant, etc.) and state",
  },
  {
    head: "Central FSSAI License Fee",
    range: "₹7,500 / year",
    note: "Standard Central License; higher slabs (up to ₹75,000/year) for large manufacturers",
  },
  {
    head: "Late Renewal Penalty",
    range: "₹100 / day",
    note: "Per FSSAI regulations — applies if renewal filed within 30 days before expiry",
  },
  {
    head: "Modification / Amendment Fee",
    range: "₹1,000 – ₹7,500",
    note: "Depending on license type and nature of change (address, product category, etc.)",
  },
  {
    head: "Total Out-of-Pocket (typical, State License)",
    range: "₹2,000 – ₹5,000 / year",
    note: "Govt. fee billed at actuals per FSSAI tariff; varies by state and FBO category",
    isTotal: true,
  },
];

const FoodLicenseGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          FSSAI government fees are charged over and above our professional fee. Actual amounts depend on your business type, turnover slab, and state — billed at actuals per official FSSAI tariff.
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

export default FoodLicenseGovtCosts;
