import React from "react";
import "./IECAdjacentRegs.css";

const rows = [
  { reg: "IEC", issuedBy: "DGFT", requiredFor: "All exports / imports / foreign-currency receipts", govtFee: "Rs.500 (one-time)" },
  { reg: "AD Code", issuedBy: "Your Bank", requiredFor: "Linking bank account to IEC on ICEGATE customs portal", govtFee: "Rs.0 - Rs.2,500" },
  { reg: "RCMC", issuedBy: "Export Promotion Council", requiredFor: "Claiming RoDTEP / Advance Auth / EPCG / MEIS legacy", govtFee: "Rs.5K - Rs.15K" },
  { reg: "RoDTEP Scrips Account", issuedBy: "DGFT / ICEGATE", requiredFor: "Receiving Remission of Duties & Taxes credits", govtFee: "Rs.0" },
  { reg: "EPCG / Advance Auth", issuedBy: "DGFT", requiredFor: "Duty-free import of capital goods / inputs for export", govtFee: "Application-specific" },
  { reg: "GSTIN (for exports)", issuedBy: "GSTN", requiredFor: "Filing LUT (Letter of Undertaking) for export without IGST", govtFee: "Rs.0" },
  { reg: "BIS / EPR / FSSAI etc.", issuedBy: "Sectoral", requiredFor: "Product-specific export approvals (chemicals, food etc.)", govtFee: "Sector-specific" },
];

const IECAdjacentRegs = () => {
  return (
    <section className="iec-adjregs-section">
      <div className="iec-adjregs-container">
        <h2 className="iec-adjregs-title">IEC + Adjacent Registrations: The Deep Dive</h2>
        <p className="iec-adjregs-subtitle">
          IEC alone gets you started. The full export / import compliance stack typically needs 3-4 more pieces fitted together. Here's the 2026 map:
        </p>

        <div className="iec-adjregs-table-wrapper">
          <table className="iec-adjregs-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Issued By</th>
                <th>Required For</th>
                <th>Govt Fee</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="iec-adjregs-reg">{row.reg}</td>
                  <td>{row.issuedBy}</td>
                  <td>{row.requiredFor}</td>
                  <td className="iec-adjregs-fee">{row.govtFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default IECAdjacentRegs;
