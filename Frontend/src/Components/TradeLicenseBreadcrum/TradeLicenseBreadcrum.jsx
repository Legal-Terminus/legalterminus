import React from "react";
import "./TradeLicensebreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const TradeLicenseBreadcrum = () => {
  return (
    <section className="lt-trade-hero">
      <div className="lt-trade-container">

        {/* LEFT CONTENT */}
        <div className="lt-trade-content">

          <span className="lt-trade-tag">
            Trade License Registration
          </span>

          <h1 className="lt-trade-title">
            Trade License Registration
            <br></br>
            <span> in India</span>
          </h1>

          <p className="lt-trade-description">
            Legal Terminus can help you with the Trade License Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/- (excluding government fees).
          </p>

          <div className="lt-trade-features">
            <div className="lt-feature-item"> Required 7 to 10 Working Days</div>
            <div className="lt-feature-item"> 1 Year Validity</div>
            <div className="lt-feature-item"> 5 Steps Processes</div>
            <div className="lt-feature-item"> Renewal at before 31st March of Every Year</div>
          </div>

          <div className="lt-trade-highlights">
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
          source="trade-license"
          subtitle="Talk to our Trade License registration expert"
        />

      </div>
    </section>
  );
};

export default TradeLicenseBreadcrum;
