import React from "react";
import "./TMApplicaRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="Tm-Application-req-section">
      <div className="Tm-Application-req-container">
        {/* Heading + intro */}
        <header className="Tm-Application-req-header">
          <h2 className="Tm-Application-req-title">
            Benefits of Trademark Registration in India
          </h2>
          <p className="Tm-Application-req-subtitle">
            The Ministry of Commerce and Industry (through the Office of CGPDTM) administers trademark registration in India. Here's why it's worth every rupee:
          </p>
        </header>

        {/* Cards */}
        <div className="Tm-Application-req-grid">
          {/* 1 */}
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">Legal Protection Against Infringement</h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
             A registered trademark gives you the legal right to sue anyone who copies, imitates, or misuses your brand in the same or similar class of goods/services under the Trade Marks Act, 1999.
            </p>
          </article>

          {/* 2 */}
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">10-Year Protection (Renewable Forever)</h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
              A trademark in India is valid for 10 years from the date of filing and can be renewed indefinitely every 10 years via Form TM-R — making it a perpetual business asset.
            </p>
          </article>

          {/* 3 */}
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">
              Access to Global Filing Routes
            </h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
              A registered Indian trademark can be used as a basis for international filings under the Madrid Protocol, making global brand expansion significantly easier and cost-effective.
            </p>
          </article>

          {/* 4 */}
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">
              Block Counterfeit Products
            </h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
              Registered trademark holders can request Customs authorities to block the import of counterfeit goods under the Trade Marks Act, 1999. This is particularly powerful for e-commerce and export brands.
            </p>
          </article>

          {/* 5
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">
              Use of ® Symbol
            </h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
              After successful registration, you can use the ® symbol, which increases your brand credibility.
            </p>
          </article> */}

          {/* 6
          <article className="Tm-Application-req-card">
            <h3 className="Tm-Application-req-card-title">
              Valuable Business Asset
            </h3>
            <div className="Tm-Application-req-card-underline" />
            <p className="Tm-Application-req-card-text">
              A trademark becomes an intellectual property asset that can be sold, licensed, or transferred.
            </p>
          </article> */}
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
