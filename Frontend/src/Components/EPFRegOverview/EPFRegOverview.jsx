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
              EPF Registration isn't a strategy choice — it's a statutory trigger. The moment your establishment employs 20 or more persons (or 10+ in certain notified categories), the Employees' Provident Funds and Miscellaneous Provisions Act, 1952 kicks in. You have 30 days to register on the EPFO unified portal, after which delayed registration attracts damages under Section 14B and the EPFO can initiate suo-motu coverage proceedings.
            </p>
            <p className="pvt-intro-text">
              Beyond the compliance trigger, EPF is also a strategic talent-attraction tool. Sub-20 employers can voluntarily register under Section 1(4) — this signals professionalism to senior hires, retains talent through long-term wealth accumulation (EPF interest rate has historically beaten most other guaranteed instruments), and provides free EDLI life insurance coverage up to ₹7 lakh per employee. Smart employers register before they cross 20.
            </p>
          </div>
        </div>
      </section>

      {/* CONTRIBUTION TABLE */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">EPF Contribution Structure: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            The 12% you hear about is just the start. Here's the actual employer + employee split for FY 2025-26:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Employee</th>
                  <th>Employer</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EPF (Provident Fund)</td>
                  <td>12% of basic + DA</td>
                  <td>3.67% of basic + DA</td>
                  <td>Goes to employee's PF account</td>
                </tr>
                <tr>
                  <td>EPS (Pension)</td>
                  <td>Nil</td>
                  <td>8.33% of basic + DA (capped ₹15K wage)</td>
                  <td>Goes to pension fund</td>
                </tr>
                <tr>
                  <td>EDLI (Life Insurance)</td>
                  <td>Nil</td>
                  <td>0.50% of basic + DA (capped ₹15K wage)</td>
                  <td>Free life cover up to ₹7L</td>
                </tr>
                <tr>
                  <td>EPFO Admin Charges</td>
                  <td>Nil</td>
                  <td>0.50% of basic + DA (min ₹500)</td>
                  <td>EPFO's running cost</td>
                </tr>
                <tr>
                  <td>Total Contribution</td>
                  <td>12.00%</td>
                  <td>12.50% (effective ~13%)</td>
                  <td>On basic + DA, paid monthly via ECR</td>
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
