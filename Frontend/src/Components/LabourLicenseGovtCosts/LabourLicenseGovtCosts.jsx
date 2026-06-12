import React from "react";
import "./LabourLicenseGovtCosts.css";

const rows = [
  {
    head: "Contractor License – per worker",
    range: "Rs.20 – Rs.100 per worker (varies by State)",
    note: "Rs.30 – Rs.90 per worker",
  },
  {
    head: "Principal Employer Registration",
    range: "Rs.20 – Rs.100 per worker engaged",
    note: "Not applicable",
  },
  {
    head: "License Validity",
    range: "5 YEARS (OSH Code 2020) / 1 year (CLRA in transition states)",
    note: "Refundable on surrender",
  },
  {
    head: "Indicative total for 50-worker license",
    range: "~Rs.2,500 to Rs.5,000 fee",
    note: "~Rs.2,500 to Rs.4,500 deposit",
  },
  {
    head: "Annual Return Filing",
    range: "Nil (filing fee) / per State penalty if late",
    note: "Not applicable",
  },
  {
    head: "Amendment – Worker Scaling",
    range: "Differential per-worker fee",
    note: "Differential deposit",
  },
];

const LabourLicenseGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government Fees + Security Deposits
          <span className="opc-govtcosts-badge">At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per OSH Code 2020 + State Rules (or, in transition states, the existing CLRA Rules). Fees + deposits are billed at actuals and confirmed at filing.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Filing</th>
                <th>Government Fee Indicative</th>
                <th>Security Deposit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
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

export default LabourLicenseGovtCosts;
