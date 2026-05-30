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
             Trust Registration Online
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with trust registration in India, ensuring a hassle-free process within a reasonable timeframe and competitive professional fees starting from Rs. 9,999/-. Trust registration services are offered promptly and efficiently to meet your needs.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Minimum 3 Members Required</div>
            <div className="lt-feature-item"> 5 Steps Registration Process</div>
            <div className="lt-feature-item"> 7 - 10 Working Days</div>
            <div className="lt-feature-item"> High Business Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Processes</p>
            </div>
            <div>
              <h3>5+</h3>
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
