import React from "react";
import "./TmarkGovtCosts.css";

const rows = [
  {
    applicant: "Individual / Sole Proprietor (in personal name)",
    fee: "₹4,500",
    note: "50% rebate vs corporate filers",
  },
  {
    applicant: "Startup (DPIIT-recognised)",
    fee: "₹4,500",
    note: "Requires DPIIT Recognition Certificate",
  },
  {
    applicant: "Small Enterprise (Udyam MSME-registered)",
    fee: "₹4,500",
    note: "Requires valid Udyam Certificate",
  },
  {
    applicant: "Companies / LLPs / Partnerships (non-MSME / non-Startup)",
    fee: "₹9,000",
    note: "Default rate; no rebate",
  },
  {
    applicant: "Opposition Filing (Form TM-O)",
    fee: "₹2,700 per class",
    note: "Counter-statement separate",
  },
  {
    applicant: "Renewal (Form TM-R) — after 10 years",
    fee: "₹9,000 (or ₹4,500 with rebate)",
    note: "Same rebate logic applies",
  },
  {
    applicant: "Restoration (Form TM-R) — if renewal missed",
    fee: "₹4,500 surcharge added",
    note: "Within grace period",
  },
  {
    applicant: "50% REBATE — Individual / DPIIT Startup / Udyam MSME",
    fee: "₹4,500 vs ₹9,000 per class",
    note: "Material saving across multi-class",
  },
];

const TmarkGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government Fees
          <span className="opc-govtcosts-badge">Per Class — Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per First Schedule of the Trade Marks Rules, 2017. E-FILING IS THE STANDARD AND RECOMMENDED PATH — physical filing, while technically still listed in the First Schedule, is essentially obsolete in 2026 practice (we file ONLY via the IP India online portal). Fees are per class — multi-class filings are multiplicative:
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Applicant Type</th>
                <th>E-Filing (per class)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.applicant}</td>
                  <td className="opc-govtcosts-range">{row.fee}</td>
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

export default TmarkGovtCosts;
