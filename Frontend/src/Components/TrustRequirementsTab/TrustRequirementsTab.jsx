import React from "react";
import "./TrustRequirementsTab.css";

const TrustRequirementsTab = () => {
  return (
    <section className="trust-req-section">
      <div className="trust-req-container">

        <header className="trust-req-header">
          <h2 className="trust-req-title">
            Benefits of Trust Registration in India
          </h2>
          <p className="trust-req-subtitle">
            Trust isn't just the cheapest non-profit setup - it's a structurally elegant instrument. Here's what genuinely matters once you're registered:
          </p>
        </header>

        <div className="trust-req-grid">

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">Tax Exemption (12A)</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Once registered under Section 12A of the Income Tax Act, the Trust's income is exempt from income tax (subject to applying 85%+ to charitable objects in the year). Without 12A, your 'non-profit' pays 30% income tax on surplus. The Enriched tier handles this via Form 10A.
            </p>
          </article>

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">Donor Tax Deduction (80G)</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Donors to your registered Trust can claim 50% (or 100% in select cases) deduction on their donations under Section 80G. This is the SINGLE BIGGEST driver of donations from individual and corporate donors. Without 80G, retail donor mobilisation is virtually impossible.
            </p>
          </article>

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">Perpetual Succession</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              The Trust (Public Trust) can hold property, sign contracts, sue and be sued, open bank accounts, all in its own name. Trustees come and go via Deed of Adherence; the Trust continues. Perpetual succession built into the Deed.
            </p>
          </article>

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">Lower Setup + Compliance Cost</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Trust setup is one of the cheapest non-profit options (Rs.5K - Rs.15K total) and ongoing compliance is lighter than Section 8 Company - no MGT-7 / AOC-4 / DIR-3 / mandatory MCA filings. Just income tax compliance + state-specific annual return where applicable.
            </p>
          </article>

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">CSR-Eligible (with CSR-1)</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Trusts with CSR-1 registration (Supreme tier) become eligible to receive CSR funds from Indian companies. The Indian CSR pool is Rs.25,000+ crore annually - and registered Trusts compete head-to-head with Section 8 Companies and Societies for these funds.
            </p>
          </article>

          <article className="trust-req-card">
            <h3 className="trust-req-card-title">Long-Term Mission Control</h3>
            <div className="trust-req-card-underline" />
            <p className="trust-req-card-text">
              Trust is the most founder-friendly non-profit structure - the Settlor's vision is enshrined in the Trust Deed, and trustees are bound by it. Unlike Society (member-driven) or Section 8 Company (board-driven), Trust gives the founder long-term control over the mission's direction.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default TrustRequirementsTab;
