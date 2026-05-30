import React from "react";
import "./ChangetoLlpBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const LLPBreadcrum = () => {
  return (
    <section className="llpbr-public-hero">
      <div className="llpbr-public-container">

        {/* LEFT CONTENT */}
        <div className="llpbr-public-content">

          <span className="llpbr-public-tag">
            Limited Liability Partnership Registration
          </span>

          <h1 className="llpbr-public-title">
            Limited Liability Partnership Registration
            <span> in India</span>
          </h1>

          <p className="llpbr-public-description">
            Legal Terminus can assist you with the Limited Liability Partnership (LLP) Registration in India. We ensure a hassle-free process completed within a reasonable timeframe, with competitive professional fees starting from Rs. 7,999/-.
          </p>

          <div className="llpbr-public-features">
            <div className="llpbr-feature-item"> Minimum 2 Directors Required</div>
            <div className="llpbr-feature-item"> Separate Legal Entity</div>
            <div className="llpbr-feature-item"> Limited Liability Protection</div>
            <div className="llpbr-feature-item"> High Business Credibility</div>
          </div>

          <div className="llpbr-public-highlights">
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
          source="company-to-llp"
          subtitle="Talk to our LLP registration expert"
        />

      </div>
    </section>
  );
};

export default LLPBreadcrum;
