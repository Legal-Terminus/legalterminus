import React from "react";
import "./ProfTaxBenefits.css";

const ProfTaxBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Professional Tax Registration in India
          </h2>
          <p className="opcben-subtitle">
            PT registration is not just a legal obligation — it actively protects your business from penalties and builds a clean compliance track record.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Legal Compliance &amp; Penalty-Free Operations</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Registered employers operate under a valid EC and RC, eliminating exposure to retrospective assessment, prosecution, and compound penalties. A clean PT record avoids surprise demands during GST or income tax audits.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Lawful Salary Deduction from Employees</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Only a PT-registered employer with a valid RC can legally deduct PT from employee salaries. Without registration, the PT liability remains the employer's — payable out of your own pocket even if employees earn above the threshold.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Business Credibility &amp; Due Diligence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Investors, banks, and acquirers check PT compliance as part of due diligence. A missing EC or RC — and especially accumulated arrears — is a red flag that can delay funding rounds, loan approvals, or M&amp;A closings.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tax Deductibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under Section 16(iii) of the Income Tax Act, PT paid by an employee is deductible from gross salary for income tax computation. This small but real saving is available only if PT is correctly deducted and deposited.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">State Licensing &amp; Shop Establishment Link</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              In several states (Maharashtra, Karnataka, Tamil Nadu), PT registration is a prerequisite or a co-requirement for Shop &amp; Establishment renewal. An expired or missing PT certificate can block your shop license renewal.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Structured Payroll Compliance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Obtaining PT registration forces a clean payroll structure: salary slabs mapped to PT schedules, monthly deduction discipline, and an annual return reconciliation. This payroll hygiene reduces errors in PF, ESI, and TDS calculations too.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProfTaxBenefits;
