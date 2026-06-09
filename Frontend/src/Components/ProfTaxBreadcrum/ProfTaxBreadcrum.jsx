import React from "react";
import "./ProfTaxBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const ProfTaxBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Professional Tax Registration
          </span>

          <h1 className="lt-public-title">
            Professional Tax (PT) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">State-Wise, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your end-to-end Professional Tax Registration — Employer Certificate (EC) and Employee Certificate (RC) — across all PT-applicable states. We handle documentation, state portal filing, and government fee payment so you stay compliant from day one. Our professional fee starts at ₹999 + GST. Government fees vary by state and are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Employer &amp; Employee Certificate</div>
            <div className="lt-feature-item">All PT-Applicable States Covered</div>
            <div className="lt-feature-item">Monthly / Annual Return Filing</div>
            <div className="lt-feature-item">Avoid Penalties &amp; Stay Compliant</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,200+</h3>
              <p>PT registrations done</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>State portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="pt-consult-form">
          <ConsultationForm
            source="professional-tax"
            subtitle="Talk to our PT registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ProfTaxBreadcrum;
