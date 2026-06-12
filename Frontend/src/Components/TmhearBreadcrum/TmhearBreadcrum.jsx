import React from "react";
import "./TmhearBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmhearBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Hearing Representation
          </span>

          <h1 className="lt-public-title">
            Trademark Hearing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Expert Representation, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Got a trademark hearing notice? Legal Terminus prepares and represents you at show-cause and opposition hearings before the Trade Marks Registry under the Trade Marks Act, 1999. Our trademark attorneys draft written submissions, organise your evidence, and argue your case at the virtual hearing so your application has the strongest chance of acceptance. Missing or mishandling a hearing can mean refusal — we make sure you walk in prepared. Our professional fee starts at ₹2,999 + GST per hearing.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Show-Cause &amp; Opposition Hearings</div>
            <div className="lt-feature-item">Written Submissions &amp; Case Strategy</div>
            <div className="lt-feature-item">Attorney Representation (Video Hearing)</div>
            <div className="lt-feature-item">Adjournment &amp; Follow-Up Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>TM matters handled</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>Virtual hearing support</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of IP Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmhear-consult-form">
          <ConsultationForm
            source="trademark-hearing"
            subtitle="Talk to our trademark hearing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmhearBreadcrum;
