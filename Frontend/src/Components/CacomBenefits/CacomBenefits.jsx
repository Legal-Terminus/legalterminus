import React from "react";
import "./CacomBenefits.css";

const CacomBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Updating Your Registered Office
          </h2>
          <p className="opcben-subtitle">
            Keeping your registered office current is not just a formality — it ensures you receive every legal notice, keeps you compliant, and aligns all your records with where the company actually operates.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Never Miss a Legal Notice</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The registered office is where the MCA, tax department, and courts send notices. Keeping it current ensures every important communication reaches you on time — instead of going to a vacated address and being missed until it is too late.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stay Compliant Under Section 12</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The Companies Act requires the registered office to be intimated and kept up to date. Filing the change properly keeps the company compliant under Section 12 and protects the directors from penalties for maintaining a stale or non-existent address.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Consistent Across All Records</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Once the new address flows through PAN, GST, bank, and licences, every official record agrees. That consistency prevents the address mismatches that cause rejected filings, KYC failures, and payment hold-ups.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Reflects Your Real Operations</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              When you relocate, expand, or move to a better-connected location, updating the registered office aligns your legal identity with where you actually work — keeping your public profile accurate for customers, vendors, and investors.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smoother KYC &amp; Due Diligence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, tender authorities, and investors verify the registered office during KYC and due diligence. A current, consistent address across the MCA and tax records removes a common friction point and speeds up onboarding and deals.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Entity Continuity Preserved</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Changing the registered office — even across states — does not change the company's identity. The CIN, history, contracts, and liabilities all continue unchanged; only the address on record is updated, so there is no disruption to the business.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default CacomBenefits;
