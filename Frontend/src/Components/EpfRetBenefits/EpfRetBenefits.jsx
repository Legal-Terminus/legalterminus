import React from "react";
import "./EpfRetBenefits.css";

const EpfRetBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Timely EPF Return Filing
          </h2>
          <p className="opcben-subtitle">
            Filing EPF returns on time is more than statutory compliance — it shields the employer from steep interest and damages, keeps tax deductions intact, and protects your employees' retirement savings.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid 7Q Interest &amp; 14B Damages</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Late deposit of PF dues attracts interest at 12% per annum under Section 7Q plus damages of 5%–25% under Section 14B. Depositing by the 15th every month eliminates both — a recurring saving that protects the establishment's cash flow.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Preserve Your Tax Deduction</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Employer PF contributions are deductible only if deposited by the due date — late payment can be disallowed under Section 43B, increasing your taxable income. Timely filing keeps this legitimate business deduction fully intact.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smooth Employee Withdrawals</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              When contributions are filed accurately against seeded UANs, employees can withdraw, take advances, and transfer their PF without friction. Clean monthly filing directly translates into fewer grievances and higher employee trust.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stay Off the EPFO Radar</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Persistent default or under-reporting can trigger an inquiry and assessment under Section 7A, with recovery, interest, and damages. A consistent, accurate filing history keeps your establishment out of EPFO enforcement action.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Employee Insurance &amp; Pension Cover</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              EPF filing also funds EPS (pension) and EDLI (life insurance up to ₹7 lakh) for your members at no extra cost to them. Timely contributions keep these valuable social-security benefits active for your entire workforce.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Audit &amp; Tender Readiness</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A clean PF compliance record is checked in statutory audits, labour inspections, and government/PSU tenders that require proof of EPF compliance. Up-to-date returns keep your establishment qualified and audit-ready year-round.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default EpfRetBenefits;
