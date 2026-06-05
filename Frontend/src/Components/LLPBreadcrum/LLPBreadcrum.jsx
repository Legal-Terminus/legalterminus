import React from "react";
import "./LLPBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const LLPBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
           Limited Liability Partnership Registration
          </span>

          <h1 className="lt-public-title">
            Limited Liability Partnership Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Protect Your Future | 100% Online</span>
          </h1>

          <p className="lt-public-description">
            All the upside of a partnership. None of the unlimited liability. LLP gives you a separate legal entity, limited partner liability, no minimum capital, and Small-LLP audit exemption — all under the LLP Act, 2008. Our professional fee starts at ₹4,499 + GST. Government fees, stamp duty, and DSC charges are billed separately at actuals. Co-founders welcome. Audits, mostly not.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Minimum 2 Designated Partners Required</div>
            <div className="lt-feature-item">Separate Legal Entity</div>
            <div className="lt-feature-item">Zero Minimum Capital</div>
            <div className="lt-feature-item">Lower Compliance Burden</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>400+</h3>
              <p>LLPs incorporated</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + FiLLiP</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="llp-consult-form">
          <ConsultationForm
            source="llp-registration"
            subtitle="Talk to our LLP registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default LLPBreadcrum;
