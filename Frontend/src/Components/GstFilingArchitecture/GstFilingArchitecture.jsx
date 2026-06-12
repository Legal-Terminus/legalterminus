import React from "react";
import "../GstFilingGovtCosts/GstFilingGovtCosts.css";

const rows = [
  { form: "GSTR-1", freq: "Monthly - 11th of next month (or quarterly under QRMP - 13th)", covers: "Outward supplies (sales invoice level data)" },
  { form: "GSTR-1A (Optional)", freq: "Between GSTR-1 filing and GSTR-3B", covers: "Last-minute amendment to fix GSTR-1 errors" },
  { form: "IFF (Invoice Furnishing Facility)", freq: "Monthly for QRMP filers - 13th of next month", covers: "B2B invoice upload during the first 2 months of quarter" },
  { form: "IMS Review", freq: "Continuous - before GSTR-3B filing", covers: "Accept / Reject / Pend supplier invoices in your purchase basket" },
  { form: "GSTR-2B", freq: "Auto-generated 14th of next month", covers: "Read-only ITC statement based on supplier filings + IMS actions" },
  { form: "GSTR-3B", freq: "Monthly - 20th of next month (or 22nd / 24th for QRMP by State)", covers: "Summary return + tax payment; Tables 3.1, 3.2 hard-locked" },
  { form: "GSTR-9 (Annual)", freq: "31 Dec of next FY", covers: "Consolidated annual return - all filers (T/O > Rs.2 Cr in practice)" },
  { form: "GSTR-9C (Reconciliation)", freq: "31 Dec of next FY", covers: "Self-certified reconciliation - T/O above Rs.5 Cr" },
  { form: "CMP-08 + GSTR-4 (Composition)", freq: "Quarterly + Annual", covers: "For composition scheme filers only" },
  { form: "GSTR-7 / GSTR-8", freq: "Monthly - 10th of next month", covers: "TDS / TCS deductors + e-commerce operators" },
];

const GstFilingArchitecture = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          GSTR-1 + GSTR-3B + IMS - The 2026 GST Return Filing Architecture
        </h2>
        <p className="opc-govtcosts-subtitle">
          Here&apos;s the 2026 monthly cycle for a regular (non-composition) GSTIN-holder:
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Form / Activity</th>
                <th>Frequency + Due Date</th>
                <th>What It Covers</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="opc-govtcosts-range">{row.form}</td>
                  <td>{row.freq}</td>
                  <td>{row.covers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default GstFilingArchitecture;
