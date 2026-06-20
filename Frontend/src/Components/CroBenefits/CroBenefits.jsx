import React from "react";
import "../OPCBenefits/OPCBenefits.css";

const CroBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Why Company Registration Matters
          </h2>
          <p className="opcben-subtitle">
            A registered company is governed by the Companies Act, 2013 — needing a minimum of 2 members
            and 2 directors (up to 200 members and 15 directors), with no minimum capital requirement.
            Beyond compliance, registration gives your business real, lasting advantages:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Separate Legal Identity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered company operates independently from its owners. It can own property, open bank
              accounts, sign contracts, and sue or be sued in its own name — keeping the business and the
              individual cleanly separated.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Shareholders' personal assets are protected from the company's debts and liabilities. Your
              exposure is limited to the capital you invest, so personal savings and property stay shielded
              if the business runs into trouble.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Access to Government Schemes</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered company can tap schemes like Startup India (tax benefits and funding) and Make
              in India (manufacturing incentives), as well as Startup Odisha support — opportunities that
              are largely closed to unregistered businesses.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Increased Credibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Registration builds trust with investors, clients, and vendors. A company with a CIN and a
              Certificate of Incorporation finds it far easier to win contracts, onboard customers, and
              raise funding than an informal setup.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A company continues to exist regardless of changes in its owners or directors. Shares can
              change hands and management can move on, but the entity — its contracts, assets, and history
              — carries on without interruption.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easier to Raise Capital</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered structure makes it simpler to bring in investors, issue shares, and secure bank
              funding. Clear ownership, audited accounts, and statutory filings give lenders and investors
              the confidence to back your business.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default CroBenefits;
