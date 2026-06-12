import React from "react";
import "./CnllpBenefits.css";

const CnllpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Officially Changing Your LLP Name
          </h2>
          <p className="opcben-subtitle">
            A proper name change is more than cosmetic — it aligns your legal identity with your brand, removes conflict risk, and keeps every record consistent, all while preserving the LLP's continuity.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">A Brand That Fits</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Your official name finally matches how you market and operate. A modern, relevant name strengthens recall and credibility with customers, partners, and investors — without the confusion of an outdated legal name lingering on documents.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Entity Continuity Preserved</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Changing the name does not create a new entity. The LLPIN, history, PAN-linked record, contracts, and liabilities all carry forward — so you upgrade your identity without losing your track record or starting over.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Removes Conflict &amp; Legal Risk</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Moving to a properly searched, conflict-free name eliminates the risk of disputes with similarly named companies or trademark owners — and the danger of being directed to change the name involuntarily later.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Consistent Across Records</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Once the new name flows through PAN, GST, bank, and licences, every official record agrees. That consistency prevents the mismatches that otherwise cause rejected filings, payment issues, and KYC headaches.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Fresh Certificate of Incorporation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              You receive an updated Certificate of Incorporation in the new name — official proof you can present to banks, vendors, and authorities, leaving no doubt about the LLP's current legal identity.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smoother Future Transactions</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A clean, consistent name simplifies fundraising, vendor onboarding, tenders, and due diligence. Counterparties see one coherent identity across the MCA, tax, and banking records — building trust and speeding up deals.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default CnllpBenefits;
