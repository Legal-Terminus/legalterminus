import React from "react";
import "./TMRenewBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="Tm-hero">
      <div className="Tm-container">

        {/* LEFT CONTENT */}
        <div className="Tm-content">

          <span className="Tm-tag">
            Trademark Renewal
          </span>

          <h1 className="Tm-title">
            Trademark Renewal
            <span> in India</span>
          </h1>

          <p className="Tm-description">
            Legal Terminus can help you with obtaining Trademark Renewal in India for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/-.
          </p>

          <div className="Tm-features">
            <div className="lt-feature-item"> Continued Legal Protection</div>
            <div className="lt-feature-item"> Prevents Removal from Register</div>
            <div className="lt-feature-item"> Maintains Exclusive Rights</div>
            <div className="lt-feature-item"> Protects Brand Value</div>
          </div>

          <div className="Tm-highlights">
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
          source="trademark-renewal"
          subtitle="Talk to our Trademark renewal expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
