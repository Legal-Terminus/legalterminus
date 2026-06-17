import React from "react";
import "./PvtllpGovtCosts.css";

const rows = [
  {
    head: "MCA Filing Fee — Form FiLLiP + Form 18",
    range: "₹0 – ₹500",
    note: "₹0 for contribution up to ₹1 lakh; slab-based above",
  },
  {
    head: "Name Reservation (RUN-LLP / FiLLiP Part A)",
    range: "₹200 – ₹1,000",
    note: "Per attempt",
  },
  {
    head: "Stamp Duty — LLP Agreement (Form 3)",
    range: "₹500 – ₹5,000+",
    note: "State-based; varies by capital contribution",
  },
  {
    head: "Stamp Duty — Asset Transfer Agreement",
    range: "₹500 – ₹3,000+",
    note: "Supreme tier only (where needed beyond auto-vesting)",
  },
  {
    head: "Class 3 DSC (2-year) — per designated partner",
    range: "₹1,999 / person",
    note: "Existing director DSCs may carry over via DPIN",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued free with CoI",
  },
  {
    head: "GST Cancellation + Re-Registration",
    range: "₹0",
    note: "Free; only our consultancy charges",
  },
  {
    head: "Form 14 — Notice to ROC",
    range: "₹50 – ₹300",
    note: "MCA filing fee for intimation to ROC",
  },
  {
    head: "Affidavit + Notarisation",
    range: "₹500 – ₹1,500",
    note: "Multiple affidavits required",
  },
  {
    head: "Total Out-of-Pocket (typical, 2-shareholder company)",
    range: "₹5,000 – ₹15,000",
    note: "Mainly DSC + stamp duty on LLP Agreement",
    isTotal: true,
  },
];

const PvtllpGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per current MCA tariff + LLP Rules 2009 + State Stamp Duty schedules. These charges are over and above our professional fee — billed at actuals.
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

export default PvtllpGovtCosts;
