import React from "react";
import "./FoodLicenseBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const FoodLicenseBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Food License (FSSAI) Registration
          </span>

          <h1 className="lt-public-title">
            Food License (FSSAI) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">FSSAI-Certified, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your end-to-end FSSAI Food License Registration — Basic Registration, State License, and Central License — across all food business categories. We handle documentation, FoSCoS portal filing, and government fee payment so your food business is legally compliant from day one. Our professional fee starts at ₹1,499 + GST. Government fees are billed separately at actuals per the FSSAI tariff.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for All Food Businesses (FBOs)</div>
            <div className="lt-feature-item">Basic, State &amp; Central License Covered</div>
            <div className="lt-feature-item">FoSCoS Portal Filing &amp; Govt Fee Coordination</div>
            <div className="lt-feature-item">Renewal, Amendment &amp; Compliance Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>FSSAI licenses obtained</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>FoSCoS portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="fl-consult-form">
          <ConsultationForm
            source="food-license-fssai"
            subtitle="Talk to our FSSAI registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default FoodLicenseBreadcrum;
