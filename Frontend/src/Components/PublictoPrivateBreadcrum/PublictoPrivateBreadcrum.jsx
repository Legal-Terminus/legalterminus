import React from "react";
import "./PublictoPrivateBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const PublicBreadcrum = () => {
  return (
    <section className="plt-bc-hero">
      <div className="plt-bc-container">

        {/* LEFT CONTENT */}
        <div className="plt-bc-content">

          <span className="plt-bc-tag">
            Public Limited Company Registration
          </span>

          <h1 className="plt-bc-title">
            Public Limited Company Registration
            <span> in India</span>
          </h1>

          <p className="plt-bc-description">
            A Public Limited Company is a trusted and scalable business structure
            ideal for large enterprises looking to raise capital from the public.
            Legal Terminus assists you with complete Public Limited Company
            registration in India, ensuring legal accuracy, regulatory compliance,
            and timely approval.
          </p>

          <div className="plt-bc-features">
            <div className="plt-bc-feature-item"> Minimum 7 Shareholders Required</div>
            <div className="plt-bc-feature-item"> Suitable for Fundraising & IPO</div>
            <div className="plt-bc-feature-item"> Limited Liability Protection</div>
            <div className="plt-bc-feature-item"> High Business Credibility</div>
          </div>

          <div className="plt-bc-highlights">
            <div>
              <h3>12,000+</h3>
              <p>Companies Registered</p>
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
          source="public-to-private"
          subtitle="Talk to our Public Company registration expert"
        />

      </div>
    </section>
  );
};

export default PublicBreadcrum;
