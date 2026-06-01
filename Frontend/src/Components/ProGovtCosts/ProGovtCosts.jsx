import React from "react";
import "./ProGovtCosts.css";

const rows = [
  { head: "MSME / Udyam Registration", range: "₹0", note: "Government fee is NIL; instant online via udyamregistration.gov.in" },
  { head: "GST Registration (Govt)", range: "₹0", note: "Government fee is NIL" },
  { head: "Shop & Establishment Act", range: "₹100 – ₹4,000", note: "State-based; Maharashtra ₹100-2,500, Karnataka up to ₹3,000+" },
  { head: "FSSAI Basic Licence (Food only)", range: "₹100 / year", note: "Required if turnover ≤ ₹12L (food businesses)" },
  { head: "IEC Code (Importer-Exporter)", range: "₹500", note: "DGFT one-time fee; lifetime validity" },
  { head: "Total Out-of-Pocket (typical)", range: "₹600 – ₹8,000", note: "Depends on activity; freelancers low-end, retailers high-end", isTotal: true },
];

const ProGovtCosts = () => {
  return (
    <section className="govtcosts-section">
      <div className="govtcosts-container">
        <h2 className="govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by state and activity type.
        </p>
        <div className="govtcosts-table-wrapper">
          <table className="govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="govtcosts-range">{row.range}</td>
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

export default ProGovtCosts;
