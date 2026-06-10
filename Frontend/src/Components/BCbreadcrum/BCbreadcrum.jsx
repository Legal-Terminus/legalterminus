import React from "react";
import "./BCbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
           Bar Code Registration
          </span>

          <h1 className="lt-public-title">
            Barcode (GS1) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">GS1-Certified, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your end-to-end GS1 Barcode Registration with GS1 India — from company prefix allocation to GTIN generation for all your products. We handle documentation, GS1 portal filing, and annual renewal so your products are scan-ready for supermarkets, e-commerce platforms, and global supply chains. Our professional fee starts at ₹9,999 + GST. GS1 annual subscription is billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">GS1 India Company Prefix (GSTIN-linked)</div>
            <div className="lt-feature-item">Unlimited GTINs for Your Products</div>
            <div className="lt-feature-item">Required for Amazon, Flipkart &amp; Retail</div>
            <div className="lt-feature-item">Global Barcode Standard (EAN-13 / UPC)</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Barcodes registered</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>GS1 India portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
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

export default Breadcrum;
