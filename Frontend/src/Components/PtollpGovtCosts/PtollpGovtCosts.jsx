import React from "react";
import "./PtollpGovtCosts.css";

const rows = [
  {
    head: "DSC for Designated Partners",
    range: "₹1,000 – ₹2,000 each",
    note: "Digital Signature Certificates required for the designated partners",
  },
  {
    head: "Name Reservation (RUN-LLP)",
    range: "₹200",
    note: "MCA fee to reserve the proposed LLP name",
  },
  {
    head: "FiLLiP + Form 17 Filing Fees",
    range: "Slab-based",
    note: "MCA fees on incorporation & conversion, based on the LLP's total contribution",
  },
  {
    head: "Form 3 (LLP Agreement) + Stamp Duty",
    range: "₹50 – ₹200 + duty",
    note: "Filing fee plus state stamp duty on the LLP agreement",
  },
  {
    head: "CA Certification (Assets & Liabilities)",
    range: "Professional charge",
    note: "Statement of assets & liabilities certified by a Chartered Accountant",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹2,000 – ₹8,000",
    note: "Govt. fees & stamp duty billed at actuals; varies by contribution & state",
    isTotal: true,
  },
];

const PtollpGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The MCA fees for FiLLiP, Form 17, and Form 3, the DSC cost, and stamp duty on the LLP agreement are charged over and above our professional fee. The exact amount depends on the LLP's total contribution and the applicable state stamp duty — billed at actuals per the official MCA schedule.
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

export default PtollpGovtCosts;
