import React from "react";
import "./OPCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            One Person Company Registration
          </span>

          <h1 className="lt-public-title">
            One Person Company (OPC) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Reliable, Compliant &amp; 100% Transparent</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can assist you with the one person company (OPC) registration in India. We ensure a hassle-free process completed within a reasonable timeframe, with competitive professional fees starting from Rs. 3,999/-.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Single Owner Structure</div>
            <div className="lt-feature-item"> Separate Legal Entity</div>
            <div className="lt-feature-item"> Limited Liability Protection</div>
            <div className="lt-feature-item"> Suitable for Small Business / Solo Founder</div>
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
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="opc-registration"
          subtitle="Talk to our OPC registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
