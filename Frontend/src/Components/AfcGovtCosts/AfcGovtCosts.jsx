import React from "react";
import "./AfcGovtCosts.css";

const rows = [
  {
    capital: "Up to ₹1 lakh",
    fee: "₹200",
    late: "₹100 per day – NO CAP",
  },
  {
    capital: "₹1 lakh – ₹5 lakh",
    fee: "₹300",
    late: "₹100 per day – NO CAP",
  },
  {
    capital: "₹5 lakh – ₹25 lakh",
    fee: "₹400",
    late: "₹100 per day – NO CAP",
  },
  {
    capital: "₹25 lakh – ₹1 crore",
    fee: "₹500",
    late: "₹100 per day – NO CAP",
  },
  {
    capital: "Above ₹1 crore",
    fee: "₹600",
    late: "₹100 per day – NO CAP",
  },
];

const AfcGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government Fees – Company Annual Filings
          <span className="opc-govtcosts-badge">At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          AOC-4 + MGT-7 / MGT-7A Govt fees are SLAB-BASED by AUTHORISED SHARE CAPITAL. Late fees are ₹100/day per form with NO CAP (plus Section 403 additional fee multipliers). DIR-3 KYC has ₹5,000 mandatory penalty if late.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Authorised Share Capital</th>
                <th>AOC-4 / MGT-7 (per form)</th>
                <th>Late Fee</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.capital}</td>
                  <td className="opc-govtcosts-range">{row.fee}</td>
                  <td>{row.late}</td>
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
