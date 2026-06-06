import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";
import "./IncorporationGovtCosts.css";

const rows = [
  {
    head: "SPICe+ Filing Fee",
    indian: "₹0 (≤ ₹15L)",
    foreign: "₹0 (≤ ₹15L)",
  },
  {
    head: "RUN Name Reservation",
    indian: "₹1,000 / attempt",
    foreign: "₹1,000 / attempt",
  },
  {
    head: "Stamp Duty on MOA/AOA (State wise vary)",
    indian: "₹500 – ₹12,600",
    foreign: "₹500 – ₹12,600",
  },
  {
    head: "Class 3 DSC (per person)",
    indian: "₹1,999 (3 persons)",
    foreign: "₹1,999 (3 persons)",
  },
  {
    head: "Apostille / Notarization",
    indian: null,
    foreign: "₹15,000 – ₹40,000",
  },
  {
    head: "AD-Bank FIRC + KYC",
    indian: null,
    foreign: "₹2,000 – ₹8,000",
  },
  {
    head: "FC-GPR (RBI FIRMS portal)",
    indian: null,
    foreign: "₹0 (govt fee NIL)",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    indian: "₹6,500 – ₹17,000",
    foreign: "₹22,000 – ₹65,000",
    isTotal: true,
  },
];

const IncorporationGovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container wos-govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          These are estimated government and out-of-pocket costs charged over and above our professional fee. Actual amounts may vary by state, director count, and parent jurisdiction.
        </p>

        <div className="govtcosts-table-wrapper">
          <table className="govtcosts-table wos-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Indian-Parent WOS</th>
                <th>Foreign-Parent WOS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className={row.isTotal ? "govtcosts-range" : "wos-cost-val"}>
                    {row.indian ?? <span className="wos-na">Not applicable</span>}
                  </td>
                  <td className={row.isTotal ? "govtcosts-range" : "wos-cost-val"}>
                    {row.foreign ?? <span className="wos-na">Not applicable</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default IncorporationGovtCosts;
