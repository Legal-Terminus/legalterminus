import React from "react";
import "./LtopvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const LtopvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            LLP to Private Limited Conversion
          </span>

          <h1 className="lt-public-title">
            Convert LLP to Pvt Ltd Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">LLP to Pvt Ltd. Growth Simplified.</span>
          </h1>

          <p className="lt-public-description">
            An LLP is a flexible and cost-effective business structure, but as your business grows, raising investment, issuing ESOPs, or attracting institutional investors can become challenging. Most investors and venture capital firms prefer a Private Limited Company structure for funding and long-term scalability.
            <br /><br />
            LLP to Pvt Ltd Company Conversion is carried out under Sections 366–374 of the Companies Act, 2013 through the URC-1 process. We handle the complete conversion, including compliance verification, URC-1 and URC-2 filings, partner approvals, creditor NOCs, SPICe+ incorporation, MOA &amp; AOA drafting, conversion of capital contribution into shareholding, and support for GST, bank account, and license transitions.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">URC-1 + URC-2 Filed</div>
            <div className="lt-feature-item">Section 366 Compliant</div>
            <div className="lt-feature-item">Capital Contribution Mapped</div>
            <div className="lt-feature-item">Investor-Grade</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>LLP conversions + Pvt Ltd incorporations</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>URC-1 + GST + Bank + LLP Wind-Up</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="ltopvt-consult-form">
          <ConsultationForm
            source="llp-to-private"
            subtitle="Talk to our LLP-to-Pvt-Ltd conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default LtopvtBreadcrum;
