import React from "react";
import "./EsiRetOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const contribStructure = [
  {
    component: "Employee Contribution (0.75%)",
    rate: "0.75% of GROSS WAGES (covered IPs only)",
    exA: "₹112.50 (rounded ₹113)",
    exB: "₹150",
  },
  {
    component: "Employer Contribution (3.25%)",
    rate: "3.25% of GROSS WAGES (covered IPs only)",
    exA: "₹487.50 (rounded ₹488)",
    exB: "₹650",
  },
  {
    component: "TOTAL ESI Contribution per IP (4%)",
    rate: "Combined Employee + Employer",
    exA: "₹600 (per IP per month)",
    exB: "₹800 (per IP per month)",
  },
  {
    component: "Coverage Eligibility",
    rate: "Gross wages ≤ ₹21,000 (₹25,000 differently-abled)",
    exA: "Covered",
    exB: "Covered",
  },
  {
    component: "If Wage > ₹21,000",
    rate: "Not covered (with mid-period continuation rule)",
    exA: "N/A",
    exB: "N/A",
  },
];

const EsiRetOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="ESI Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why You Need Timely ESI Return Filing
            </h2>
            <p className="opc-intro-text">
              The Employees' State Insurance (ESI) Act, 1948 requires eligible establishments to register under ESI and deposit monthly contributions for covered employees. Generally, establishments employing 10 or more employees must comply with ESI regulations for employees earning up to ₹21,000 per month. ESI provides valuable benefits such as medical care, sickness, maternity, disability, and dependent benefits for employees and their families.
              <br /><br />
              Under the ESI scheme, employees contribute 0.75% of wages and employers contribute 3.25%, making the total contribution 4% of wages. Contributions must be deposited through the ESIC portal by the 15th of the following month. Delayed or incorrect filing may result in interest, penalties, compliance notices, recovery proceedings, and disruption of employee benefits.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">ESI Contribution Structure (Monthly Computation)</h2>
          <p className="opc-compare-subtitle">
            ESI's contribution structure is different from EPF's — the wage ceiling (₹21,000) is a COVERAGE THRESHOLD, not a contribution cap. Employees earning gross wages up to ₹21,000 (or ₹25,000 if differently-abled) are COVERED + contributions are computed on ACTUAL GROSS WAGES (not capped at ₹21,000). Employees earning above ₹21,000 are NOT covered — subject to the mid-period continuation rule. Here's how the monthly contribution breaks down:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Rate / Calculation</th>
                  <th>Example A: Gross Wage = ₹15,000</th>
                  <th>Example B: Gross Wage = ₹20,000</th>
                </tr>
              </thead>
              <tbody>
                {contribStructure.map((row, i) => (
                  <tr key={i}>
                    <td>{row.component}</td>
                    <td>{row.rate}</td>
                    <td>{row.exA}</td>
                    <td>{row.exB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EsiRetOverview;
