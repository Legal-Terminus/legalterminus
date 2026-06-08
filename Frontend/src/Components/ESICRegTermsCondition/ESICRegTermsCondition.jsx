import React from "react";
import "../PvtltdTermsCondition/PvtltdTermsCondition.css";

const ESICRegTermsCondition = () => {
  return (
    <section className="pvtltd-tc-section">
      <div className="pvtltd-tc-container">
        <div className="pvtltd-tc-card">

          <h2 className="pvtltd-tc-title">TERMS &amp; CONDITIONS</h2>

          <p className="pvtltd-tc-subtitle">
            By subscribing to any of the above plans, you agree to the following terms and conditions. Please read them carefully before proceeding.
          </p>

          <ol className="pvtltd-tc-list">
            <li className="pvtltd-tc-item">
              Government Fee: ESIC Registration government fee is NIL under the ESIC unified portal. Our fee covers professional services — advisory, Form 1 drafting, portal filing, Insurance Number (IP) generation, family declaration capture, and post-registration support.
            </li>
            <li className="pvtltd-tc-item">
              GST on Our Fee: All quoted prices are exclusive of GST @ 18%, charged at checkout.
            </li>
            <li className="pvtltd-tc-item">
              Mandatory Registration Trigger: ESIC Registration is mandatory under Section 1(5) of the ESI Act, 1948 once your non-seasonal establishment has 10 or more employees (20 in certain states — we verify on the discovery call). Registration must be filed within 15 days of crossing the threshold.
            </li>
            <li className="pvtltd-tc-item">
              Wage Threshold for Mandatory Coverage: Employees earning gross wages up to ₹21,000 / month are mandatorily covered under ESIC (₹25,000 for persons with disabilities). Employees earning above ₹21,000 are not covered, even if they want to opt in — the cap is statutory.
            </li>
            <li className="pvtltd-tc-item">
              Contribution Rates (FY 2025-26): Employer contribution 3.25% of gross wages. Employee contribution 0.75% of gross wages. Total 4% of gross wages, deducted monthly and remitted by the 15th of next month.
            </li>
            <li className="pvtltd-tc-item">
              Employee Capacity per Plan: Elemental covers IP generation for up to 10 employees. Enriched up to 10–30 employees. Supreme up to 30–50 employees. Additional employees beyond plan limits shall be decided upon negotiation.
            </li>
            <li className="pvtltd-tc-item">
              Monthly Compliance Out-of-Scope: Plans do NOT include ongoing monthly contribution filing (beyond the included first-1 walkthrough in Enriched / first-3 in Supreme), annual returns, grievance handling, benefit claim assistance for individual employees, Section 45A determination representation, or Inspector visits / inquiries. These are billed under our monthly Payroll Compliance retainer (starting ₹1,999 / month for ESIC only).
            </li>
            <li className="pvtltd-tc-item">
              Out-of-Scope Items: Sub-code registration for branches (quoted separately), inter-state contractor compliance, Atal Bimit Vyakti Kalyan Yojana / RGSKY claim assistance for terminated employees, ESIC inspection representation, Section 75 cases (Insurance Court matters), Section 85 prosecution defence, and conversion of exempted to unexempted establishment are not included and quoted separately on request.
            </li>
          </ol>

        </div>
      </div>
    </section>
  );
};

export default ESICRegTermsCondition;
