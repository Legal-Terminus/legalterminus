import React from "react";
import "./GstFilingBenefits.css";

const GstFilingBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of GST Return Filing in India
          </h2>
          <p className="opcben-subtitle">
            Timely, accurate GST returns aren&apos;t compliance overhead - they&apos;re the foundation of cash flow, ITC claims, and customer trust. Here&apos;s what disciplined GST return filing delivers:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Full ITC Claim - No Money Left on the Table</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Accurate GSTR-1 + GSTR-2B reconciliation + IMS discipline ensures you claim EVERY rupee of Input Tax Credit you're entitled to. Under the 2026 hard-locking regime, mismatched / missing invoices = ITC permanently lost. Our reconciliation discipline preserves your working capital.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Late-Fee Zero (and Interest Zero)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GSTR-1 + GSTR-3B late fees compound fast - Rs.50 / day (capped per turnover slab) PLUS 18% p.a. interest on tax dues. For a regular filer with Rs.50 lakh / month turnover, even a 1-week delay can cost Rs.5,000-Rs.10,000 + interest. We file on time, every time - the cheapest insurance you can buy.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Compliance Rating + Refund Speed</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              GST's compliance rating system (Section 149 CGST Act) tracks return-filing discipline. Higher rating = faster refund processing, lower audit risk, smoother registration amendments. Refunds for exporters / inverted-duty filers can be expedited by 60-90 days with clean filing history.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid GSTIN Suspension + Cancellation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Section 29 + Rule 21A CGST Rules empower the Department to SUSPEND a GSTIN after 2 consecutive defaults (composition) or 6 consecutive defaults (regular). Suspended GSTINs can't issue tax invoices, claim ITC, or transact - revenue stops immediately. We prevent this entirely.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Lender + Investor + Tender Eligibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, NBFCs, investors, and Government tender authorities ALL pull GST return history from the public GST portal during due-diligence. Erratic filings = working capital loan rejection, lower credit limits, tender disqualification. Clean filing record = best terms.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Notice / Litigation Defence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Department notices (DRC-01A, DRC-01, ASMT-10, GST audit) inevitably reference return data. Clean, reconciled, archived returns + working papers = strong defence. Sloppy filings = the Department reconstructs your liability with adverse assumptions and you pay first, dispute later. We maintain the audit trail.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default GstFilingBenefits;
