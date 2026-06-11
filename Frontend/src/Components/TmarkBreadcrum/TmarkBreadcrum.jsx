import React from "react";
import "./TmarkBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmarkBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Registration &amp; Application
          </span>

          <h1 className="lt-public-title">
            Trademark Application
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Use the ™ from Day One, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus handles your end-to-end trademark application under the Trade Marks Act, 1999 — free trademark search, correct class selection across the 45 Nice classes, TM-A filing on the IP India portal, and examination &amp; objection support right up to registration. You can start using the ™ symbol as soon as the application is filed. Our professional fee starts at ₹1,499 + GST per class. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Free Trademark Search &amp; Class Advice</div>
            <div className="lt-feature-item">TM-A Filing on the IP India Portal</div>
            <div className="lt-feature-item">Use ™ Immediately After Filing</div>
            <div className="lt-feature-item">Examination &amp; Objection Reply Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Trademarks filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>IP India portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of IP Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmark-consult-form">
          <ConsultationForm
            source="trademark-application"
            subtitle="Talk to our trademark registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmarkBreadcrum;
