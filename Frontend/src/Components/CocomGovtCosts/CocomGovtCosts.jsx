import React from "react";
import "./CocomGovtCosts.css";

const rows = [
  {
    head: "Form MGT-14 Filing Fee",
    range: "₹300 – ₹600",
    note: "MCA fee to file the special resolution altering the object clause; by capital slab",
  },
  {
    head: "Updated MOA Stamp Duty",
    range: "₹200 – ₹1,000",
    note: "State-specific stamp duty on the altered Memorandum of Association",
  },
  {
    head: "Late Filing Fee (if delayed)",
    range: "2x – 12x of fee",
    note: "Additional MCA fee if MGT-14 is filed beyond the 30-day deadline",
  },
  {
    head: "DSC (if expired / not available)",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate of director required to sign the e-form",
  },
  {
    head: "Professional Certification",
    range: "Professional charge",
    note: "Certification of the e-form by a practising CS / CA, where required",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹500 – ₹2,500",
    note: "Govt. fee billed at actuals; varies with authorised capital & state stamp duty",
    isTotal: true,
  },
];

const CocomGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The MCA filing fee for MGT-14 and the stamp duty on the altered MOA are charged over and above our professional fee. The exact amount depends on the company's authorised share capital and the applicable state stamp duty — billed at actuals per the official MCA fee schedule.
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

export default CocomGovtCosts;
