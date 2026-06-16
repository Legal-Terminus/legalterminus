import React from "react";
import "./PtollpBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtollpBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Partnership to LLP Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Partnership Firm to LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Limited Liability, Same Partners</span>
          </h1>

          <p className="lt-public-description">
            Want limited liability without losing your partnership's continuity? Legal Terminus converts your partnership firm into a Limited Liability Partnership under Section 55 and the Second Schedule of the LLP Act, 2008 — filing Form FiLLiP with Form 17, a CA-certified statement of assets &amp; liabilities, and creditor consent. On conversion, all assets, liabilities, and contracts vest in the LLP automatically by operation of law. You keep the same partners but gain a corporate shield. Our professional fee starts at ₹7,999 + GST. Government fees &amp; stamp duty are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Section 55 Conversion via Form 17 + FiLLiP</div>
            <div className="lt-feature-item">Assets &amp; Liabilities Vest Automatically</div>
            <div className="lt-feature-item">Limited Liability for All Partners</div>
            <div className="lt-feature-item">Lower Compliance Than a Pvt Ltd</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Conversions handled</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end MCA filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="ptollp-consult-form">
          <ConsultationForm
            source="partnership-to-llp"
            subtitle="Talk to our LLP conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtollpBreadcrum;
