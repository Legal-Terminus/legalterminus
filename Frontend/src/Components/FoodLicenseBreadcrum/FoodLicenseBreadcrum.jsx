import React from "react";
import "./FoodLicenseBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const FoodLicenseBreadcrum = () => {
  return (
    <section className="lt-foodlicense-hero">
      <div className="lt-foodlicense-container">

        {/* LEFT CONTENT */}
        <div className="lt-foodlicense-content">

          <span className="lt-foodlicense-tag">
            Food License (FSSAI) Registration
          </span>

          <h1 className="lt-foodlicense-title">
            Food License And Registration
            <span> in India</span>
          </h1>

          <p className="lt-foodlicense-description">
            Legal Terminus can help you with obtaining Food License and Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee that starts from Rs. 1,499/-
          </p>

          <div className="lt-foodlicense-features">
            <div className="lt-feature-item"> Mandatory for Food Businesses</div>
            <div className="lt-feature-item"> Nationwide Validity</div>
            <div className="lt-feature-item"> Online Application Process</div>
            <div className="lt-feature-item"> Easy Renewal and Modifications</div>
          </div>

          <div className="lt-foodlicense-highlights">
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
          source="food-license-fssai"
          subtitle="Talk to our Food License registration expert"
        />

      </div>
    </section>
  );
};

export default FoodLicenseBreadcrum;
