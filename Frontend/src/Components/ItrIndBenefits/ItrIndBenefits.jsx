import React from "react";
import "./ItrIndBenefits.css";

const ItrIndBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Filing Your ITR on Time
          </h2>
          <p className="opcben-subtitle">
            Filing your personal income tax return is more than a legal duty — it puts your own money back in your pocket and builds the financial record that opens doors to loans, visas, and bigger refunds.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Faster, Bigger Tax Refunds</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              If TDS was deducted from your salary, interest, or freelance income, filing your ITR is the only way to claim it back. Accurate filing with full deduction claims means a larger refund — credited faster when the return is filed and e-verified early.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easy Loan &amp; Credit Card Approval</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks and NBFCs ask for 2–3 years of ITRs as proof of income before approving home loans, personal loans, and high-limit credit cards. A consistent filing record is often the difference between approval and rejection.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Visa &amp; Travel Documentation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Embassies for the US, UK, Schengen, Canada, and Australia routinely ask for recent ITRs to assess your financial stability. A clean filing history strengthens your visa application and speeds up approval.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Penalties &amp; Notices</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Timely filing eliminates the Section 234F late fee (up to ₹5,000) and 234A interest, and a return reconciled with your AIS keeps you off the scrutiny radar. Staying compliant is far cheaper than responding to a notice later.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Carry Forward Your Losses</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Capital losses from shares, mutual funds, or property can be carried forward up to 8 years to offset future gains — but only if you file your return by the due date. For investors, this single benefit can save substantial tax in profitable years.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Proof of Income &amp; Net Worth</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For the self-employed, freelancers, and professionals, your ITR is the most credible proof of income — useful for renting property, buying insurance, applying for tenders, and building a documented financial track record over time.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ItrIndBenefits;
