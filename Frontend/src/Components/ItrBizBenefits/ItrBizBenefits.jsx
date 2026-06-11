import React from "react";
import "./ItrBizBenefits.css";

const ItrBizBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Filing Your Business ITR on Time
          </h2>
          <p className="opcben-subtitle">
            A timely, accurate business return is more than a legal duty — it unlocks credit, preserves losses, and builds a clean financial record that follows your business everywhere.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Loan &amp; Credit Eligibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks and NBFCs ask for the last 2–3 years of ITRs as proof of income before sanctioning business loans, OD limits, or working capital. A consistent filing history with declared profits is the single strongest document in any business credit application.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Carry Forward Business Losses</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Filing your return by the due date lets you carry forward business losses and unabsorbed depreciation for up to 8 years to set off against future profits. Miss the deadline and that right — often worth lakhs in future tax — is lost permanently.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Penalties &amp; Interest</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              On-time filing eliminates the Section 234F late fee (up to ₹5,000), 234A/B/C interest on tax shortfalls, and the Section 271B audit penalty. For businesses, these statutory costs add up fast — timely filing keeps every rupee in the business.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Claim TDS Refunds</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Tax deducted by your clients and reflected in Form 26AS can only be claimed back by filing your return. Proper reconciliation ensures every rupee of TDS credit is recovered as a refund instead of sitting unclaimed with the department.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tender, Visa &amp; Tax-Clearance Proof</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Government tenders, foreign visa applications, and many vendor empanelments require recent ITRs as proof of income and compliance. A clean filing record keeps these opportunities open and your business credible with counterparties.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Audit-Ready Financial Record</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Returns reconciled with GST, 26AS, and AIS create a consistent, defensible financial trail. This reduces the chance of scrutiny notices and means that if questions ever arise, your numbers already tie out across every government system.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ItrBizBenefits;
