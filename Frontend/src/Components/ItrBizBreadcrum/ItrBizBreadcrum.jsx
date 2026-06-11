import React from "react";
import "./ItrBizBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const ItrBizBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Business Income Tax Return Filing
          </span>

          <h1 className="lt-public-title">
            ITR Filing for Business
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">CA-Assisted, Accurate &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus handles end-to-end business income tax return filing — ITR-3, ITR-4 (presumptive), ITR-5 (firms &amp; LLPs), and ITR-6 (companies). We compute your business income, claim every eligible deduction, reconcile with GST and Form 26AS/AIS, and e-file with verification so you stay fully compliant. Our professional fee starts at ₹1,499 + GST. Tax audit under Section 44AB, where applicable, is quoted separately.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Proprietor, Firm, LLP &amp; Company Covered</div>
            <div className="lt-feature-item">Presumptive Scheme (44AD / 44ADA / 44AE)</div>
            <div className="lt-feature-item">26AS / AIS &amp; GST Reconciliation</div>
            <div className="lt-feature-item">Tax Audit &amp; Notice Support Available</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>10,000+</h3>
              <p>Returns filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>CA-assisted e-filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Tax Expertise</p>
            </div>
          </div>

        </div>

        <div id="itrbiz-consult-form">
          <ConsultationForm
            source="itr-business"
            subtitle="Talk to our business ITR filing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default ItrBizBreadcrum;
