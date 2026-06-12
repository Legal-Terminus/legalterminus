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
            GST Return Filing
          </span>

          <h1 className="lt-public-title">
            GST Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Accurate. Timely. Hassle-Free</span>
          </h1>

          <p className="lt-public-description">
            Every GST-registered business in India must file GST returns monthly, quarterly, or annually based on its registration type and turnover. Timely and accurate GST Return Filing is essential to avoid penalties, ITC mismatches, notices, and compliance risks. With updates such as GSTR-3B auto-locking, the Invoice Management System (IMS), and stricter filing timelines, proper sales and purchase reconciliation has become more important than ever.
          </p>

          <p className="lt-public-description">
            At Legal Terminus, we handle end-to-end GST Return Filing services including GSTR-1, GSTR-3B, GSTR-9, GSTR-9C, CMP-08, and annual return compliance. Our team ensures proper reconciliation, accurate reporting, and timely filing on the official GST portal.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Timely Filing</div>
            <div className="lt-feature-item">GSTR-3B Hard-Lock Ready</div>
            <div className="lt-feature-item">ITC Reconciled</div>
            <div className="lt-feature-item">Late-Fee Zero</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>12,000+</h3>
              <p>GST returns filed</p>
            </div>
            <div>
              <h3>All Return Types</h3>
              <p>GSTR-1 / 3B / 9 / 9C / 4 / IMS</p>
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
