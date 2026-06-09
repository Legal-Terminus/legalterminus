import React from "react";
import "./ProfTaxOverview.css";
import illustration from "../../assets/whypvt-imp.svg";

const ProfTaxOverview = () => {
  return (
    <div className="opc-full-wrapper">

      {/* SECTION 1 — INTRO */}
      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Professional Tax Registration illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Professional Tax Registration Matters
            </h2>
            <p className="opc-intro-text">
              Professional Tax (PT) is a state-level tax levied under Article 276 of the Constitution on individuals who earn income through employment, trade, or profession. Contrary to the name, it is not restricted to professionals — any person earning a salary above the state-prescribed threshold is liable to pay PT, and every employer is obligated to deduct and deposit it monthly.
              <br /><br />
              Non-registration is not an option once you cross the salary threshold — penalties compound quickly (1%–2% per month) and state tax authorities are increasingly active in enforcement, especially post-GST rollout. For employers, PT registration is a day-1 compliance requirement: you need the Employer Certificate (EC) before your first payroll run, and the Employee Certificate (RC) before you deduct PT from any employee's salary.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — COMPARISON TABLE */}
      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">PT vs No Registration: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you delay or skip Professional Tax Registration:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Registered (EC + RC)</th>
                  <th>Not Registered</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Status</td><td>Compliant under state PT Act</td><td>In violation; liable to prosecution</td></tr>
                <tr><td>Employee Deduction</td><td>Lawfully deducted from salary</td><td>Cannot deduct — employer pays from pocket</td></tr>
                <tr><td>Penalty Exposure</td><td>None (if returns filed on time)</td><td>1%–2% per month + interest + arrears</td></tr>
                <tr><td>GST / IT Audit Risk</td><td>Low (compliance shown)</td><td>Higher — non-PT flags non-compliance</td></tr>
                <tr><td>Bank / Investor Scrutiny</td><td>Clean compliance record</td><td>Demerits in due diligence checks</td></tr>
                <tr><td>Return Filing</td><td>Monthly challan + annual return</td><td>Retrospective filing + penalty + interest</td></tr>
                <tr><td>Setup Cost (total)</td><td>₹2,000 – ₹10,000</td><td>₹5,000 – ₹50,000+ (arrears + penalties)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProfTaxOverview;
