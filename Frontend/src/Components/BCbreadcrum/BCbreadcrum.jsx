import React from "react";
import "./BCbreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const BCbreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Bar Code Registration In India
          </span>

          <h1 className="lt-public-title">
            Bar Code Registration In India
            <br />
            <span className="lt-title-tagline">For Online &amp; Retail Sales</span>
          </h1>

          <p className="lt-public-description">
            Bar Code Registration helps businesses generate globally accepted barcode numbers (GTINs) for their products. These barcodes are commonly required for selling products on marketplaces like Amazon, Flipkart, JioMart, BigBasket, retail chains, supermarkets, and for export purposes.
            <br /><br />
            In India, genuine GS1 barcodes are issued only by GS1 India, the authorized body promoted by the Ministry of Commerce &amp; Industry along with leading industry associations. We provide complete assistance for Bar Code Registration, including GS1 India membership application, GTIN allocation support, Company Prefix selection, MSME reimbursement guidance (where applicable), and DataKart onboarding support.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">GS1 India Member</div>
            <div className="lt-feature-item">Globally Unique GTIN</div>
            <div className="lt-feature-item">MSME 80% Claimed</div>
            <div className="lt-feature-item">Marketplace Ready</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>GS1 barcode registrations</p>
            </div>
            <div>
              <h3>All Pack Sizes</h3>
              <p>100 / 500 / 1,000 / 10,000 / 1,00,000</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="bc-consult-form">
          <ConsultationForm
            source="bc-registration"
            subtitle="Talk to our Barcode registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default BCbreadcrum;
