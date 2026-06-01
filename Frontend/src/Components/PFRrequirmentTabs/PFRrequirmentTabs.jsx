import React from "react";
import "./PFRrequirmentTabs.css";

const RequirementsPvt = () => {
  return (
    <section className="pfr-req-section">
      <div className="pfr-req-container">
        {/* Heading + intro */}
        <header className="pfr-req-header">
          <h2 className="pfr-req-title">
            Benefits of Partnership Firm Registration in India
          </h2>
          <p className="pfr-req-subtitle">
            Partnership Firms aren't going extinct — there's a reason millions of trading firms, professional practices, and family businesses still pick this structure every year. Here's what actually works:
          </p>
        </header>

        {/* Cards */}
        <div className="pfr-req-grid">
          {/* 1 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Cheapest Co-Founder Structure</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Total setup cost (with registration) sits around ₹3,000 – ₹8,000 — about half the cost of LLP and a third of Pvt Ltd. For trading and consulting partnerships starting lean, this matters.
            </p>
          </article>

          {/* 2 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Minimal Compliance Load</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              No MCA21 filings. No DSC, no DIN. No board meetings. No annual returns to the Registrar (the RoF record is static unless you reconstitute). Just income tax and GST — same as any business.
            </p>
          </article>

          {/* 3 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Section 44AD / 44ADA Presumptive Tax</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Eligible firms can declare income on a presumptive basis — 6% / 8% of turnover (44AD) or 50% of receipts (44ADA). No books, no audit, no detailed P&amp;L. Massive simplification for receipts ≤ ₹2cr (44AD) or ≤ ₹75L (44ADA, professionals).
            </p>
          </article>

          {/* 4 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">No Audit Until ₹1 Crore Turnover</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Tax audit under Section 44AB kicks in only when turnover crosses ₹1 crore (or ₹50 lakh for professionals not opting for 44ADA). Below that, no statutory audit cost (typically saves ₹15K – ₹30K annually).
            </p>
          </article>

          {/* 5 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Flexibility in Profit Sharing</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Profit / loss share can be fixed at any ratio — even unequal — and changed via supplementary Deed. No statutory minimum capital, no fixed share-percentage rules. Bring in a 30/70 partner today, switch to 50/50 next year.
            </p>
          </article>

          {/* 6 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Easy Dissolution &amp; Exit</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Partnership at Will — any partner can dissolve via notice. Particular Partnership — auto-dissolves on completion. Both far easier than winding up an LLP (₹25K + 6 months) or a Pvt Ltd (₹50K + 9 months).
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
