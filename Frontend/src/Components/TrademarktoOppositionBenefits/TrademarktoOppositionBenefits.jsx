import React from "react";
import "./TrademarktoOppositionBenefits.css";

const TradeLicenseBenefits = () => {
  return (
    <section className="tlb-section">
      <div className="tlb-container">
        {/* Heading + intro */}
        <header className="tlb-header">
          <h2 className="tlb-title">
            Benefits of Trademark Opposition
          </h2>
          <p className="tlb-subtitle">
            Trade licenses are issued by municipal authorities to regulate and authorize
            business operations within a locality. Registering ensures that your business
            adheres to safety, health, and legal standards while maintaining credibility in
            the marketplace.
          </p>
        </header>

        {/* Cards */}
        <div className="tlb-grid">
          <article className="tlb-card">
            <h3 className="tlb-card-title">Legal Business Recognition</h3>
            <div className="tlb-card-underline" />
            <p className="tlb-card-text">
              A trade license legally validates your business operations, helping you run
              smoothly under municipal laws and avoid penalties.
            </p>
          </article>

          <article className="tlb-card">
            <h3 className="tlb-card-title">Public Health & Safety Compliance</h3>
            <div className="tlb-card-underline" />
            <p className="tlb-card-text">
              Businesses are required to meet specific hygiene, safety, and environmental
              standards, ensuring a safe and compliant operation.
            </p>
          </article>

          <article className="tlb-card">
            <h3 className="tlb-card-title">Improved Business Credibility</h3>
            <div className="tlb-card-underline" />
            <p className="tlb-card-text">
              Licensed businesses are more trusted by customers, suppliers, and government
              agencies, which improves reputation and business relationships.
            </p>
          </article>

          <article className="tlb-card">
            <h3 className="tlb-card-title">Eligibility for Local Benefits</h3>
            <div className="tlb-card-underline" />
            <p className="tlb-card-text">
              A registered trade license may make your business eligible for municipal
              incentives, ease of approvals, and faster growth support.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TradeLicenseBenefits;
