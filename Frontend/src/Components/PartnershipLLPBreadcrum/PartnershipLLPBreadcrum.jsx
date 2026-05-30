import React from "react";
import "./PartnershipLLPBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const PartnershipLLPBreadcrum = () => {
  return (
    <section className="partnership-llp-breadcrum-hero">
      <div className="partnership-llp-breadcrum-container">

        {/* LEFT CONTENT */}
        <div className="partnership-llp-breadcrum-content">

          <span className="partnership-llp-breadcrum-tag">
            Conversion of Partnership firm into Limited Liability Partnership
          </span>

          <h1 className="partnership-llp-breadcrum-title">
            Partnership Firm into Limited Liability Partnership
          </h1>

          <p className="partnership-llp-breadcrum-description">
            Legal Terminus can help you with conversion of partnership into limited liability partnership in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 9999/- excluding Govt. Fees
          </p>

          <div className="partnership-llp-breadcrum-features">
            <div className="partnership-llp-breadcrum-feature-item">Minimum 2 Directors Required</div>
            <div className="partnership-llp-breadcrum-feature-item">Separate Legal Entity</div>
            <div className="partnership-llp-breadcrum-feature-item">Limited Liability Protection</div>
            <div className="partnership-llp-breadcrum-feature-item">High Business Credibility</div>
          </div>

          <div className="partnership-llp-breadcrum-highlights">
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
          source="partnership-to-llp"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default PartnershipLLPBreadcrum;
