import React from "react";
import "../IECGovtCosts/IECGovtCosts.css";

const rows = [
  {
    head: "Stamp Duty on Trust Deed",
    range: "Rs.500 - Rs.5,000",
    note: "State-specific; Maharashtra ~Rs.500, Karnataka ~Rs.1,000, others vary",
  },
  {
    head: "Sub-Registrar / Charity Commissioner Fee",
    range: "Rs.100 - Rs.1,500",
    note: "State-specific filing fee",
  },
  {
    head: "Notarisation",
    range: "Rs.100 - Rs.500",
    note: "Notary public + stamp paper charges",
  },
  {
    head: "Trust PAN Application",
    range: "Rs.107",
    note: "Issued by NSDL",
  },
  {
    head: "12A / 80G Filing (Form 10A / 10AB)",
    range: "Rs.0",
    note: "No government fee; we file as part of Enriched / Supreme",
  },
  {
    head: "NGO Darpan Registration",
    range: "Rs.0",
    note: "Free via ngodarpan.gov.in (Supreme tier)",
  },
  {
    head: "CSR-1 Filing (MCA)",
    range: "Rs.0",
    note: "No government fee (Supreme tier)",
  },
  {
    head: "Udyam Registration (Govt)",
    range: "Rs.0",
    note: "Government fee is GENUINELY NIL (Enriched / Supreme)",
  },
  {
    head: "GST Registration (Govt)",
    range: "Rs.0",
    note: "Government fee is GENUINELY NIL (Supreme tier)",
  },
];

const TrustGovtCosts = () => {
  return (
    <section className="iec-govtcosts-section">
      <div className="iec-govtcosts-container">
        <h2 className="iec-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="iec-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="iec-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts vary by state and selected plan.
        </p>

        <div className="iec-govtcosts-table-wrapper">
          <table className="iec-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.head}</td>
                  <td className="iec-govtcosts-range">{row.range}</td>
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

export default TrustGovtCosts;
