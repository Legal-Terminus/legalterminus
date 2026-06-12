import React from "react";
import "./CnllpGovtCosts.css";

const rows = [
  {
    head: "Name Reservation (RUN-LLP)",
    range: "₹200",
    note: "MCA fee to reserve the proposed new name through the RUN-LLP service",
  },
  {
    head: "Form 5 Filing Fee (Notice of Change)",
    range: "₹50 – ₹200",
    note: "Slab-based on the LLP's total contribution",
  },
  {
    head: "Form 3 Filing Fee (LLP Agreement)",
    range: "₹50 – ₹200",
    note: "For recording the supplementary LLP agreement reflecting the new name",
  },
  {
    head: "Stamp Duty (Supplementary Agreement)",
    range: "₹100 – ₹500",
    note: "State-specific stamp duty on the supplementary LLP agreement",
  },
  {
    head: "DSC (if expired / not available)",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate of designated partner to sign the forms",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹500 – ₹2,500",
    note: "Govt. fee billed at actuals; varies with contribution slab & documentation",
    isTotal: true,
  },
];

const CnllpGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The MCA name-reservation and form-filing fees are charged over and above our professional fee. The exact amount depends on the LLP's total contribution slab and state stamp duty — billed at actuals per the official MCA fee schedule.
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

export default CnllpGovtCosts;
