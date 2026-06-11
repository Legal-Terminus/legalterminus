import React from "react";
import "./GstFilingBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const GstFilingBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            GST Return Filing Services
          </span>

          <h1 className="lt-public-title">
            GST Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Accurate, On-Time &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your end-to-end GST return filing — GSTR-1, GSTR-3B, the QRMP quarterly returns, composition GSTR-4, and the annual GSTR-9 / 9C. We reconcile your sales, purchases, and Input Tax Credit (ITC), prepare the returns, and file on the GST portal before every due date so you stay penalty-free. Our professional fee starts at ₹999 + GST per filing period. Any government late fees or interest are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Monthly, Quarterly &amp; Annual Returns Covered</div>
            <div className="lt-feature-item">ITC Reconciliation (GSTR-2B vs Books)</div>
            <div className="lt-feature-item">Due-Date Tracking &amp; Late-Fee Prevention</div>
            <div className="lt-feature-item">Notice, Amendment &amp; Compliance Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>10,000+</h3>
              <p>Returns filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>GST portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="gstf-consult-form">
          <ConsultationForm
            source="gst-return-filing"
            subtitle="Talk to our GST return filing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default GstFilingBreadcrum;
