import React from "react";
import "./PtopvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtopvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Proprietorship to Private Limited Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Proprietorship to Private Limited Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Scale Up with a Funding-Ready Structure</span>
          </h1>

          <p className="lt-public-description">
            Ready to scale and raise capital? Legal Terminus converts your sole proprietorship into a Private Limited Company under Section 366 of the Companies Act, 2013 — the statutory route using Form URC-1 and the URC-2 newspaper notice. We bring in your second member/director, handle creditor consent and the audited statement of accounts, and incorporate the Pvt Ltd that takes over your business. You get limited liability, equity-funding ability, and full corporate credibility. Our professional fee starts at ₹9,999 + GST. Government fees, stamp duty &amp; newspaper charges are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Section 366 Conversion via Form URC-1</div>
            <div className="lt-feature-item">Min 2 Members &amp; 2 Directors</div>
            <div className="lt-feature-item">URC-2 Notice &amp; Creditor Consent</div>
            <div className="lt-feature-item">Equity-Funding &amp; ESOP Ready</div>
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

        <div id="ptopvt-consult-form">
          <ConsultationForm
            source="proprietorship-to-private"
            subtitle="Talk to our Pvt Ltd conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtopvtBreadcrum;
