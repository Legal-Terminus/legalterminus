import React from "react";
import "./CIRbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="at-public-hero">
      <div className="at-public-container">

        {/* LEFT CONTENT */}
        <div className="at-public-content">

          <span className="at-public-tag">
           Change in Registered Office Address 
          </span>

          <h1 className="at-public-title">
           Change in Registered Office Address (LLP) 
          </h1>

          <p className="at-public-description">
            Legal Terminus can help you with change in Registered Office Address of your LLP in a hassle-free manner within a reasonable time span and for competitive professional fee which starts from Rs. 2499/- excluding Govt. Fees.
          </p>

          <div className="at-public-features">
            <div className="at-feature-item"> Partner Approval Required</div>
            <div className="at-feature-item"> Filing with Registrar (ROC)</div>
            <div className="at-feature-item"> Address Proof & NOC Required</div>
            <div className="at-feature-item"> Additional Approval for Inter-State Shift</div>
          </div>

          <div className="at-public-highlights">
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
          source="cir-registration"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
