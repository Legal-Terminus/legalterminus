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
            Trademark Registration Filing
          </span>

          <h1 className="lt-public-title">
            Trademark Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Use the ™ from Day One, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Your brand name, logo, tagline, or business identity is one of your most valuable business assets. With proper Trademark Application Filing under the Trade Marks Act, 1999, you get the legal right to protect your brand from unauthorized use and misuse across India.
            <br /><br />
            A registered trademark gives your business exclusive rights over its brand identity and provides legal protection against unauthorized use, copying, or infringement. It also allows you to use the ® symbol after registration, enhances brand credibility and value, and offers protection for 10 years, with the option for unlimited renewals.
            <br /><br />
            At Legal Terminus, we handle the complete Trademark Application Filing process for you — from trademark search to application filing on the official IP India portal.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">TM-A Filed</div>
            <div className="lt-feature-item">Brand Secure</div>
            <div className="lt-feature-item">Regular Status Updates</div>
            <div className="lt-feature-item">Start Using ™ Symbol After Filing</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,500+</h3>
              <p>Trademark applications filed</p>
            </div>
            <div>
              <h3>All 45 Classes</h3>
              <p>Goods + Services covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
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
