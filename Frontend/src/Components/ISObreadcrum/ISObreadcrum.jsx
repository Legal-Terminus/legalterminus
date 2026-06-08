import React from "react";
import "./ISObreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
           ISO Certification
          </span>

          <h1 className="lt-public-title">
            ISO Certification
            <span className="lt-title-india"> In India</span>
            <br />
            <span className="lt-public-subtitle">Build Trust, Grow Your Business</span>
          </h1>

          <p className="lt-public-description">
            ISO Certification is a globally recognised quality mark that validates your processes, boosts customer confidence, and positions your business for tenders, contracts, and international markets. Legal Terminus offers end-to-end ISO certification support — from standard selection and documentation to CB liaison and post-certification compliance — making the entire process simple, transparent, and affordable.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Enhances Business Credibility</div>
            <div className="lt-feature-item">Improves Process Efficiency</div>
            <div className="lt-feature-item">Eligible for Tenders &amp; Contracts</div>
            <div className="lt-feature-item">3-Year Validity</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,650+</h3>
              <p>ISO Certifications Delivered</p>
            </div>
            <div>
              <h3>3–5 Days</h3>
              <p>Process Timeline</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="iso-certification"
          subtitle="Talk to our ISO Certification registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
