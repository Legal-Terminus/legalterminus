import React from "react";
import "./FoodLicenseBenefits.css";

const FoodLicenseBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of FSSAI Food License Registration in India
          </h2>
          <p className="opcben-subtitle">
            FSSAI registration is not just a legal requirement — it actively protects your business from penalties, opens major sales channels, and builds lasting consumer trust.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Legal Compliance &amp; Penalty-Free Operations</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A valid FSSAI license ensures your food business operates lawfully under the FSS Act 2006, eliminating exposure to prosecution, product seizure, and penalties up to ₹5 lakh for unlicensed operations. It also protects you during food safety audits and inspections.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Access to E-Commerce &amp; Food Delivery Platforms</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Swiggy, Zomato, BigBasket, Amazon, Flipkart, and Blinkit require a valid FSSAI number to list food products or restaurants. Without it, your business cannot be onboarded or will be delisted. FSSAI registration is the gateway to India's ₹10 trillion food e-commerce market.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Consumer Trust &amp; Brand Credibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The FSSAI logo and 14-digit license number on your product label is an immediately recognisable food safety trust signal. It assures consumers that your product meets mandated hygiene, quality, and safety standards, directly improving brand perception and repeat purchases.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Retail &amp; Modern Trade Access</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Supermarkets (Reliance Smart, D-Mart, Spencer's), modern retail chains, and institutional buyers mandate FSSAI certification before onboarding any food product. A valid FSSAI license is the single most critical document in any retail vendor registration or B2B food supply agreement.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Export Readiness</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              FSSAI certification is a prerequisite for food export. Importers in the EU, USA, Middle East, and South-East Asia require FSSAI compliance documentation. Combined with an IEC (Import Export Code), a valid Central FSSAI License is the baseline for entering international food markets.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Bank Loans &amp; Government Schemes</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              FSSAI registration is required for accessing PMFME scheme benefits, NABARD food processing loans, and MSME credit under CGTMSE. Banks and NBFCs ask for FSSAI certification as part of food business loan documentation.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseBenefits;
