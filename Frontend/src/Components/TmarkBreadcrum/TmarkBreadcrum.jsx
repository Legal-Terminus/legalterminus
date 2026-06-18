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
            <span className="lt-title-tagline">Exclusive Rights for Your Brand</span>
          </h1>

          <p className="lt-public-description">
            Your brand name, logo, tagline, and business identity are valuable business assets. Filing a trademark application under the Trade Marks Act, 1999 helps secure legal protection for your brand and prevents unauthorized use or misuse across India.
            <br /><br />
            A registered trademark grants exclusive rights over your brand, enhances credibility and business value, and allows you to use the ® symbol after registration. Trademark protection is valid for 10 years and can be renewed indefinitely.
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
