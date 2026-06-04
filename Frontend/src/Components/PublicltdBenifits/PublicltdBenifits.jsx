import React from "react";
import "./PublicltdBenifits.css";

const RequirementsPvt = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        {/* Heading + intro */}
        <header className="req-header">
          <h2 className="req-title">
            Benefits of Public Limited Company Registration in India
          </h2>
          <p className="req-subtitle">
            PLC isn't just a bigger version of Private Limited. It's a fundamentally different fundraising and credibility instrument. The benefits compound the moment you start raising real capital.
          </p>
        </header>

        {/* Cards */}
        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Raise from the Public</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Only a PLC can run an IPO, FPO, rights issue, or QIP. Even pre-listing, the PLC structure unlocks private placement to up to 200 investors per financial year — vs Pvt Ltd's hard cap of 200 lifetime members.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Free Transferability of Shares</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              PLC shares are freely transferable by default under Section 58 — no AOA restrictions. Investors love this. Pvt Ltd shares are restricted by AOA; transfer requires board / shareholder consent.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Perpetual Succession &amp; Limited Liability</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              The company is a separate legal person. Founders' personal assets are insulated; the entity survives directors / shareholders coming and going. This is table stakes for any funded business.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Institutional Credibility</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Banks lend more, vendors extend longer credit, and global enterprise customers onboard faster with a PLC vendor. The structure itself communicates scale and governance maturity.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">ESOP &amp; Sweat Equity Friendly</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              PLC AOAs cleanly accommodate ESOP pools, sweat equity (Section 54), and preferential allotments. Critical when you start hiring from late-stage startups and need competitive equity packages.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Listing Optionality</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Going from Pvt Ltd to Listed is a two-step conversion (Pvt Ltd → PLC → IPO). Starting as PLC saves 6–9 months and ₹3–8L in conversion costs when you decide to list.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
