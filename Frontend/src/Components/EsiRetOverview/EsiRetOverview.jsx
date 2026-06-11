import React from "react";
import "./EsiRetOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

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
              Why ESI Return Filing Matters
            </h2>
            <p className="opc-intro-text">
              The Employees' State Insurance (ESI) scheme is a self-financing social-security and health-insurance scheme run by the ESIC under the ESI Act, 1948. Establishments with 10 or more employees (20 in some states) must register and file a monthly contribution return, depositing the employee (0.75%) and employer (3.25%) contributions for every worker earning up to ₹21,000 a month — by the 15th of the following month.
              <br /><br />
              Treating it casually is costly on two fronts. Late deposit attracts 12% per annum interest plus graded damages of 5%–25%, and persistent default can lead to a 45A determination and prosecution under Section 85. More importantly, ESI is your workers' gateway to medical care, sickness pay, maternity benefit, and disablement cover — and a worker not properly registered as an Insured Person simply cannot access it. Accurate monthly ESI filing protects both the employer's liability and the workforce's health security.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Compliant vs Non-Compliant Employer: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when ESI returns are filed accurately and on time versus left to lapse:
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
                <tr><td>Interest on Late Deposit</td><td>₹0 — paid by the 15th</td><td>12% p.a. on delayed dues</td></tr>
                <tr><td>Damages</td><td>None</td><td>5%–25% p.a. (Reg. 31C)</td></tr>
                <tr><td>Prosecution Risk</td><td>None — clean record</td><td>45A determination &amp; Sec 85 action</td></tr>
                <tr><td>Worker Medical Benefit</td><td>Active — IPs registered</td><td>Denied — workers uninsured</td></tr>
                <tr><td>Employer Liability on Injury</td><td>Covered by ESIC</td><td>Direct liability under Workmen laws</td></tr>
                <tr><td>Tender / Audit Compliance</td><td>Proof available</td><td>Disqualified at compliance check</td></tr>
                <tr><td>Employee Trust</td><td>High — benefits accessible</td><td>Grievances &amp; attrition</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EsiRetOverview;
