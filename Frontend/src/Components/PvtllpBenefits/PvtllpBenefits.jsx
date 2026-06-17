import React from "react";
import "./PvtllpBenefits.css";

const PvtllpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting a Private Limited Company to an LLP
          </h2>
          <p className="opcben-subtitle">
            Conversion keeps your limited-liability protection while removing the heaviest parts of company compliance — mandatory audit, board formalities, and dividend tax.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">No Mandatory Annual Audit</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A Private Limited Company must be audited every year regardless of turnover. An LLP needs a statutory audit only once turnover crosses ₹40 lakh or capital contribution crosses ₹25 lakh — a direct saving for smaller, profitable businesses.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Far Lighter ROC Compliance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An LLP files just two annual forms — Form 8 (Statement of Account &amp; Solvency) and Form 11 (Annual Return). There are no board meetings, no AOC-4 / MGT-7, and minimal event-based filings, cutting both effort and professional cost.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tax-Efficient Profit Withdrawal</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An LLP pays no dividend distribution tax, and a partner's share of profit is exempt in their hands under Section 10(2A). Partner remuneration and interest on capital are also deductible within limits — making profit extraction cleaner than dividends.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability Retained</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              You keep the core protection of the corporate form. An LLP is a separate legal entity with perpetual succession, and the partners' liability stays limited to their agreed contribution — your personal assets remain shielded from business debts.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Flexible Management</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An LLP is governed by a private LLP agreement rather than the rigid framework of the Companies Act. Partners decide profit sharing, roles, and decision-making freely, and there is no cap on the number of partners — ideal for owner-run and family businesses.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Lower Cost of Running the Entity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Between the removed audit, fewer filings, and simpler governance, the annual cost of maintaining an LLP is significantly lower than a Private Limited Company — while the business continues seamlessly with the same assets, contracts, and team.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PvtllpBenefits;
