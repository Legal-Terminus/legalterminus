import React from "react";
import "../LabourLicenseGovtCosts/LabourLicenseGovtCosts.css";

const rows = [
  { param: "License threshold (workers)", old: "20 contract workers", neu: "50 contract workers (RAISED)" },
  { param: "License validity", old: "1 year (annual renewal)", neu: "5 YEARS (extended)" },
  { param: "License coverage", old: "Separate license per establishment", neu: "Single license for all establishments" },
  { param: "Principal Employer Registration", old: "Required under Section 7", neu: "Required under Section 45" },
  { param: "Welfare obligations", old: "Section 16-19 (CLRA)", neu: "Section 24 (OSH Code) - consolidated" },
  { param: "Filing portal", old: "State Labour Dept (mostly offline)", neu: "Shram Suvidha Portal (single window)" },
  { param: "Inter-State Migrant Workmen", old: "Separate ISMW Act 1979", neu: "Chapter XI - OSH Code (integrated)" },
  { param: "Construction workers", old: "Separate BOCW Act 1996", neu: "Selected provisions in OSH Code + BOCW Cess continues" },
  { param: "Penalty - Unlicensed Engagement", old: "Up to Rs.1,000 + 3 months prison (Sec 24)", neu: "Up to Rs.1 lakh + 6 months prison (Ch XIII)" },
  { param: "Joint liability of PE", old: "Wage payment under Section 21", neu: "Wages + welfare under OSH Code Section 17" },
];

const LabourLicenseReform = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          OSH Code 2020 - Contract Labour Reform: The Deep Dive
        </h2>
        <p className="opc-govtcosts-subtitle">
          Here&apos;s how the 2026 Labour Code regime compares to the old CLRA Act 1970 regime:
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Old CLRA Act 1970</th>
                <th>New OSH Code 2020</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.param}</td>
                  <td>{row.old}</td>
                  <td className="opc-govtcosts-range">{row.neu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default LabourLicenseReform;
