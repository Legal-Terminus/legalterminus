import React from "react";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";

const ProfTaxBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Professional Tax Registration &amp; Return Filing
          </span>

          <h1 className="lt-public-title">
            Professional Tax Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Simple, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Stay compliant with state Professional Tax laws — from employer registration and employee deductions to timely return filing. Legal Terminus manages your complete Professional Tax compliance so you never miss a deadline. Our professional fee starts at ₹999 + GST. Government fees are billed separately at actuals. No hidden charges. No surprises.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Employer &amp; Self-Employed Registration</div>
            <div className="lt-feature-item">All Major States Covered</div>
            <div className="lt-feature-item">Monthly &amp; Quarterly Return Filing</div>
            <div className="lt-feature-item">Penalty Protection &amp; Compliance Calendar</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,200+</h3>
              <p>PT registrations handled</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>State portal e-filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="proftax-consult-form">
          <ConsultationForm
            source="professional-tax-registration"
            subtitle="Talk to our Professional Tax expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ProfTaxBreadcrum;
