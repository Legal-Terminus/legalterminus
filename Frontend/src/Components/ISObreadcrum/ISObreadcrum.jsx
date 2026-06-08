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
            ISO Certification helps your business demonstrate quality, reliability, and professionalism. It can improve customer confidence, strengthen internal processes, and increase eligibility for government tenders, corporate contracts, and international business opportunities. At Legal Terminus, we provide end-to-end support for obtaining ISO Certification. Our team assists you with gap analysis, documentation preparation, process implementation, employee training, internal audits, and coordination with the Certification Body throughout the certification process. Our professional fee starts from ₹9,999 + GST. Certification Body (CB) fees are charged separately at actuals, and we help you choose a suitable accredited Certification Body based on your business requirements.
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
