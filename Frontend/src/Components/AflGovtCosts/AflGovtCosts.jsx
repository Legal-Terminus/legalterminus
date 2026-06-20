import React from "react";
import "./AflGovtCosts.css";

const slabRows = [
  { contribution: "Up to ₹1 lakh", form11: "₹50", form8: "₹50" },
  { contribution: "₹1 lakh – ₹5 lakh", form11: "₹100", form8: "₹100" },
  { contribution: "₹5 lakh – ₹10 lakh", form11: "₹150", form8: "₹150" },
  { contribution: "Above ₹10 lakh", form11: "₹200", form8: "₹200" },
  { contribution: "LLP ITR-5", form11: "NIL Govt fee", form8: "Belated return = Sec 234F penalty" },
];

const lateRows = [
  { delay: "Up to 15 days", small: "1x normal fee", other: "1x normal fee" },
  { delay: "15 – 30 days", small: "2x normal fee", other: "2x normal fee" },
  { delay: "30 – 60 days", small: "4x normal fee", other: "8x normal fee" },
  { delay: "60 – 90 days", small: "6x normal fee", other: "12x normal fee" },
  { delay: "90 – 180 days", small: "10x normal fee", other: "20x normal fee" },
  { delay: "180 – 360 days", small: "15x normal fee", other: "30x normal fee" },
  { delay: "Beyond 360 days (Form 11 / 8)", small: "15x + ₹10/day continuing", other: "30x + ₹20/day continuing" },
];

const AflGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <h2 className="opc-govtcosts-title">
          Normal Government Filing Fees — Form 11 + Form 8
          <span className="opc-govtcosts-badge">Slab by Contribution</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          MCA government filing fees for Form LLP-11 and Form LLP-8 are slab-based on the LLP's total contribution. Billed at actuals — over and above our professional fee.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>LLP Contribution</th>
                <th>Form 11 Fee</th>
                <th>Form 8 Fee</th>
              </tr>
            </thead>
            <tbody>
              {slabRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.contribution}</td>
                  <td className="opc-govtcosts-range">{row.form11}</td>
                  <td>{row.form8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="afl-second-table">
          <h2 className="opc-govtcosts-title">
            Late Fee Multiplier Table
            <span className="opc-govtcosts-badge">LLP Amendment Rules 2022</span>
          </h2>
          <p className="opc-govtcosts-subtitle">
            Per Rule 5, Annexure A. Small LLP = Contribution up to ₹25 LAKH AND Turnover up to ₹40 LAKH (both conditions). Other LLP = anything bigger. Multiplier applied to the NORMAL filing fee:
          </p>

          <div className="opc-govtcosts-table-wrapper">
            <table className="opc-govtcosts-table">
              <thead>
                <tr>
                  <th>Days of Delay</th>
                  <th>Small LLP Multiplier</th>
                  <th>Other LLP Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {lateRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.delay}</td>
                    <td className="opc-govtcosts-range">{row.small}</td>
                    <td>{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AflGovtCosts;
