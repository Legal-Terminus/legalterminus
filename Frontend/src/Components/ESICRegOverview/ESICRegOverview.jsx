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
              Overview of ESI Registration
            </h2>
            <p className="pvt-intro-text">
              The Employees' State Insurance Act, 1948 is India's most comprehensive social security legislation for the organised workforce. It covers sickness, maternity, disability, and death risks for employees earning up to ₹21,000 per month. Once an establishment crosses 10 employees (or 20 in certain states), ESIC registration becomes mandatory — and the employer must contribute 3.25% of gross wages while the employee contributes 0.75%.
            </p>
            <p className="pvt-intro-text">
              ESIC is not just a compliance checkbox. It provides genuine value: unlimited medical care for the employee and family, 70% wage replacement during sickness, 90% of wages during permanent disability, and ₹10,000 funeral benefit. For employers, being ESIC-compliant signals a professional workplace — and avoids the heavy interest and damages that ESIC levies on non-compliant establishments.
            </p>
          </div>
        </div>
      </section>

      {/* CONTRIBUTION TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">ESI Contribution Structure &amp; Eligible Entities</h2>
          <p className="pvt-compare-subtitle">
            Current rates for FY 2025-26. Contributions are on gross wages (basic + DA + allowances).
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Detail</th>
                  <th>Employer</th>
                  <th>Employee</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contribution Rate</td>
                  <td>3.25% of gross wages</td>
                  <td>0.75% of gross wages</td>
                  <td>Revised periodically by ESIC</td>
                </tr>
                <tr>
                  <td>Wage Ceiling</td>
                  <td>Applicable up to ₹21,000/month</td>
                  <td>Applicable up to ₹21,000/month</td>
                  <td>₹25,000 for persons with disability</td>
                </tr>
                <tr>
                  <td>Low-wage exemption</td>
                  <td>Employer still contributes</td>
                  <td>Nil (if ≤ ₹137/day)</td>
                  <td>Employer's share always payable</td>
                </tr>
                <tr>
                  <td>Monthly due date</td>
                  <td colSpan="2">15th of the following month</td>
                  <td>Late payment = 12% p.a. interest</td>
                </tr>
                <tr>
                  <td>Contribution period</td>
                  <td colSpan="2">April–September / October–March</td>
                  <td>Bi-annual benefit periods follow</td>
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
