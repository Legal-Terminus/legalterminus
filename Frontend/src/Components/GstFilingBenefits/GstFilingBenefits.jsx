import React from "react";
import "./GstFilingBenefits.css";

const GstFilingBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Timely GST Return Filing
          </h2>
          <p className="opcben-subtitle">
            On-time, accurate GST returns are more than compliance — they protect your cash flow, unlock input credit, and keep your business credible with banks, buyers, and the department.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Late Fees &amp; 18% Interest</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Every day a return is late adds a fee (₹20–₹50/day), and unpaid tax accrues interest at 18% per annum. Filing on time eliminates both — a recurring saving that compounds across twelve filing periods a year.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Seamless Input Tax Credit</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Filing GSTR-3B in sync with a reconciled GSTR-2B lets you claim every eligible rupee of ITC and reverse what you can't. Clean, timely credit directly lowers your working-capital outflow each month.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Keeps Your GSTIN Active</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Continuous non-filing can lead to suspension or cancellation of your GST registration and blocking of e-way bills. Regular filing keeps your GSTIN active so you can invoice, move goods, and trade without interruption.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protects Your Buyers' Credit</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Your buyers can only claim ITC on your invoices once you've filed GSTR-1. Timely filing keeps your customers' credit flowing, strengthens B2B relationships, and makes you a preferred, dependable vendor.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Loan &amp; Tender Readiness</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, NBFCs, and tendering authorities review GST returns to gauge turnover and compliance. A clean, uninterrupted filing history improves creditworthiness and qualifies you for working-capital loans and government contracts.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Fewer Notices &amp; Scrutiny</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Mismatches between GSTR-1, GSTR-3B, and GSTR-2B are the leading trigger for departmental notices (DRC-01, scrutiny). Reconciled, accurate returns keep your record clean and reduce the risk of demands and audits.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default GstFilingBenefits;
