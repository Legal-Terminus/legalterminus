import React from "react";
import "./TmrnwBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmrnwBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Renewal &amp; Restoration
          </span>

          <h1 className="lt-public-title">
            Trademark Renewal
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Keep Your Brand Protected, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus handles your trademark renewal under Section 25 of the Trade Marks Act, 1999 — filing Form TM-R to extend your registered mark for another 10 years, with restoration support if it has lapsed. A registered trademark must be renewed every 10 years; miss it and you risk losing the rights you built. We track your deadline and file ahead of time. Our professional fee starts at ₹1,999 + GST per class. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Renew for Another 10 Years (Form TM-R)</div>
            <div className="lt-feature-item">File up to 1 Year Before Expiry</div>
            <div className="lt-feature-item">Grace-Period &amp; Restoration Support</div>
            <div className="lt-feature-item">Deadline Tracking &amp; Reminders</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Trademarks managed</p>
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

        <div id="tmrnw-consult-form">
          <ConsultationForm
            source="trademark-renewal"
            subtitle="Talk to our trademark renewal expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmrnwBreadcrum;
