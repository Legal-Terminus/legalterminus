import React from "react";
import "./IncreaseBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const IncreaseBreadcrum = () => {
  return (
    <section className="Increase-public-hero">
      <div className="Increase-public-container">

        {/* LEFT CONTENT */}
        <div className="Increase-public-content">

          <span className="Increase-public-tag">
            Increase Authorized Share Capital
          </span>

          <h1 className="Increase-public-title">
            Increase in Authorised Capital (Company)
          </h1>

          <p className="Increase-public-description">
            Legal Terminus can help you with Increase Authorized Share Capital of your company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 2499/-.
          </p>

          <div className="Increase-public-features">
            <div className="Increase-feature-item"> Business Expansion Support</div>
            <div className="Increase-feature-item"> Improved Investment Opportunities</div>
            <div className="Increase-feature-item"> Better Financial Flexibility</div>
            <div className="Increase-feature-item"> Enhanced Market Credibility</div>
          </div>

          <div className="Increase-public-highlights">
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
          source="increase-capital"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default IncreaseBreadcrum;
