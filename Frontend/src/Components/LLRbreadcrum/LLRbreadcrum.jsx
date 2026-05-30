import React from "react";
import "./LLRbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
          Labour Licence Registration
          </span>

          <h1 className="lt-public-title">
           Labour Licence Registration
           <br></br>
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with Labour License Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee which starts from Rs. 11,999/- + Applicable Government Fees
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Validity Period 1 Year</div>
            <div className="lt-feature-item"> Apply 30 days before expiry</div>
            <div className="lt-feature-item"> Renew on time to prevent fines</div>
            <div className="lt-feature-item"> Simple documentation support</div>
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
          source="llr-registration"
          subtitle="Talk to our Labour License registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
