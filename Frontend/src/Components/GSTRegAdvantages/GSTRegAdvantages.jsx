import React from "react";
import "./GSTRegAdvantages.css";

const GSTRegAdvantages = () => {
  return (
    <section className="req-section">
      <div className="req-container">
        <header className="req-header">
          <h2 className="req-title">Benefits of GST Registration</h2>
          <p className="req-subtitle">
            Registering for GST is an important step for businesses in India. It comes with several advantages that make tax compliance easier and more beneficial.
          </p>
        </header>

        <div className="req-grid">
          <article className="req-card">
            <h3 className="req-card-title">Legal Recognition &amp; Market Expansion</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              GST registration gives businesses official recognition as suppliers of goods or services. It also unlocks access to e-commerce platforms like Amazon, Flipkart, and Meesho — and allows you to sell to GST-registered businesses who require a valid GSTIN for ITC.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Input Tax Credit (ITC)</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Registered businesses can claim Input Tax Credit on purchases, reducing their total tax burden. ITC eliminates double taxation across the supply chain — lowering costs for both the business and the end consumer.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Simplified Tax Filing</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              GST consolidates multiple indirect taxes into one online system. GSTR-1 (sales) and GSTR-3B (summary + payment) are filed online. Small businesses can opt for the Composition Scheme — pay a flat rate, file quarterly, no ITC complexity.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Higher Exemption Limit</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              Only businesses with turnover above ₹40 lakh (goods) or ₹20 lakh (services) are mandatorily covered — meaning most micro-businesses are exempt. Voluntary registration is available for those who want to claim ITC or project credibility.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Inter-State Trade Without Barriers</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              IGST (Integrated GST) enables seamless inter-state trade. No state border checkposts, no multiple tax registrations per state for most businesses — just one GSTIN for the entire country, with IGST credits flowing cleanly.
            </p>
          </article>

          <article className="req-card">
            <h3 className="req-card-title">Business Credibility &amp; Compliance</h3>
            <div className="req-card-underline" />
            <p className="req-card-text">
              A GSTIN on your invoice signals compliance and professionalism to clients, vendors, and lenders. Banks and NBFCs use GST returns as a proxy for business turnover when evaluating loan eligibility — registered businesses access credit faster.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default GSTRegAdvantages;
