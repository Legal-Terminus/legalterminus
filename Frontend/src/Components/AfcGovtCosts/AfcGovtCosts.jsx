import React from "react";
import "./AfcGovtCosts.css";

const rows = [
  {
    head: "AOC-4 / MGT-7 Normal Filing Fee",
    range: "₹300 – ₹600 per form",
    note: "MCA government fee based on the company's authorised share capital slab",
  },
  {
    head: "Late Filing Additional Fee",
    range: "₹100 / day per form",
    note: "Levied per day of delay for AOC-4 and MGT-7, with no upper ceiling",
  },
  {
    head: "ADT-1 (Auditor Appointment) Fee",
    range: "₹300 – ₹600",
    note: "Filed within 15 days of the AGM appointing/ratifying the statutory auditor",
  },
  {
    head: "DIR-3 KYC",
    range: "₹0 (on time) / ₹5,000",
    note: "Nil if filed by 30 September; ₹5,000 penalty per director if the DIN is deactivated",
  },
  {
    head: "DPT-3 / MSME-1 Filing Fee",
    range: "₹300 – ₹600 each",
    note: "Slab-based MCA fee for return of deposits and MSME outstanding dues returns",
  },
  {
    head: "Total Out-of-Pocket (typical, on-time)",
    range: "₹2,000 – ₹5,000 / year",
    note: "Govt. fees billed at actuals; varies by authorised capital — penalties apply only on delay",
    isTotal: true,
  },
];

const AfcGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          MCA government filing fees are charged over and above our professional fee. Actual amounts depend on your company's authorised share capital and the forms filed — billed at actuals per the official MCA fee schedule. Late filing attracts ₹100 per day, per form, with no maximum cap.
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

export default AfcGovtCosts;
