import React from "react";
import "./GSTRegBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const GSTRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">GST Registration</span>

          <h1 className="lt-public-title">
            GST Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Your GSTIN. Live in 7 working days.</span>
          </h1>

          <p className="lt-public-description">
            GST registration gives your business a unique GSTIN — the gateway to legal tax compliance, Input Tax Credit, e-commerce marketplace access, and inter-state trade. 100% online through the GST portal. Government registration fee is NIL. Our professional fee starts at ₹1,999 + GST — transparent, no hidden charges.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">GSTIN Certificate Issuance</div>
            <div className="lt-feature-item">Input Tax Credit Eligible</div>
            <div className="lt-feature-item">100% Online Process</div>
            <div className="lt-feature-item">All Business Types Covered</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>GST Registrations Done</p>
            </div>
            <div>
              <h3>All States</h3>
              <p>Regular &amp; Composition Scheme</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="gst-consult-form">
          <ConsultationForm
            source="gst-registration"
            subtitle="Talk to our GST Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default GSTRegBreadcrum;
