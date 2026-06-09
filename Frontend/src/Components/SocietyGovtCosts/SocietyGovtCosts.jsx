import React from "react";
import "../IECGovtCosts/IECGovtCosts.css";

const rows = [
  {
    head: "Registrar of Societies Filing Fee",
    range: "Rs.50 - Rs.500",
    note: "State-specific; Delhi ~Rs.50, Maharashtra ~Rs.100, Karnataka ~Rs.500",
  },
  {
    head: "Stamp Paper for MoA + Rules",
    range: "Rs.100 - Rs.500",
    note: "State-specific stamp duty on MoA + Rules & Regulations",
  },
  {
    head: "Notarisation + Affidavits",
    range: "Rs.300 - Rs.1,000",
    note: "Notary fees + affidavit stamp paper for 7 members",
  },
  {
    head: "Society PAN",
    range: "Rs.107",
    note: "Issued by NSDL after registration",
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
  {
    head: "DSC (if portal requires)",
    range: "Rs.1,999",
    note: "Some state portals + GST e-filing may require Class 3 DSC",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "Rs.500 - Rs.3,000",
    note: "Mostly Registrar fee + stamp paper + notarisation",
  },
];

const SocietyGovtCosts = () => {
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

export default SocietyGovtCosts;
