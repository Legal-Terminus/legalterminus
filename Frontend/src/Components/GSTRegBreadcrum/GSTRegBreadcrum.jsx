import React from "react";
import "./GSTRegBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const GSTRegBreadcrum = () => {
  return (
    <section className="gstv2-hero-section">
      <div className="gstv2-hero-container">

        {/* LEFT CONTENT */}
        <div className="gstv2-content-left">

          <span className="gstv2-badge">
            GST REGISTRATION 
          </span>

          <h1 className="gstv2-heading">
            GST Registration
            <span className="gstv2-highlight"> in India</span> 
          </h1>
          <p className="gstv2-sub-description">
            Legal Terminus can help you with GST registration in India, offering hassle-free services within a reasonable timeframe and for competitive professional fees starting from Rs. 1999/-. We assist with GST registration promptly and efficiently to meet your organization’s needs.
          </p>

          {/* STATS */}
          <div className="gstv2-stats-wrapper">
            <div className="gstv2-stat-card">
              <h3 className="gstv2-stat-value">1000+</h3>
              <p className="gstv2-stat-label">Companies Registered</p>
            </div>

            <div className="gstv2-stat-card">
              <h3 className="gstv2-stat-value">100%</h3>
              <p className="gstv2-stat-label">Online Process</p>
            </div>

            <div className="gstv2-stat-card">
              <h3 className="gstv2-stat-value">5+</h3>
              <p className="gstv2-stat-label">Years of Legal Expertise</p>
            </div>
          </div>

          {/* POINTS */}
          <ul className="gstv2-feature-list">
            <li className="gstv2-feature-item">GSTIN Certificate Issuance</li>
            <li className="gstv2-feature-item">Complete Application Filing</li>
            <li className="gstv2-feature-item">Dedicated Expert</li>
            <li className="gstv2-feature-item">Suitable for All Business Types</li>
          </ul>

          {/* CTA */}
          <div className="gstv2-action-row">
            <button className="gstv2-primary-action">
              Speak to a GST Consultant
            </button>

            <span className="gstv2-trust-note">
              🔒 Trusted by businesses across India
            </span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="gst-registration"
          subtitle="Talk to our GST registration expert"
        />

      </div>
    </section>
  );
};

export default GSTRegBreadcrum;
