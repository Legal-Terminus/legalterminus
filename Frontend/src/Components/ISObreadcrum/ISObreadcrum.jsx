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
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with obtaining ISO certification in India for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 9,999/-
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Improves business quality standards</div>
            <div className="lt-feature-item"> Builds customer trust & credibility</div>
            <div className="lt-feature-item"> Helps in tender & contract eligibility</div>
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
          source="iso-certification"
          subtitle="Talk to our ISO Certification registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
