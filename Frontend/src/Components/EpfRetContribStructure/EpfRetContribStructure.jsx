import React from "react";
import "./EpfRetContribStructure.css";

// Monthly per-employee computation: statutory ceiling (₹15,000) vs an
// uncapped/actual-wage option (illustrated at ₹30,000 Basic + DA).
const rows = [
  {
    c: "Employee Contribution (Para 29) — 12%",
    capped: "₹1,800 MAX (12% of ₹15,000)",
    actual: "₹3,600 (12% of ₹30,000)",
  },
  {
    c: "Employer EPS portion (Para 3) — 8.33%",
    capped: "₹1,250 (capped at ₹15,000)",
    actual: "₹1,250 (EPS always capped at ₹15,000)",
  },
  {
    c: "Employer EPF portion (Para 29) — balance",
    capped: "₹550 (₹1,800 minus ₹1,250)",
    actual: "₹2,350 (₹3,600 minus ₹1,250)",
  },
  {
    c: "Total EMPLOYER Contribution = 12%",
    capped: "₹1,800 MAX (capped @ ₹15,000)",
    actual: "₹3,600 (12% on actual wages)",
  },
  {
    c: "EDLI Contribution (Section 6C) — 0.5%",
    capped: "₹75 MAX (capped at ₹15,000)",
    actual: "₹75 (EDLI always capped at ₹15,000)",
  },
  {
    c: "Admin Charges — EPF (Section 6A) — 0.5%",
    capped: "₹500 (min establishment level)",
    actual: "₹150 OR ₹500 (whichever higher)",
  },
  {
    c: "TOTAL DEPOSITED PER EMPLOYEE / MONTH",
    capped: "₹1,800 + ₹1,800 + ₹75 = ₹3,675",
    actual: "₹3,600 + ₹3,600 + ₹75 = ₹7,275",
    isTotal: true,
  },
  {
    c: "STATUTORY MAX (each side @ ₹15,000 ceiling)",
    capped: "₹1,800 each (Employee + Employer)",
    actual: "₹1,800 statutory cap + voluntary higher",
    isTotal: true,
  },
];

const EpfRetContribStructure = () => {
  return (
    <section className="opc-govtcosts-section epfret-contrib">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          EPF Contribution Structure (Monthly Computation)
        </h2>
        <p className="opc-govtcosts-subtitle">
          The statutory EPF wage ceiling under the EPF Scheme, 1952 and EPS, 1995 is ₹15,000
          per month. At this limit, the maximum mandatory PF contribution is ₹1,800 each from
          the employee and employer (12% of ₹15,000). While some employers contribute on actual
          Basic + DA wages, the EPS and EDLI contributions remain capped at the ₹15,000 wage ceiling.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Capped at ₹15,000 (Standard)</th>
                <th>Actual Wages = ₹30,000 (Uncapped option)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.c}</td>
                  <td>{row.capped}</td>
                  <td>{row.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EpfRetContribStructure;
