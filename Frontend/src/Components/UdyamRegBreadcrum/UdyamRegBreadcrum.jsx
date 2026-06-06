import React from 'react';
import './UdyamRegBreadcrum.css';
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const UdyamRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Udyam / MSME Registration
          </span>

          <h1 className="lt-public-title">
            Udyam / MSME Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Save 50% Today on Professional Services</span>
          </h1>

          <p className="lt-public-description">
            Udyam Registration is the official government process for MSME recognition in India, governed by the Ministry of MSME. A Udyam certificate gives your business a unique 19-digit Udyam Registration Number (URN), unlocks priority sector lending, enables participation in government tenders, and protects you under the MSMED Act. The registration is completely free on the government portal — no fees, no renewals, lifetime validity.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Free Government Registration</div>
            <div className="lt-feature-item">Lifetime MSME Certificate</div>
            <div className="lt-feature-item">Priority Sector Lending Access</div>
            <div className="lt-feature-item">Government Tender Eligibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>10,000+</h3>
              <p>Udyam certificates issued</p>
            </div>
            <div>
              <h3>₹0 Govt Fee</h3>
              <p>Completely free registration</p>
            </div>
            <div>
              <h3>1–2 Days</h3>
              <p>End-to-end processing</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="udyam-consult-form">
          <ConsultationForm
            source="udyam-registration"
            subtitle="Talk to our Udyam registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default UdyamRegBreadcrum;
