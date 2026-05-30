import React from "react";
import "./TrademarktoHearingBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const TradeLicenseBreadcrum = () => {
  return (
    <section className="thbr-hero">
      <div className="thbr-container">

        {/* LEFT CONTENT */}
        <div className="thbr-content">

          <span className="thbr-tag">
            Trade License Online Registration
          </span>

          <h1 className="thbr-title">
            Trade License Online Registration
            <span> in India</span>
          </h1>

          <p className="thbr-description">
            Legal Terminus can help you with Trade License registration in a smooth and hassle-free manner. We offer competitive professional fees starting at Rs. 3,999/- for Trade License registration in India.
          </p>

          <div className="thbr-features">
            <div className="thbr-feature-item"> Minimum 2 Directors Required</div>
            <div className="thbr-feature-item"> Separate Legal Entity</div>
            <div className="thbr-feature-item"> Limited Liability Protection</div>
            <div className="thbr-feature-item"> High Business Credibility</div>
          </div>

          <div className="thbr-highlights">
            <div>
              <h3>12,000+</h3>
              <p>Licenses Registered</p>
            </div>
            <div>
              <h3>99%</h3>
              <p>Approval Success Rate</p>
            </div>
            <div>
              <h3>15+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="trademark-hearing"
          subtitle="Talk to our Trade License registration expert"
        />

      </div>
    </section>
  );
};

export default TradeLicenseBreadcrum;
