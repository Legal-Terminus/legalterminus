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
              Why You Need Timely EPF Return Filing
            </h2>
            <p className="opc-intro-text">
              Under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, establishments employing 20 or more employees must comply with EPF regulations by deducting PF contributions, depositing contributions, paying applicable charges, and filing monthly ECR returns through the EPFO portal within the prescribed due date.
              <br /><br />
              Delayed EPF filing or payment can result in interest, penalties, departmental notices, compliance scrutiny, and difficulties during loans, investments, or tender processes. Continued non-compliance may also lead to legal action and prosecution.
              <br /><br />
              Apart from legal compliance, timely EPF return filing helps maintain employee trust and keeps your business records clean and verification-ready.
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
