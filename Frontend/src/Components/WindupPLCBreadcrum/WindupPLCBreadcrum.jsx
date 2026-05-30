import React from "react";
import "./WindupPLCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const WindupPLCBreadcrum = () => {
  return (
    <section className="Windup-PLC-bd-hero">
      <div className="Windup-PLC-bd-container">

        {/* LEFT CONTENT */}
        <div className="Windup-PLC-bd-content">

          <span className="Windup-PLC-bd-tag">
            Private Limited Company Registration
          </span>

          <h1 className="Windup-PLC-bd-title">
            Private Limited Company Registration
            <span> in India</span>
          </h1>

          <p className="Windup-PLC-bd-description">
            A Private Limited Company is a popular and trusted business structure in India, especially for startups and growing businesses. It helps protect personal assets, builds business credibility, and makes it easier to raise funds.

<br/><br/>
Legal Terminus can help you with Private Limited Company registration in a hassle-free way, whenever you need it. We take care of the complete process—from paperwork to approvals—within a reasonable time. Our professional fees start at ₹3,999, making company registration simple, affordable, and stress-free.

          </p>

          <div className="Windup-PLC-bd-features">
            <div className="Windup-PLC-bd-feature-item"> Minimum 2 Directors Required</div>
            <div className="Windup-PLC-bd-feature-item"> Separate Legal Entity</div>
            <div className="Windup-PLC-bd-feature-item"> Limited Liability Protection</div>
            <div className="Windup-PLC-bd-feature-item"> High Business Credibility</div>
          </div>

          <div className="Windup-PLC-bd-highlights">
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
          source="windup-plc"
          subtitle="Talk to our Private Limited Company registration expert"
        />

      </div>
    </section>
  );
};

export default WindupPLCBreadcrum;
