import React from "react";
import "./Section8Breadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Section-8 Company Registration
          </span>

          <h1 className="lt-public-title">
            Section-8 Company Registration 
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with the section 8 company registration in India, also known as non-profit organizations. Our services ensure a hassle-free process, completed within a reasonable timeframe, and at a competitive professional fee starting from Rs. 7,999/- (excluding govt fee). Trust us to streamline your section 8 company registration in India, making the process efficient and seamless.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Minimum 2 Persons Required</div>
            <div className="lt-feature-item"> Minimum 2 Directors Required</div>
            <div className="lt-feature-item"> 10 to 15 Working Days</div>
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
          source="section8-company"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
