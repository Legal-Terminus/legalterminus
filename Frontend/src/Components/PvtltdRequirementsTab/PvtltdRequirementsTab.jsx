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
            <h3 className="req-card-title">Separate Legal Identity</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Once incorporated, your company is a legal person in its own right. It can own property, sign contracts, sue, and be sued — completely independently of you, its founder. Think of it as giving your startup its own legal superpower.
            </p>
          </article>

          {/* 2 */}
          <article className="req-card">
            <h3 className="req-card-title">Limited Liability Protection</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Your personal assets — home, savings, car — are ring-fenced from company liabilities. Shareholders are only responsible for the unpaid value of their shares. That's the safety net that lets founders take bold bets.
            </p>
          </article>

          {/* 3 */}
          <article className="req-card">
            <h3 className="req-card-title">
              Access to Government Schemes & Incentives
            </h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Registered Pvt Ltd companies can access Startup India benefits (tax exemptions under Section 80-IAC, angel tax relief under Section 56), Make in India incentives, DPIIT recognition, and government tenders — opportunities simply not available to unregistered entities.
            </p>
          </article>

          {/* 4 */}
          <article className="req-card">
            <h3 className="req-card-title">
              Increased Credibility & Bankability
            </h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Clients, suppliers, and financial institutions trust registered entities. Banks are more likely to extend credit lines. Investors take you seriously. Partners want to deal with you. A Pvt Ltd tag signals that you mean business — literally.
            </p>
          </article>

          {/* 5 */}
          <article className="req-card">
            <h3 className="req-card-title">
              Perpetual Succession
            </h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              The company doesn't die with its founders. Even if a director resigns, passes away, or sells their stake, the company continues to exist. Continuity is baked in.
            </p>
          </article>

          {/* 6 */}
          <article className="req-card">
            <h3 className="req-card-title">
              Ease of Raising Capital
            </h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Issue shares, bring in investors, attract venture capital — equity fundraising is structured and clean for a Pvt Ltd. This is the single biggest advantage over proprietorships and partnerships when scaling.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
