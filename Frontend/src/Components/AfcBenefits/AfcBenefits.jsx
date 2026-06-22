import React from "react";
import "./AfcBenefits.css";

const AfcBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Annual Filing for Company in India
          </h2>
          <p className="opcben-subtitle">
            Filing your Company's annual returns on time delivers concrete legal + commercial benefits FOR YOU as the Directors + Shareholders. Here's what timely filing actually delivers:
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Director Disqualification Avoided (Section 164(2) Protection)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Under SECTION 164(2) of the Companies Act, 2013, if a company defaults on AOC-4 / MGT-7 filing for 3 CONSECUTIVE YEARS, ALL ITS DIRECTORS ARE DISQUALIFIED for 5 YEARS from being Directors in ANY company. This is permanent career-ending for many founders + senior professionals. Timely filing eliminates this exposure entirely. The single biggest reason we exist.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Zero Late Fee Exposure — ₹100/Day NO CAP Savings</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              AOC-4 + MGT-7 late fees are ₹100 PER DAY PER FORM with NO upper cap, plus Section 403 additional multipliers (2x to 12x normal fees). DIR-3 KYC late = ₹5,000 fixed penalty + DIN deactivation. Late fees compound rapidly — a 6-month delay can easily exceed ₹40,000. Our Late-Fee Zero promise (subject to Day-30 data hand-off) eliminates this exposure.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Continued Access to Bank Loans + Working Capital</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks + NBFCs require LATEST AOC-4 + MGT-7 + ITR-6 + Audit Report as part of company credit assessment — working capital limits, term loans, OD facilities, NCDs. Companies with overdue filings + accumulated late fees become INELIGIBLE for institutional credit. Timely filing maintains your company's institutional credibility + access to formal capital.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Statutory Audit Discipline + Financial Statement Quality</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Mandatory statutory audit (Section 139) coordinated by LT's associated CA panel creates DISCIPLINED financial records that are: useful for management decisions, defensible in IT scrutiny, ready for investor / banker / VC due diligence, valued in M&amp;A transactions. Companies with sloppy audited financials lose 10-30% in valuation during DD — clean books eliminate this risk.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Investor / VC / M&amp;A Due-Diligence Clean Slate</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For companies raising investor capital or pursuing M&amp;A: filing track record + audit history is a Day-1 due-diligence check. Overdue filings + late fees + director disqualification flags show up immediately on the MCA portal — dealbreaker for any institutional investor / acquirer. Clean compliance history = no haircut in valuation + faster closing timeline.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Exit / Strike-Off Path Stays Open</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              If you ever want to STRIKE OFF (close) your company voluntarily under Section 248 (Form STK-2) — all past annual filings must be cleared FIRST. Companies with multi-year defaults face ₹5 lakh+ in accumulated late fees + audit catch-up costs + Director disqualification risk that MUST BE PAID / CLEARED before strike-off can be processed. Timely filing keeps the exit option clean + low-cost.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AfcBenefits;
