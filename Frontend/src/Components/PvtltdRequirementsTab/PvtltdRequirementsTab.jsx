import React from "react";
import "./PvtltdRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        {/* Heading + intro */}
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Private Limited Company Registration in India
          </h2>
          <p className="req-subtitle">
            The registration process is managed by the Ministry of Corporate Affairs (MCA) through the SPICe+ integrated web form, which covers incorporation, PAN, TAN, GST, EPFO, ESIC, and bank account in one shot.
          </p>
        </header>

        {/* Cards */}
        <div className="req-grid">
          {/* 1 */}
          <article className="req-card">
            <h3 className="req-card-title">Investor-Ready Structure</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Every VC term sheet you'll ever sign assumes a Pvt Ltd. Share classes, preference rights, anti-dilution, drag-along, tag-along, board observer seats — all written into your AOA. Pvt Ltd is the only structure where these clauses are enforceable by default.
            </p>
          </article>

          {/* 2 */}
          <article className="req-card">
            <h3 className="req-card-title">Section 115BAA — 22% Concessional Tax</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Domestic Pvt Ltd companies can opt for 22% tax under Section 115BAA (vs 25.17% default for turnover ≤ ₹400cr or 30% above). New manufacturing companies get an even better 15% under Section 115BAB. Massive long-term tax saving over LLP's flat 30%.
            </p>
          </article>

          {/* 3 */}
          <article className="req-card">
            <h3 className="req-card-title">ESOP &amp; Sweat Equity Ready</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Section 62(1)(b) of the Companies Act makes ESOPs cleanly issuable by Pvt Ltd companies. Sweat equity (Section 54), preferential allotment (Section 62), private placement (Section 42) — all available as fundraising and talent-acquisition tools. Critical from your first hire onwards.
            </p>
          </article>

          {/* 4 */}
          <article className="req-card">
            <h3 className="req-card-title">Limited Liability + Separate Legal Entity</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Founders' personal assets are insulated from company debts. The company can sue, be sued, hold property, sign contracts in its own name. Perpetual succession — directors and shareholders come and go, the entity continues.
            </p>
          </article>

          {/* 5 */}
          <article className="req-card">
            <h3 className="req-card-title">Startup India / DPIIT Eligibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Only Pvt Ltd, LLP, and Partnership Firms are eligible for DPIIT (Startup India) recognition. Pvt Ltd unlocks the full Startup India toolkit — Section 80-IAC tax holiday (3 of 10 years tax-free), angel tax exemption u/s 56(2)(viib), self-certification under labour &amp; environment laws, fast-track patent examination.
            </p>
          </article>

          {/* 6 */}
          <article className="req-card">
            <h3 className="req-card-title">Credibility with Banks, Vendors, Enterprises</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Banks underwrite working capital loans more readily to Pvt Ltd than to LLP or proprietorship. Enterprise procurement teams insist on a Pvt Ltd vendor for contracts above ₹25–50 lakh. The structure itself signals scale and governance maturity.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
