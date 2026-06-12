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
            Trademark Opposition &amp; Defence
          </span>

          <h1 className="lt-public-title">
            Trademark Opposition
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Oppose or Defend, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus handles both sides of a trademark opposition under the Trade Marks Act, 1999 — filing a Notice of Opposition (Form TM-O) to block a conflicting mark published in the Trademark Journal, or defending your own application with a strong Counter-Statement and evidence. The journal opens a 4-month opposition window, and a counter-statement must be filed within 2 months of receiving an opposition or the application is abandoned. We act on time and argue your case end-to-end. Our professional fee starts at ₹4,999 + GST.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">File or Defend Notice of Opposition (TM-O)</div>
            <div className="lt-feature-item">Counter-Statement Within 2 Months</div>
            <div className="lt-feature-item">Evidence Affidavits &amp; Hearing Support</div>
            <div className="lt-feature-item">4-Month Journal Window Monitoring</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>TM matters handled</p>
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
