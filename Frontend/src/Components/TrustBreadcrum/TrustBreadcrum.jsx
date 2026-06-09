import React from "react";
import "./TrustBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trust Registration
          </span>

          <h1 className="lt-public-title">
            Trust Registration in India
          </h1>
          <span className="lt-title-tagline">Register Your Trust Hassle-Free</span>

          <p className="lt-public-description" style={{ marginBottom: "0" }}>
            Trust Registration in India is one of the most commonly used legal structures for charitable, religious, educational, social welfare, and family-purpose organizations. Public Charitable Trusts are generally governed by state-specific trust laws, while private trusts are governed by the Indian Trusts Act, 1882. We provide complete assistance for Trust Registration in India, including Trust Deed drafting, stamp duty guidance, document preparation, and registration before the Sub-Registrar or relevant authority.
          </p>
          <p className="lt-public-description" style={{ marginTop: "12px" }}>
            Depending on your selected plan, we also assist with registrations such as 12A and 80G to help eligible trusts obtain income tax exemption and donor tax-benefit eligibility.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">15-Day Filing</div>
            <div className="lt-feature-item">12A/80G Ready</div>
            <div className="lt-feature-item">Trust Deed Drafting Assistance</div>
            <div className="lt-feature-item">All-State Coverage</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Trusts registered</p>
            </div>
            <div>
              <h3>Public + Private</h3>
              <p>structures both covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="trust-registration"
          subtitle="Talk to our Trust Registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
