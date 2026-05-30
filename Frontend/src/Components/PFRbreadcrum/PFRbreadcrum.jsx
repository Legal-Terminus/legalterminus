import React from "react";
import "./PFRbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
           Partnership Firm Registration 
          </span>

          <h1 className="lt-public-title">
            Partnership Firm Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Fast, Hassle-Free &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can assist you with partnership firm registration in India. We ensure a hassle-free process completed within a reasonable timeframe, with competitive professional fees starting from Rs. 2,499/-.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Minimum 2 Directors Required</div>
            <div className="lt-feature-item"> Separate Legal Entity</div>
            <div className="lt-feature-item"> Limited Liability Protection</div>
            <div className="lt-feature-item"> High Business Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="pf-registration"
          subtitle="Talk to our Partnership Firm Registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
