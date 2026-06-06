import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import epfIllustration from "../../assets/whypvt-imp.svg";

const EPFRegOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* INTRO SECTION */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={epfIllustration}
              alt="EPF Registration illustration"
              className="pvt-intro-illustration"
            />
          </div>
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why EPF Registration Matters
            </h2>
            <p className="pvt-intro-text">
              Employee Provident Fund (EPF) registration is not just a legal obligation — it is the foundation of your relationship with every employee you hire. Under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, any establishment with 20 or more employees is mandated to register with EPFO. But beyond compliance, EPF signals organizational maturity: it improves talent retention, builds employee trust, and positions your business for smoother inspections and statutory audits.
            </p>
            <p className="pvt-intro-text">
              The EPF Act creates a three-scheme framework: the Employees' Provident Fund Scheme (savings), the Employees' Pension Scheme (EPS), and the Employees' Deposit-Linked Insurance Scheme (EDLI). Each operates through the same 12% + 12% contribution model but allocates funds differently across retirement savings, pension, and life cover. Understanding this structure upfront saves employers from costly payroll errors that compound over years.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON / CONTRIBUTION TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">EPF Contribution Breakdown</h2>
          <p className="pvt-compare-subtitle">
            Where does each rupee of contribution go? The full picture for employers and employees:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Employer Share</th>
                  <th>Employee Share</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EPF (PF Account)</td>
                  <td>3.67% of Basic</td>
                  <td>12% of Basic</td>
                  <td>Retirement Savings</td>
                </tr>
                <tr>
                  <td>EPS (Pension Scheme)</td>
                  <td>8.33% (capped ₹15K basic)</td>
                  <td>Nil</td>
                  <td>Monthly Pension</td>
                </tr>
                <tr>
                  <td>EDLI (Insurance)</td>
                  <td>0.5% (max ₹75/month)</td>
                  <td>Nil</td>
                  <td>Life Cover up to ₹7L</td>
                </tr>
                <tr>
                  <td>EPF Admin Charges</td>
                  <td>0.5% (min ₹500/month)</td>
                  <td>Nil</td>
                  <td>EPFO Administration</td>
                </tr>
                <tr>
                  <td>Total Contribution</td>
                  <td>~13% of Basic</td>
                  <td>12% of Basic</td>
                  <td>Combined</td>
                </tr>
                <tr>
                  <td>Applicability</td>
                  <td colSpan="2">20+ Employees (Mandatory) | &lt;20 (Voluntary)</td>
                  <td>Basic salary ≤ ₹15,000/month mandatory</td>
                </tr>
                <tr>
                  <td>ECR Filing Due Date</td>
                  <td colSpan="2">15th of every month</td>
                  <td>Delay = 12% p.a. interest</td>
                </tr>
                <tr>
                  <td>Interest on EPF Balance</td>
                  <td colSpan="2">8.25% p.a. (FY 2024–25)</td>
                  <td>Tax-free up to ₹2.5L/year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EPFRegOverview;
