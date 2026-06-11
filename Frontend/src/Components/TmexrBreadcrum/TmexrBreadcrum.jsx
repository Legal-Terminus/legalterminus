import React from "react";
import "./TmexrBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmexrBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Examination Report Reply
          </span>

          <h1 className="lt-public-title">
            Reply to Trademark Objection
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Beat the Objection, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Got a trademark objection? Legal Terminus drafts and files a strong, attorney-prepared reply to your trademark examination report under the Trade Marks Act, 1999 — addressing objections under Section 9 (descriptive/non-distinctive) and Section 11 (similar existing marks). The reply must be filed within 30 days of the report, or your application is treated as abandoned. We act fast and argue your case with case-law citations. Our professional fee starts at ₹1,999 + GST.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Attorney-Drafted Objection Reply</div>
            <div className="lt-feature-item">Section 9 &amp; Section 11 Objections</div>
            <div className="lt-feature-item">Filed Within the 30-Day Deadline</div>
            <div className="lt-feature-item">Hearing Preparation &amp; Representation</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Replies &amp; filings handled</p>
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

        <div id="tmexr-consult-form">
          <ConsultationForm
            source="trademark-exam-reply"
            subtitle="Talk to our trademark objection expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmexrBreadcrum;
