import React from "react";
import "./DpartBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const DpartBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Partnership Firm Dissolution
          </span>

          <h1 className="lt-public-title">
            Dissolve a Partnership Firm
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Close It Cleanly &amp; Avoid Disputes</span>
          </h1>

          <p className="lt-public-description">
            Winding down your partnership? Legal Terminus dissolves partnership firms under the Indian Partnership Act, 1932 — drafting a watertight dissolution deed, settling accounts between partners under Section 48, issuing public notice, and intimating the Registrar of Firms. We also help surrender the firm's PAN, GST, and licences and file the final return, so all partner liability ends cleanly and no future disputes arise. Our professional fee starts at ₹4,999 + GST. Stamp duty and out-of-pocket costs are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Dissolution Deed Drafted &amp; Registered</div>
            <div className="lt-feature-item">Settlement of Accounts (Section 48)</div>
            <div className="lt-feature-item">Public Notice &amp; Registrar Intimation</div>
            <div className="lt-feature-item">PAN, GST &amp; Licence Surrender Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,000+</h3>
              <p>Entities closed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end paperwork</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="dpart-consult-form">
          <ConsultationForm
            source="dissolve-partnership"
            subtitle="Talk to our partnership dissolution expert"
          />
        </div>

      </div>
    </section>
  );
};

export default DpartBreadcrum;
