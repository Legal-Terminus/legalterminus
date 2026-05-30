import React from "react";
import "./PartnershiptoPrivateBreadcrumb.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="Partnership-to-PLC-public-hero">
      <div className="Partnership-to-PLC-public-container">

        {/* LEFT CONTENT */}
        <div className="Partnership-to-PLC-public-content">

          <span className="Partnership-to-PLC-public-tag">
            Conversion of Partnership firm into Private Limited Company
          </span>

          <h1 className="Partnership-to-PLC-public-title">
            Partnership firm into Private Limited Company
          </h1>

          <p className="Partnership-to-PLC-public-description">
            Legal Terminus can help you with Conversion of Partnership into Private Limited Company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees.
          </p>

          <div className="Partnership-to-PLC-public-features">
            <div className="Partnership-to-PLC-feature-item"> Minimum 2 Directors Required</div>
            <div className="Partnership-to-PLC-feature-item"> 5 Steps Procedure</div>
            <div className="Partnership-to-PLC-feature-item"> 40 - 50 Working Days</div>
            <div className="Partnership-to-PLC-feature-item"> High Business Credibility</div>
          </div>

          <div className="Partnership-to-PLC-public-highlights">
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
          source="partnership-to-private"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
