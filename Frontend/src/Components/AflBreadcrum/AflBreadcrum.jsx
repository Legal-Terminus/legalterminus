import React from "react";
import "./AflBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const AflBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            LLP Annual Filing &amp; ROC Compliance
          </span>

          <h1 className="lt-public-title">
            Annual Filing for LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">MCA-Compliant, Timely &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your LLP's complete annual ROC compliance under the LLP Act, 2008 — Form 11 (Annual Return), Form 8 (Statement of Account &amp; Solvency), DIR-3 KYC of designated partners, and the LLP's income tax return (ITR-5). We prepare your accounts and filings and submit them to the MCA before every due date so your LLP stays active and penalty-free. Our professional fee starts at ₹2,999 + GST. Government filing fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Form 11 &amp; Form 8 Filing Covered</div>
            <div className="lt-feature-item">Mandatory Even for Zero-Activity LLPs</div>
            <div className="lt-feature-item">DIR-3 KYC &amp; ITR-5 Compliance</div>
            <div className="lt-feature-item">Avoid ₹100/Day Late Penalties</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>LLPs served</p>
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

        <div id="afl-consult-form">
          <ConsultationForm
            source="annual-filing-llp"
            subtitle="Talk to our LLP compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default AflBreadcrum;
