import React from "react";
import "./ProFPLCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="ProPrietorship-plc-Bc-public-hero">
      <div className="ProPrietorship-plc-Bc-public-container">

        {/* LEFT CONTENT */}
        <div className="ProPrietorship-plc-Bc-public-content">

          <span className="ProPrietorship-plc-Bc-public-tag">
            Private Limited Company Registration
          </span>

          <h1 className="ProPrietorship-plc-Bc-public-title">
            Private Limited Company Registration
            <span> in India</span>
          </h1>

          <p className="ProPrietorship-plc-Bc-public-description">
            A Private Limited Company is a popular and trusted business structure in India, especially for startups and growing businesses. It helps protect personal assets, builds business credibility, and makes it easier to raise funds.
            <br /><br />
            Legal Terminus can help you with Private Limited Company registration in a hassle-free way, whenever you need it.
          </p>

          <div className="ProPrietorship-plc-Bc-public-features">
            <div className="ProPrietorship-plc-Bc-feature-item">Minimum 2 Directors Required</div>
            <div className="ProPrietorship-plc-Bc-feature-item">Separate Legal Entity</div>
            <div className="ProPrietorship-plc-Bc-feature-item">Limited Liability Protection</div>
            <div className="ProPrietorship-plc-Bc-feature-item">High Business Credibility</div>
          </div>

          <div className="ProPrietorship-plc-Bc-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="proprietorship-to-plc"
          subtitle="Talk to our Private Limited Company registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
