import React from "react";
import "./PtollpBenefits.css";

const PtollpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting to an LLP
          </h2>
          <p className="opcben-subtitle">
            An LLP gives a partnership the corporate shield it lacks — limited liability and a separate legal identity — while keeping the operational flexibility and lighter compliance that make it ideal for professional and family-run firms.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability for Partners</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The single biggest gain — each partner's liability is limited to their agreed contribution. Personal assets are protected from the firm's debts, and crucially, a partner is not liable for the wrongful acts or negligence of another partner.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Separate Legal Entity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An LLP is a body corporate distinct from its partners. It can own property, hold contracts, open accounts, and sue or be sued in its own name — giving the business a stable legal identity that a partnership firm never has.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Unlike a partnership that changes or dissolves when a partner exits, an LLP continues uninterrupted regardless of changes among its partners. The business, its contracts, and its assets are protected for the long term.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Seamless Asset Transfer</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Through the Section 55 route, all the firm's assets and liabilities pass to the LLP automatically by operation of law — no separate sale deeds, no stamp duty on each asset. The transition is clean, fast, and tax-efficient compared to winding up and re-incorporating.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Lighter Compliance Than a Company</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An LLP files only two annual MCA forms — Form 11 and Form 8 — and requires a statutory audit only if turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh. The compliance burden is materially lighter than a private limited company's.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Credibility &amp; Flexibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered LLP is taken more seriously by banks, vendors, and clients than an informal partnership, while the LLP agreement still lets partners freely structure profit-sharing, roles, and management — combining corporate credibility with partnership flexibility.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PtollpBenefits;
