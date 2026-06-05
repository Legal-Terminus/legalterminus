import React from "react";
import "./GSTRegAdvantages.css";

const GSTRegAdvantages = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">Benefits of GST Registration</h2>
          <p className="req-subtitle">
            GSTIN does more than satisfy a compliance officer. It's the single piece of paper that opens up procurement, marketplaces, exports, and credit lines. Here's the honest breakdown:
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Input Tax Credit (ITC) Recovery</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Every rupee of GST you pay on raw materials, services, software, rent, and capital goods becomes claimable credit. For a ₹50L revenue business, that's typically ₹3-6L recovered annually.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Marketplace &amp; Enterprise Access</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Amazon, Flipkart, Myntra, Zomato, Swiggy — none of them onboard sellers without a GSTIN. Same for B2B procurement platforms and most enterprise vendor empanelments.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Inter-State Trade Without Limits</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Without GST, supplying across state borders triggers compulsory registration regardless of turnover. With GST, you ship pan-India under one GSTIN per state — no permits, just an e-way bill.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Export &amp; SEZ Benefits</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Registered exporters can supply under LUT (Letter of Undertaking) without paying IGST — a direct working-capital win. Plus refund of accumulated ITC on export inputs is fully recoverable.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Composition Scheme Tax Savings</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Eligible small businesses pay a flat 1%-6% on turnover instead of full GST rates. For a ₹1 cr trader on goods, that's ₹1L tax vs ~₹12-18L under regular scheme.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Credit &amp; Loan Underwriting</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Banks, NBFCs, and fintech lenders now pull GSTR data directly via the GSTN consent framework. A clean 12-month filing history is the new CIBIL for SME credit.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default GSTRegAdvantages;
