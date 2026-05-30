import React from "react";
import "./DPBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const DPBreadcrum = () => {
  return (
    <section className="DP-public-hero">
      <div className="DP-public-container">

        {/* LEFT CONTENT */}
        <div className="DP-public-content">

          <span className="DP-public-tag">
            Dissolve a Partnership Firm
          </span>

          <h1 className="DP-public-title">
            Winding Up of a Partnership Firm
          </h1>

          <p className="DP-public-description">
            Legal Terminus can help you with Dissolution of Partnership Firm in a hassle-free manner within a reasonable time span and a competitive Professional fee which starts from Rs. 2999/-
          </p>

          <div className="DP-public-features">
            <div className="DP-feature-item"> Minimum 2 Partners Required</div>
            <div className="DP-feature-item"> Clear all business debts and liabilities</div>
            <div className="DP-feature-item"> Settle accounts among partners</div>
            <div className="DP-feature-item"> Close the firm legally with proper documentation</div>
          </div>

          <div className="DP-public-highlights">
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
          source="director-partner"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default DPBreadcrum;
