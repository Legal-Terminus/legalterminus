import React from "react";
import "./PtpubBenifits.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        {/* Heading + intro */}
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Converting a Private Limited into a Public Limited Company
          </h2>
          <p className="req-subtitle">
            Conversion isn't cosmetic. It removes the structural ceilings of a Private Limited and rewires the company for public capital, free share movement, and institutional credibility — the moment you start raising at scale.
          </p>
        </header>

        {/* Cards */}
        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Raise Capital from the Public</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Only a Public Limited Company can run an IPO, FPO, rights issue, or QIP. Conversion unlocks public fundraising and far wider private placement — capital routes that are simply closed to a Private Limited Company.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">No Cap on Membership</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              A Private Limited is locked at a maximum of 200 members. A Public Limited has no upper limit, so you can onboard as many shareholders and investors as the business needs without hitting a statutory ceiling.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Free Transferability of Shares</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              After conversion, shares become freely transferable by default under Section 58 — the restrictive transfer clauses in the private AOA are removed. Investors value the liquidity, and exits become far simpler.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Stronger Institutional Credibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Banks lend more, vendors extend longer credit, and large enterprise and global customers onboard faster with a Public Limited counterparty. The structure itself signals scale and governance maturity.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Business Continuity</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Conversion is not a fresh incorporation. The same entity continues with its history, PAN, contracts, and assets intact — only the structure and name change. There is no transfer of business or break in operations.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Listing Optionality</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Going from Private Limited to listed is a two-step path (Pvt Ltd → Public Ltd → IPO). Converting now completes the first step, so when you decide to list you are months — and lakhs in conversion cost — ahead.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
