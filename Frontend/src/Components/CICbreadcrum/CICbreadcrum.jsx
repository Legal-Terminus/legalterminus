import React from "react";
import "./CICbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="cic-public-hero">
      <div className="cic-public-container">

        {/* LEFT CONTENT */}
        <div className="cic-public-content">

          <span className="cic-public-tag">
            Change Company Name
          </span>

          <h1 className="cic-public-title">
            Change In Name(Company)
          </h1>

          <p className="cic-public-description">
            Legal Terminus can help you with change company name in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 5999/-.
          </p>

          <div className="cic-public-features">
            <div className="cic-feature-item"> Minimum 2 Directors Required</div>
            <div className="cic-feature-item"> Separate Legal Entity</div>
            <div className="cic-feature-item"> Limited Liability Protection</div>
            <div className="cic-feature-item"> High Business Credibility</div>
          </div>

          <div className="cic-public-highlights">
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
          source="cic-registration"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
