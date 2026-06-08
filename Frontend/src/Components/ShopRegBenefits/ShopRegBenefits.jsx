import React from "react";
import "./ShopRegBenefits.css";

const ShopRegBenefits = () => {
  return (
    <section className="shopben-section">
      <div className="shopben-container">
        <header className="shopben-header">
          <h2 className="shopben-title">
            Benefits of Shop &amp; Establishment Registration in India
          </h2>
          <p className="shopben-subtitle">
            Registration under the Shop &amp; Establishment Act provides your business with legal identity, compliance protection, and access to key government services — all through a single certificate.
          </p>
        </header>

        <div className="shopben-grid">

          <article className="shopben-card">
            <h3 className="shopben-card-title">Legal Identity &amp; Recognition</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              The registration certificate is issued by the state government and serves as the official proof of existence of your commercial establishment. It is the first government-issued document your business receives, and is universally accepted by banks, government bodies, and courts as evidence of your business address and activity.
            </p>
          </article>

          <article className="shopben-card">
            <h3 className="shopben-card-title">Easy Bank Account Opening</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              Most banks require a Shop &amp; Establishment certificate as the primary address proof for opening a current account. Without it, proprietors and small business owners often struggle to get their current accounts opened. The certificate resolves this instantly and is accepted by all scheduled and cooperative banks.
            </p>
          </article>

          <article className="shopben-card">
            <h3 className="shopben-card-title">Enables GST &amp; Other Registrations</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              The registration certificate is accepted as a valid address/business proof for GST registration, FSSAI (food licence), trade licence, and drug licence applications. It dramatically speeds up downstream registrations and reduces the document burden when applying for multiple licences simultaneously.
            </p>
          </article>

          <article className="shopben-card">
            <h3 className="shopben-card-title">MSME / Udyam Registration Eligibility</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              MSME / Udyam registration — which unlocks priority sector lending, government subsidies, and tender preferences — requires proof of business existence. The Shop &amp; Establishment certificate is accepted as this proof for proprietorships and partnerships, making it an essential first step toward MSME benefits.
            </p>
          </article>

          <article className="shopben-card">
            <h3 className="shopben-card-title">Employee Welfare &amp; Labour Law Compliance</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              The Act mandates working hours, overtime pay, leaves (casual, sick, earned), public holidays, and rest intervals. A registered establishment demonstrates compliance with these standards, protecting the employer from labour disputes and providing employees with enforceable rights. Inspections by the Labour Department focus exclusively on registered establishments.
            </p>
          </article>

          <article className="shopben-card">
            <h3 className="shopben-card-title">Avoidance of Penalties &amp; Closure</h3>
            <div className="shopben-card-underline" />
            <p className="shopben-card-text">
              Operating without a valid Shop &amp; Establishment certificate is a punishable offence under state law — penalties include fines per day of default and, in repeated cases, directed closure by local municipal or labour authorities. Annual renewal keeps you compliant year-round and eliminates this risk entirely.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default ShopRegBenefits;
