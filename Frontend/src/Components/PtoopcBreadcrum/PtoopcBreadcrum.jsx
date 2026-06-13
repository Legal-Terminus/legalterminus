import React from "react";
import "./PtoopcBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtoopcBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Proprietorship to OPC Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Proprietorship to OPC
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">One founder, full corporate shield</span>
          </h1>

          <p className="lt-public-description">
            A Proprietorship is easy to start, but as your business grows, it comes with limitations such as unlimited personal liability, no separate legal identity, and lower business credibility. Proprietorship firm to OPC conversion helps you upgrade your business into a legally recognized corporate structure while keeping complete ownership in the hands of a single founder. A One Person Company (OPC) under the Companies Act, 2013 offers limited liability protection, separate legal identity, better brand credibility, and improved business continuity.
          </p>

          <p className="lt-public-description">
            At Legal Terminus, we handle the complete Proprietorship firm to OPC conversion process — including OPC incorporation through the MCA portal, PAN &amp; TAN application, GST migration support, and assistance with updating bank accounts and business registrations. Supreme Plans also include 12 months of compliance support.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">URC-1 + URC-2 Filed</div>
            <div className="lt-feature-item">Section 366 Compliant</div>
            <div className="lt-feature-item">Limited Liability</div>
            <div className="lt-feature-item">100% Founder-Held</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>OPC + URC-1 conversions</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>GST + Bank + Licenses + IP</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="ptoopc-consult-form">
          <ConsultationForm
            source="proprietorship-to-opc"
            subtitle="Talk to our OPC conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtoopcBreadcrum;
