import React from "react";
import "./PFRbreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
           Partnership Firm Registration 
          </span>

          <h1 className="lt-public-title">
            Partnership Firm Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Quick &amp; Professional</span>
          </h1>

          <p className="lt-public-description">
            The simplest way for two or more co-founders to start trading — governed by the Indian Partnership Act, 1932. Cheap to set up, light on compliance, and (with registration) gives you the legal right to enforce your Partnership Deed in court. Our professional fee starts at ₹2,499 + GST. Stamp duty, RoF fees, and notarisation are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Minimum 2 Partners Required</div>
            <div className="lt-feature-item">Easy to Start &amp; Manage</div>
            <div className="lt-feature-item">Flexible Profit Sharing</div>
            <div className="lt-feature-item">Low Compliance Requirement</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Partnership Firms registered</p>
            </div>
            <div>
              <h3>28 States</h3>
              <p>RoF coverage across India</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="pfr-consult-form">
          <ConsultationForm
            source="pf-registration"
            subtitle="Talk to our Partnership Firm Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default Breadcrum;
