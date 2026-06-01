import React from "react";
import "./LLPRequirementsTab.css";

const RequirementsLlp = () => {
  return (
    <section className="llp-req-section">
      <div className="llp-req-container">
        {/* Heading + intro */}
        <header className="llp-req-header">
          <h2 className="llp-req-title">
            Benefits of Limited Liability Partnership Registration in India
          </h2>
          <p className="llp-req-subtitle">
            LLP is not just a normal partnership with extra protection. It is designed for businesses that want flexibility in managing partners along with limited liability like a company. Here's what you actually get:
          </p>
        </header>

        {/* Cards */}
        <div className="llp-req-grid">
          {/* 1 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">Limited Partner Liability</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              Each partner's liability is capped at their agreed contribution. One partner's misconduct doesn't bankrupt the others. Personal assets — house, savings, vehicles — stay protected from LLP debts.
            </p>
          </article>

          {/* 2 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">Separate Legal Entity</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              The LLP can sign contracts, hold property, sue and be sued, and open bank accounts in its own name. Partners come and go — the LLP continues. Perpetual succession built in.
            </p>
          </article>

          {/* 3 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">No Minimum Capital</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              Start with ₹1 if you want. The LLP Act, 2008 imposes no minimum contribution. Capital can be added later via supplementary LLP Agreement + Form 3 amendment, no special resolution required.
            </p>
          </article>

          {/* 4 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">Tax Pass-Through Benefit</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              LLPs are taxed at 30% flat at the entity level. After tax, partners can withdraw profits as 'share of profit' under Section 10(2A) — fully tax-exempt in their hands. No double taxation, no DDT equivalent.
            </p>
          </article>

          {/* 5 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">Small LLP Compliance Relief</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              If contribution ≤ ₹25L AND turnover ≤ ₹40L, you qualify as a Small LLP. Benefits: 50% lower MCA filing fees, no mandatory statutory audit, simplified Form 11. Annual compliance cost ~₹10K vs ₹30K+ for regular LLP.
            </p>
          </article>

          {/* 6 */}
          <article className="llp-req-card">
            <h3 className="llp-req-card-title">FDI &amp; Foreign Partner Friendly</h3>
            <div className="llp-req-card-underline" />
            <p className="llp-req-card-text">
              LLPs are eligible for FDI under the automatic route in most sectors (subject to FEMA conditions). Foreign individuals and entities can be partners. Cleaner than a foreign-subsidiary Pvt Ltd for many cross-border partnership structures.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsLlp;
