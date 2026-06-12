import React from "react";
import "./IacapBenefits.css";

const IacapBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Increasing Authorised Capital
          </h2>
          <p className="opcben-subtitle">
            Raising your authorised capital gives the company the legal headroom to issue more shares — unlocking fresh investment, a stronger balance sheet, and the flexibility to grow without compliance bottlenecks.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Room to Raise Fresh Capital</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              With a higher authorised limit, the company can issue new shares to investors or promoters whenever needed. You are no longer capped, so a funding round can close without waiting weeks to first expand the limit.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Investment-Ready Cap Table</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Investors expect the company to be able to allot shares the moment terms are agreed. Having sufficient authorised capital signals readiness and avoids the last-minute scramble that can sour or delay a deal.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stronger Balance Sheet &amp; Net Worth</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Issuing more equity off a higher authorised base boosts paid-up capital and net worth, improving the company's financial standing for banks, lenders, and large customers who assess capital adequacy.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easier Loans &amp; Tenders</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Many banks and tendering authorities look at a company's capital base as a measure of scale and stability. A higher capital strengthens loan eligibility and helps qualify for higher-value tenders and credit limits.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Convert Loans into Equity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Promoter loans and director advances can be converted into shares only if there is room under the authorised limit. Increasing it enables clean loan-to-equity conversions that de-leverage the company and reward early backers.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Flexibility for Future Growth</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Setting a comfortable authorised capital ahead of need means you can issue ESOPs, bring in partners, or fund expansion without repeating the process each time — saving repeated filings, fees, and lead time.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IacapBenefits;
