import React from "react";
import "./TMApplicaBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            TRADEMARK REGISTRATION IN INDIA
          </span>

          <h1 className="lt-public-title">
            Trademark Registration
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus helps you secure your brand name, logo, or slogan — fast, right, and stress-free. We handle everything from trademark search to filing Form TM-A, so you don't have to decode government portals at 2 AM. Professional fees start at ₹1,499. Gov fees extra (₹4,500 for individuals/MSMEs, ₹9,000 for companies — per class).
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Valuable Business Asset</div>
            <div className="lt-feature-item"> Valid for 10 Years</div>
            <div className="lt-feature-item"> Use ™ Symbol Immediately</div>
            <div className="lt-feature-item"> Legal Protection Against Infringement</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,000+</h3>
              <p>Trademarks Filed</p>
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
          source="trademark-application"
          subtitle="Talk to our Trademark registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
