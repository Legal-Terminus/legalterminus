import React from "react";
import "./IECBenefits.css";

const IECBenefits = () => {
  return (
    <section className="iecben-section">
      <div className="iecben-container">
        <header className="iecben-header">
          <h2 className="iecben-title">
            Benefits of IEC Registration in India
          </h2>
          <p className="iecben-subtitle">
            IEC is the gateway to global trade. Once registered, it unlocks export incentives, international payment channels, and government scheme eligibility — for the lifetime of your business with zero renewal.
          </p>
        </header>

        <div className="iecben-grid">
          <article className="iecben-card">
            <h3 className="iecben-card-title">Lifetime Validity — Zero Renewal</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              IEC is issued once and valid for the lifetime of the entity. No annual renewal, no compliance filing, no fee after issuance. Update it only if your business details change. Most registrations are completed in 1–2 working days.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Export Incentive Schemes</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              IEC is mandatory to claim government export incentives under MEIS, SEIS, RoDTEP, and DGFT reward schemes. Without IEC, exporters are ineligible for duty drawback, freight subsidies, and state export promotion grants.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">International Banking &amp; Payments</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Open a foreign currency account (EEFC account) and receive international wire transfers (SWIFT / FEMA-compliant). Banks and RBI-authorised payment gateways require IEC to process import payments and export remittances above thresholds.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Customs &amp; Port Clearance</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Without IEC, goods cannot clear customs at any Indian port, airport, or land border. IEC is the mandatory identifier on all shipping bills and bills of entry. Goods get cleared faster under ICEGATE with a valid, DGFT-verified IEC.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Global Market Credibility</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              International buyers, procurement teams, and trade platforms (Alibaba, IndiaMART, Amazon Global) require IEC for vendor KYC. IEC registration signals regulatory compliance and builds credibility with overseas clients and suppliers.
            </p>
          </article>

          <article className="iecben-card">
            <h3 className="iecben-card-title">Government Tender Eligibility</h3>
            <div className="iecben-card-underline" />
            <p className="iecben-card-text">
              Central and state government tenders for import/export of goods and services mandate IEC as a basic eligibility criterion. Defence, railways, and PSU procurement portals list IEC as a mandatory document in their vendor registration checklist.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IECBenefits;
