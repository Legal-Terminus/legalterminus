import React from "react";
import "./IacapGovtCosts.css";

const rows = [
  {
    head: "MCA Fee on Increased Capital (SH-7)",
    range: "Slab-based",
    note: "Government fee on the amount of increase, per the MCA capital fee schedule",
  },
  {
    head: "Stamp Duty on Increased Capital",
    range: "0.15% – 0.25% (varies)",
    note: "State-specific stamp duty charged on the increase in authorised capital",
  },
  {
    head: "Form MGT-14 (if AOA altered)",
    range: "₹300 – ₹600",
    note: "Required only where the AOA must be amended to permit the increase",
  },
  {
    head: "Form PAS-3 (if shares allotted)",
    range: "₹300 – ₹600",
    note: "Return of allotment, filed when fresh shares are actually issued",
  },
  {
    head: "DSC (if expired / not available)",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate of director required to sign the e-forms",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "Depends on increase amount",
    note: "Driven mostly by the stamp duty &amp; MCA fee on the increase — billed at actuals",
    isTotal: true,
  },
];

const IacapGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          The biggest cost in a capital increase is the MCA fee and state stamp duty calculated on the amount of the increase, not a flat fee. These are charged over and above our professional fee and confirmed at filing — billed at actuals per the MCA schedule and the applicable state stamp law.
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

export default IacapGovtCosts;
