import React from "react";
import "./DllpBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const DllpBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            LLP Closure &amp; Strike-Off
          </span>

          <h1 className="lt-public-title">
            Dissolve an LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Close It Cleanly with Form 24, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Not operating your LLP any more? Legal Terminus closes inactive Limited Liability Partnerships through strike-off by filing Form 24 with the ROC under Rule 37 of the LLP Rules, 2009 — along with the partners' consent, affidavit, indemnity, and a CA-certified statement of accounts. Striking off ends your Form 8 and Form 11 filing burden and stops the uncapped ₹100/day penalties. Our professional fee starts at ₹7,999 + GST. Government and out-of-pocket costs are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Strike-Off via Form 24 (Rule 37)</div>
            <div className="lt-feature-item">Stops Uncapped ₹100/Day Penalties</div>
            <div className="lt-feature-item">Affidavit, Indemnity &amp; Accounts Drafted</div>
            <div className="lt-feature-item">End-to-End ROC Coordination</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,000+</h3>
              <p>Entities closed</p>
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

        <div id="dllp-consult-form">
          <ConsultationForm
            source="dissolve-llp"
            subtitle="Talk to our LLP closure expert"
          />
        </div>

      </div>
    </section>
  );
};

export default DllpBreadcrum;
