import React from "react";
import "./CIObreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="qt-public-hero">
      <div className="qt-public-container">

        {/* LEFT CONTENT */}
        <div className="qt-public-content">

          <span className="qt-public-tag">
           Changing the Objects of LLP 
          </span>

          <h1 className="qt-public-title">
           Change in Object (LLP)
          </h1>

          <p className="qt-public-description">
            Legal Terminus can help you with changing the objects of LLP, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2499/- excluding Govt. Fees.
          </p>

          <div className="qt-public-features">
            <div className="qt-feature-item"> Partner Approval Required</div>
            <div className="qt-feature-item"> Amendment of LLP Agreement</div>
            <div className="qt-feature-item"> Filing with Registrar (ROC)</div>
            <div className="qt-feature-item"> Legal Expansion of Business Activities</div>
          </div>

          <div className="qt-public-highlights">
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
          source="cio-registration"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
