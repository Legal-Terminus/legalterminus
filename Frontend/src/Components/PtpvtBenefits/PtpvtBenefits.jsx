import React from "react";
import "./PtpvtBenefits.css";

const PtpvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting a Partnership Firm to a Private Limited Company
          </h2>
          <p className="opcben-subtitle">
            Converting unlocks everything a partnership cannot offer a growing business — limited liability, a separate legal identity, priced equity, ESOPs, and a structure built to scale.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              In a partnership, partners are personally liable for the firm's debts without limit. As a Private Limited Company, liability is capped at the shares each shareholder holds — your personal assets are shielded from business risk, the single biggest reason firms convert.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Separate Legal Entity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A company is a separate legal person that can own property, sue and be sued, and contract in its own name — independent of its shareholders. A partnership has no such identity apart from its partners, which limits how it can hold assets and enter agreements.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Raise Equity &amp; VC Funding</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A Private Limited Company has share capital, so it can issue equity to angels, VCs, and PE funds and run priced rounds or convertible instruments. A partnership firm has no shares to offer, so this route to institutional capital is simply unavailable to it.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A company continues to exist regardless of changes in its shareholders or directors. A partnership can be disrupted by a partner's exit, retirement, or death — converting gives the business continuity and a stable foundation for long-term growth and succession.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Issue ESOPs &amp; Credibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Companies can grant ESOPs to attract and retain talent and carry far greater credibility with investors, banks, and large customers than a partnership firm. Converting signals that the business is ready for institutional capital and serious partnerships.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Business Continuity &amp; Tax Options</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Through the Section 366 route the firm's business, assets, and contracts carry into the new company without interruption. As a company, the business can also pursue DPIIT Startup India recognition and the concessional corporate tax rate under Section 115BAA.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PtpvtBenefits;
