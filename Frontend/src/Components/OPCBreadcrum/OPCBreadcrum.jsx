import React from "react";
import "./OPCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            One Person Company Registration
          </span>

          <h1 className="lt-public-title">
            One Person Company (OPC) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Simple, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Turn your solo business idea into a legally recognized company. Legal Terminus manages your complete One Person Company (OPC) registration — from name approval to Certificate of Incorporation — so you can focus on growing your business with confidence. Our professional fee starts at ₹4,999 + GST. Government fees, stamp duty, and DSC charges are billed separately at actuals. No partner. No padding. No surprises.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Only 1 Director and shareholder Required</div>
            <div className="lt-feature-item">Separate Legal Identity</div>
            <div className="lt-feature-item">Limited Liability Protection</div>
            <div className="lt-feature-item">Ideal for Solo Entrepreneurs</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>800+</h3>
              <p>OPCs incorporated</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + Aadhaar e-KYC</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="opc-registration"
          subtitle="Talk to our OPC registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
