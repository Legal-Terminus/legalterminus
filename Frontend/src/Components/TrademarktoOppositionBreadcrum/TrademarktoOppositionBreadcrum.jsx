import React from "react";
import "./TrademarktoOppositionBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const TradeLicenseBreadcrum = () => {
  return (
    <section className="tlbcr-hero">
      <div className="tlbcr-container">

        {/* LEFT CONTENT */}
        <div className="tlbcr-content">

          <span className="tlbcr-tag">
            Trademark Opposition
          </span>

          <h1 className="tlbcr-title">
            Trademark Opposition
            <span> in India</span>
          </h1>

          <p className="tlbcr-description">
              Legal Terminus can help you with the process of the Trademark Opposition in India for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 4,999/- excluding government fees.
          </p>

          <div className="tlbcr-features">
            <div className="tlbcr-feature-item"> Legal Protection for Your Brand</div>
            <div className="tlbcr-feature-item"> Strong Legal Representation</div>
            <div className="tlbcr-feature-item"> Prevent Brand Misuse</div>
            <div className="tlbcr-feature-item"> Protect Business Reputation</div>
          </div>

          <div className="tlbcr-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Licenses Registered</p>
            </div>
            <div>
              <h3>99%</h3>
              <p>Approval Success Rate</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="trademark-opposition"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default TradeLicenseBreadcrum;
