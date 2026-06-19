import React from "react";
import "./TmoppBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmoppBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Opposition
          </span>

          <h1 className="lt-public-title">
            Trademark Opposition
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Protect Your Brand Rights</span>
          </h1>

          <p className="lt-public-description">
            Trademark Opposition may arise when you want to challenge a similar trademark published in the Trade Marks Journal or when someone opposes your own trademark application. Both situations are governed by Section 21 of the Trade Marks Act, 1999 and the Trade Marks Rules, 2017. Legal Terminus assists with filing Notices of Opposition as well as drafting and filing Counter Statements to protect your trademark rights.
            <br /><br />
            Timely action is essential, as missing the prescribed deadline for filing a Counter Statement may result in abandonment of the application. Our plans start from ₹5,999 + GST for 1 trademark in 1 class and include professional drafting, filing support, evidence coordination, hearing assistance, and regular status updates throughout the process.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Strict Deadline Tracking</div>
            <div className="lt-feature-item">Professional Legal Drafting</div>
            <div className="lt-feature-item">Monthly Updates</div>
            <div className="lt-feature-item">Full Hearing Coverage</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1000+</h3>
              <p>Opposition matters handled</p>
            </div>
            <div>
              <h3>12 Years</h3>
              <p>of IP / opposition expertise</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmopp-consult-form">
          <ConsultationForm
            source="trademark-opposition"
            subtitle="Talk to our trademark opposition expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmoppBreadcrum;
