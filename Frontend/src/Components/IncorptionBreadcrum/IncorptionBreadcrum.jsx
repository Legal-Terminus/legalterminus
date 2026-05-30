import React from "react";
import "./IncorptionBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const IncorptionBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">
        {/* LEFT CONTENT */}
        <div className="lt-public-content">
          <span className="lt-public-tag">
            Incorporation Of Wholly Owned Subsidiary
          </span>

          <h1 className="lt-public-title">
            Incorporation Of Wholly Owned Subsidiary
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with Incorporation of Wholly Owned Subsidiary (WOS) in India, as and when required, in a hassle-free manner within a reasonable time span. We provide expert assistance to meet your business setup needs in India.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> 7 Steps Registration</div>
            <div className="lt-feature-item"> 100% of the shares are held by a foreign company</div>
            <div className="lt-feature-item"> At least 2 directors, & 1 must be an Indian resident</div>
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
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="incorporation"
          subtitle="Talk to our expert"
        />
      </div>
    </section>
  );
};

export default IncorptionBreadcrum;
