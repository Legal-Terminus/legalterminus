import React from "react";
import "../PvtltdRequirementsTab/PvtltdRequirementsTab.css";

const EPFRegBenefits = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">
            Benefits of EPF Registration in India
          </h2>
          <p className="req-subtitle">
            EPF registration creates value on both sides of the employer-employee relationship — from statutory compliance and talent retention on the employer's side, to retirement security and emergency cover on the employee's side.
          </p>
        </header>

        <div className="req-grid">

          <article className="req-card">
            <h3 className="req-card-title">Financial Security in Retirement</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              EPF creates a substantial retirement corpus through compound interest over an employee's working life. The accumulated fund — supplemented by the 8.25% annual interest rate (FY 2024–25) — provides income security when regular employment income ceases. Withdrawal after 5 years of service is fully tax-exempt.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Life Cover via EDLI Scheme</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              The Employees' Deposit-Linked Insurance Scheme provides life insurance coverage of up to ₹7 lakh to the nominee in case of the employee's death during active service — at no additional cost to the employee. This is an underappreciated benefit that most employees are unaware of at the time of joining.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Monthly Pension via EPS</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              8.33% of the employer's 12% contribution is directed to the Employees' Pension Scheme. After 10 years of continuous service, employees become eligible for a monthly pension post-retirement. In case of the employee's death, the family receives pension benefits — making EPF a life-stage protection tool, not just a savings account.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Portable UAN Across Employers</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              A Universal Account Number (UAN) is assigned to every EPF member and follows them across all employers throughout their career. PF balances transfer automatically on job change — eliminating paperwork and the common problem of dormant, abandoned PF accounts with previous employers.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Emergency Withdrawal Provisions</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              EPF allows partial withdrawals for medical emergencies, marriage, home purchase, higher education, and pre-retirement needs under specific EPFO rules. The fund acts as a structured financial safety net for employees beyond its primary retirement savings purpose — accessible during life's critical junctures.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Tax Efficiency Under Section 80C</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Employee contributions up to ₹1.5 lakh per year qualify for Section 80C deduction. Interest earned on EPF balances up to ₹2.5 lakh per year is tax-free for private sector employees. On retirement or resignation after 5 continuous years, the entire EPF withdrawal — principal + interest — is tax-exempt.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default EPFRegBenefits;
