import React from "react";
import "./CacomBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const CacomBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Change of Registered Office
          </span>

          <h1 className="lt-public-title">
            Change a Company's Registered Address
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Shift Your Registered Office, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Relocating your company? Legal Terminus handles the change of registered office under Section 12 of the Companies Act, 2013 — whether within the same city, to another city in the state, or from one state to another. We draft the board and special resolutions, file Form INC-22 (and MGT-14 / INC-23 / INC-28 where required), and obtain Regional Director approval for a state change. We then help update PAN, GST, bank, and licences. Our professional fee starts at ₹2,999 + GST. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Within City, Within State or State-to-State</div>
            <div className="lt-feature-item">Form INC-22 Filed Within 30 Days</div>
            <div className="lt-feature-item">RD Approval for State Change</div>
            <div className="lt-feature-item">PAN, GST &amp; Bank Update Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Updations filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end MCA filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="cacom-consult-form">
          <ConsultationForm
            source="change-address-company"
            subtitle="Talk to our registered office change expert"
          />
        </div>

      </div>
    </section>
  );
};

export default CacomBreadcrum;
