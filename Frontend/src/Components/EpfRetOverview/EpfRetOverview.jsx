import React from "react";
import "./EpfRetOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const EpfRetOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="EPF Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why EPF Return Filing Matters
            </h2>
            <p className="opc-intro-text">
              The Employees' Provident Fund (EPF) is a retirement-savings scheme run by the EPFO under the EPF &amp; MP Act, 1952. Any establishment employing 20 or more persons must register and then file a monthly return — the ECR (Electronic Challan-cum-Return) — declaring each member's wages and depositing the employee (12%) and employer (12%) contributions, along with EDLI and admin charges, by the 15th of the following month.
              <br /><br />
              Treating it as optional is expensive. Late deposit attracts interest at 12% per annum under Section 7Q and graded damages of 5%–25% under Section 14B — and PF dues, being a trust on employee money, carry serious personal liability for the employer. Beyond the penalties, delayed or inaccurate filing stalls members' withdrawals, transfers, and insurance claims. Accurate monthly EPF compliance protects both the establishment and its employees' hard-earned savings.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Compliant vs Non-Compliant Employer: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when EPF returns are filed accurately and on time versus left to lapse:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Compliant Employer</th>
                  <th>Non-Compliant Employer</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Interest on Late Deposit</td><td>₹0 — paid by the 15th</td><td>12% p.a. under Section 7Q</td></tr>
                <tr><td>Damages</td><td>None</td><td>5%–25% p.a. under Section 14B</td></tr>
                <tr><td>Employer Liability</td><td>Discharged each month</td><td>Personal liability for PF dues</td></tr>
                <tr><td>Employee Withdrawals</td><td>Smooth — KYC seeded</td><td>Blocked by missing/mismatched data</td></tr>
                <tr><td>EPFO 7A Inquiry</td><td>Unlikely — clean record</td><td>Assessment, recovery &amp; damages</td></tr>
                <tr><td>Tax Deduction (Sec 36/43B)</td><td>Allowed — paid on time</td><td>Disallowed if not deposited by due date</td></tr>
                <tr><td>Employee Trust</td><td>High — dues visible in passbook</td><td>Grievances &amp; attrition</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EpfRetOverview;
