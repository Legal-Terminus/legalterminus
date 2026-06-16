import React from "react";
import "./PtopvtBenefits.css";

const PtopvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting to a Private Limited Company
          </h2>
          <p className="opcben-subtitle">
            Moving from a proprietorship to a Pvt Ltd is a structural upgrade — it shields your personal assets, opens the door to equity funding, and gives your business the credibility and continuity to scale.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The single biggest gain — your personal assets are insulated from business debts and litigation. Shareholders' liability is limited to their unpaid share capital, so a business setback can no longer reach your home, savings, or personal property.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Raise Equity from Investors</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Angels, VCs, and PE funds invest in private limited companies, not proprietorships. Converting makes your business able to issue shares, take on equity, and use convertible instruments — the structure every serious fundraise requires.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Issue ESOPs &amp; Attract Talent</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A Pvt Ltd can grant Employee Stock Option Plans, letting you reward and retain key people with equity instead of just salary. This is a powerful, low-cash way to build a strong team that a proprietorship simply cannot offer.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A proprietorship ends with its owner; a company does not. A Pvt Ltd has perpetual succession — it continues regardless of changes in shareholders or directors, protecting the business, its contracts, and its brand for the long term.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Credibility, Banking &amp; Tenders</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered company carries far more weight with banks, vendors, and large customers. Audited financials and a corporate identity improve loan access, win bigger contracts, and qualify you for tenders that proprietorships cannot bid for.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Business Continuity on Conversion</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Section 366 route carries the proprietorship's business, contracts, and operations into the new company through the conversion mechanism — a cleaner transition than winding up the proprietorship and transferring every asset separately.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PtopvtBenefits;
