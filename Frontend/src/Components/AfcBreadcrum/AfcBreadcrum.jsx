import React from "react";
import "./AfcBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const AfcBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Company Annual Filing &amp; ROC Compliance
          </span>

          <h1 className="lt-public-title">
            Annual Filing for Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">MCA-Compliant, Timely &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your company's complete annual ROC compliance under the Companies Act, 2013 — AOC-4 (financials), MGT-7 / MGT-7A (annual return), ADT-1 (auditor appointment), DIR-3 KYC, and DPT-3. We prepare your financial statements, Director's Report, and board/AGM documentation and e-file with the MCA before every due date. Our professional fee starts at ₹4,999 + GST. Government filing fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">AOC-4, MGT-7 &amp; ADT-1 Filing Covered</div>
            <div className="lt-feature-item">Board Meeting, AGM &amp; Director's Report</div>
            <div className="lt-feature-item">DIR-3 KYC &amp; DPT-3 Compliance</div>
            <div className="lt-feature-item">Avoid ₹100/Day Late Penalties</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Companies served</p>
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

        <div id="afc-consult-form">
          <ConsultationForm
            source="annual-filing-company"
            subtitle="Talk to our company compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default AfcBreadcrum;
