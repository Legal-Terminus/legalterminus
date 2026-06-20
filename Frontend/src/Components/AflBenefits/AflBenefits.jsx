import React from "react";
import "./AflBenefits.css";

const AflBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Annual Filing for LLP in India
          </h2>
          <p className="opcben-subtitle">
            Filing your LLP's annual returns on time delivers concrete legal + commercial benefits FOR YOU as the partners. Here's what timely filing actually delivers:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoids the Graded Late-Fee Multiplier</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Per LLP (Amendment) Rules, 2022, late fee on Form 11 + Form 8 is a graded multiplier — 2x to 30x normal fees based on delay length + Small/Other LLP classification. Other LLPs face up to 30x normal fee + ₹20/day continuing beyond 360 days. Timely filing reduces this exposure to ZERO. Our Late-Fee Zero promise (subject to Day-30 data hand-off) keeps this money in your LLP's account.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Designated Partner Personal Liability Mitigation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under SECTION 8 of the LLP Act, 2008, Designated Partners are PERSONALLY LIABLE for compliance defaults — penalties up to ₹5 LAKH + daily continuing penalties. Timely filing keeps personal liability exposure at zero. For founders + senior professionals serving as Designated Partners, this is the difference between clean compliance + personal financial risk.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Continued Eligibility for Bank Loans + Working Capital Lines</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks + NBFCs require LATEST FORM 11 + FORM 8 + ITR as part of LLP credit assessment — working capital limits, term loans, OD facilities. LLPs with overdue filings + accumulated late fees become INELIGIBLE for institutional credit. Timely filing maintains your LLP's institutional credibility + access to formal capital.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Strike-Off / Closure Path Stays Open</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              If you ever want to STRIKE OFF (close) your LLP voluntarily — all past annual filings must be cleared FIRST. LLPs with multi-year filing defaults face accumulated late fees (under the graded multiplier) that MUST BE PAID before strike-off application can be processed. Timely filing keeps the exit option clean + low-cost.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Investor / M&amp;A Due-Diligence Clean Slate</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For LLPs raising investor capital or pursuing M&amp;A: filing track record is a Day-1 due-diligence check. Overdue filings + late fees show up immediately on the MCA portal — red flag for any institutional investor / acquirer. Clean compliance history = no haircut in valuation + faster closing timeline.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Audit Discipline + Financial Statement Quality</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Year-round bookkeeping + financial statements preparation (Enriched) + tax audit coordination (Supreme) creates DISCIPLINED financial records that are: useful for management decisions, defensible in any IT scrutiny, ready for investor / banker review, and minimise tax notice risk. Many LLPs file ITR with poorly maintained books + face scrutiny notices 2-3 years later. Proper books eliminate this risk.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AflBenefits;
