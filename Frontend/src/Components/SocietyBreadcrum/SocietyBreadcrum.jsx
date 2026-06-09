import React from "react";
import "./SocietyBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Society Registration
          </span>

          <h1 className="lt-public-title">
            Society Registration in India
            <br />
            <span className="lt-title-tagline">Get Your Society Registered Today</span>
          </h1>

          <p className="lt-public-description" style={{ marginBottom: "0" }}>
            Society Registration in India is one of the most commonly used legal structures for charitable, educational, cultural, religious, social welfare, scientific, literary, and non-profit organizations. A Society is generally registered under the Societies Registration Act, 1860 and requires a minimum of 7 members for registration. We provide complete assistance for Society Registration in India, including drafting of the Memorandum of Association (MoA), Rules & Regulations, document preparation, and filing before the Registrar of Societies.
          </p>
          <p className="lt-public-description" style={{ marginTop: "12px" }}>
            Depending on your requirements, we also assist with additional registrations such as MSME (UDYAM) Registration and GST Registration to help your Society operate smoothly for vendor onboarding, grants, projects, and compliance purposes.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">At-least 7 Members</div>
            <div className="lt-feature-item">All-State Coverage</div>
            <div className="lt-feature-item">Online Filing</div>
            <div className="lt-feature-item">Legal Recognition</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Societies registered</p>
            </div>
            <div>
              <h3>Pan-India</h3>
              <p>Registrar of Societies coverage</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="society-registration"
          subtitle="Talk to our Society Registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
