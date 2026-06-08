import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "Maharashtra (Gumasta)",
    range: "₹120 – ₹1,500",
    notes: "Lifetime (one-time)",
  },
  {
    head: "Karnataka (S&CE Cert)",
    range: "₹250 – ₹2,500",
    notes: "5 years",
  },
  {
    head: "Delhi (SHOP & ESTABLISHMENT Cert)",
    range: "₹500 – ₹5,000",
    notes: "Annual renewal",
  },
  {
    head: "Tamil Nadu (SHOP & ESTABLISHMENT)",
    range: "₹50 – ₹1,500",
    notes: "Annual renewal",
  },
  {
    head: "Telangana (SHOP & ESTABLISHMENT)",
    range: "₹100 – ₹2,000",
    notes: "Annual renewal",
  },
  {
    head: "Odisha (S&CE)",
    range: "₹50 – ₹500",
    notes: "3 years",
  },
  {
    head: "Gujarat (SHOP & ESTABLISHMENT)",
    range: "₹50 – ₹2,500",
    notes: "1–3 years",
  },
  {
    head: "West Bengal (SHOP & ESTABLISHMENT)",
    range: "₹250 – ₹5,000",
    notes: "1 year",
  },
  {
    head: "DSC (if required)",
    range: "₹0 – ₹1,999",
    notes: "Some state portals require digital signing",
    isTotal: true,
  },
];

const ShopGovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative State Government Fees
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          Government fees vary by state, employee count, and establishment type. Paid directly to the State Labour Department; reimbursed at actuals.
        </p>

        <div className="govtcosts-table-wrapper">
          <table className="govtcosts-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Govt Fee Range</th>
                <th>Validity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className={row.isTotal ? "govtcosts-range" : ""}>{row.range}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ShopGovtCosts;
