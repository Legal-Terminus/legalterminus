import React from "react";
import "./PtpvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtpvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Partnership Firm to Private Limited Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Partnership Firm to Private Limited Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Gain Limited Liability &amp; Become Investor-Ready</span>
          </h1>

          <p className="lt-public-description">
            Ready to give your partnership firm limited liability, a separate legal identity, and the ability to raise equity? Legal Terminus converts your partnership firm into a Private Limited Company under Section 366 of the Companies Act, 2013 — filing Form URC-1 with SPICe+, the URC-2 newspaper notice, an NOC from the Registrar of Firms and creditors, and a CA-certified statement of accounts. All partners become shareholders and the business continues seamlessly under a share-capital structure that banks and investors prefer. Our professional fee starts at ₹11,999 + GST. Government fees, stamp duty &amp; newspaper charges are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Section 366 Conversion via Form URC-1</div>
            <div className="lt-feature-item">Limited Liability &amp; Separate Legal Entity</div>
            <div className="lt-feature-item">URC-2 Notice &amp; Creditor NOC</div>
            <div className="lt-feature-item">All Partners Become Shareholders</div>
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

        <div id="ptpvt-consult-form">
          <ConsultationForm
            source="partnership-to-private"
            subtitle="Talk to our Partnership-to-Pvt-Ltd conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtpvtBreadcrum;
