import React from "react";
import "../OPCOverview/OPCOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const ProfTaxOverview = () => {
  return (
    <div className="opc-full-wrapper">

      {/* SECTION 1 — INTRO */}
      <section className="opc-intro-section">
        <div className="opc-intro-container">
          {/* Illustration */}
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Professional Tax overview illustration"
              className="opc-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              What is Professional Tax?
            </h2>
            <p className="opc-intro-text">
              Professional Tax (PT) is a direct tax levied by state governments on individuals earning income through employment, professions, trades, callings, or businesses. It is one of the oldest taxes in India — authorized under Article 276 of the Constitution — and is constitutionally capped at ₹2,500 per person per year.
              <br /><br />
              Despite its name, Professional Tax applies to salaried employees (not just professionals). Every employer is legally obligated to deduct PT from employee salaries per the applicable state slab and remit it to the state government. Self-employed professionals, sole proprietors, and partners of firms must also register and pay PT independently through an "Enrolment Certificate."
              <br /><br />
              Non-compliance carries compounding penalties — ₹1,000/month in Maharashtra, ₹50/day in Karnataka — and can result in recovery proceedings against the employer personally. Registration is mandatory from Day 1 of hiring, not when payroll crosses a threshold.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — STATE COMPARISON TABLE */}
      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Professional Tax Slabs — State Comparison</h2>
          <p className="opc-compare-subtitle">
            PT slabs, due dates, and filing frequency differ significantly across states. Here's a quick reference:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Max PT / Year</th>
                  <th>Filing Frequency</th>
                  <th>Applies To</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Maharashtra</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Employees</td></tr>
                <tr><td>Karnataka</td><td>₹2,400</td><td>Monthly</td><td>Employers; Annual for Self-Employed</td></tr>
                <tr><td>Andhra Pradesh</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Self-Employed</td></tr>
                <tr><td>Telangana</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Self-Employed</td></tr>
                <tr><td>Tamil Nadu</td><td>₹2,500</td><td>Half-Yearly</td><td>Employers &amp; Self-Employed</td></tr>
                <tr><td>West Bengal</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Employees</td></tr>
                <tr><td>Gujarat</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Self-Employed</td></tr>
                <tr><td>Kerala</td><td>₹2,400</td><td>Half-Yearly</td><td>Employers &amp; Professionals</td></tr>
                <tr><td>Assam</td><td>₹2,500</td><td>Monthly</td><td>Employers &amp; Employees</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfTaxOverview;
