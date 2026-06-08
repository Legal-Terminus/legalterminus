import React from "react";
import "./IECGovtCosts.css";

const rows = [
  { head: "IEC Application Fee (DGFT)", range: "Rs.500", note: "One-time govt fee; no renewal fee" },
  { head: "IEC Annual Update Fee", range: "Rs.0", note: "Annual update is free if done in April-June window" },
  { head: "Late Update Fee (if missed)", range: "Rs.0", note: "No fee, but IEC gets deactivated until updated" },
  { head: "DSC for Authorized Signatory (if not having a valid DSC)", range: "Rs.1,999", note: "Class 3 DSC - required for entities; optional for proprietorship using Aadhaar OTP" },
  { head: "ICEGATE registration", range: "Rs.0", note: "No fee, for ICEGATE registration" },
  { head: "AD Code Registration", range: "Rs.0", note: "No fee, for AD code Registration" },
];

const IECGovtCosts = () => {
  return (
    <section className="iec-govtcosts-section">
      <div className="iec-govtcosts-container">
        <h2 className="iec-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="iec-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="iec-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee. Actual amounts may vary by plan and applicable scheme.
        </p>

        <div className="iec-govtcosts-table-wrapper">
          <table className="iec-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.head}</td>
                  <td className="iec-govtcosts-range">{row.range}</td>
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

export default IECGovtCosts;
