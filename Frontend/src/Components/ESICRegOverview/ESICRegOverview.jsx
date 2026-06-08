import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import esicIllustration from "../../assets/whypvt-imp.svg";

const ESICRegOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* INTRO SECTION */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={esicIllustration}
              alt="ESIC Registration illustration"
              className="pvt-intro-illustration"
            />
          </div>
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Register for ESIC
            </h2>
            <p className="pvt-intro-text">
              ESIC Registration isn't optional once you cross 10 employees in a notified area. The Employees' State Insurance Act, 1948 was India's first social security legislation — it provides covered employees and their families with comprehensive medical care, cash benefits during sickness / maternity / disability, and dependants' benefits in case of employment-related death. For employers, ESIC compliance is a statutory must-do; for employees earning gross wages up to ₹21,000, it's a genuine social-security net that they often only realise the value of when they actually need it.
            </p>
            <p className="pvt-intro-text">
              ESIC contribution is also low for the employer — just 3.25% of gross wages. For that, your covered employees get free OPD + IPD care at ESIC dispensaries and hospitals for themselves and their family (spouse, parents, children), cash benefits during sickness (70% wages for up to 91 days), maternity benefits (100% wages for 26 weeks), disablement benefits (90% wages), dependants' benefits, and funeral expenses. Rupee-for-rupee, ESIC is one of the highest-value social-security contributions an employer makes.
            </p>
          </div>
        </div>
      </section>

      {/* CONTRIBUTION TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">ESIC Contribution &amp; Coverage: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Lower contribution, broader benefit. Here's the actual structure for FY 2025-26:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Detail</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mandatory Coverage Threshold</td>
                  <td>10+ employees in notified area</td>
                  <td>Section 1(5); 20+ in some states</td>
                </tr>
                <tr>
                  <td>Wage Coverage Limit</td>
                  <td>Gross wages up to ₹21,000/month</td>
                  <td>₹25,000 for persons with disabilities</td>
                </tr>
                <tr>
                  <td>Employer Contribution</td>
                  <td>3.25% of gross wages</td>
                  <td>On covered employees only</td>
                </tr>
                <tr>
                  <td>Employee Contribution</td>
                  <td>0.75% of gross wages</td>
                  <td>Deducted from monthly salary</td>
                </tr>
                <tr>
                  <td>Contribution Period</td>
                  <td>April–September; October–March</td>
                  <td>Half-yearly contribution periods</td>
                </tr>
                <tr>
                  <td>Monthly Remittance</td>
                  <td>By 15th of next month</td>
                  <td>Via ESIC challan</td>
                </tr>
                <tr>
                  <td>Half-Yearly Return</td>
                  <td>By 11 May / 11 November</td>
                  <td>Form 5 + 6 + 7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ESICRegOverview;
