import React from "react";
import "./PvtllpGovtCosts.css";

const rows = [
  {
    head: "DSC for Designated Partners",
    range: "₹1,000 – ₹2,000 each",
    note: "Digital Signature Certificates for the designated partners of the LLP",
  },
  {
    head: "DPIN / Name Reservation (FiLLiP / RUN-LLP)",
    range: "₹200 – ₹1,000",
    note: "MCA fee to allot DPIN and reserve the proposed LLP name",
  },
  {
    head: "MCA Fees — Form 18 + FiLLiP",
    range: "Slab-based",
    note: "Government fees on conversion & LLP incorporation, by capital-contribution slab",
  },
  {
    head: "LLP Agreement Stamp Duty + Form 3",
    range: "₹500 – ₹5,000+",
    note: "State-specific stamp duty on the LLP agreement and the Form 3 filing fee",
  },
  {
    head: "Charge Satisfaction (if any)",
    range: "Case-specific",
    note: "Fees to clear / satisfy any subsisting charges before conversion (CHG-4 etc.)",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹3,000 – ₹15,000",
    note: "Varies with capital contribution, state stamp duty & pending charges — billed at actuals",
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
          Conversion of a company into an LLP runs through Form 18 with FiLLiP and the LLP agreement in Form 3. The MCA fees, DSC, DPIN, and stamp duty on the LLP agreement are over and above our professional fee — billed at actuals per the official MCA schedule and applicable state stamp law. Any subsisting charges on the company's assets must be satisfied before the application.
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
