import React from "react";
import "./LabourLicenseBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const LabourLicenseBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Labour Licence (CLRA) Registration
          </span>

          <h1 className="lt-public-title">
            Labour Licence Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">CLRA-Compliant, Fast &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your end-to-end Labour Licence under the Contract Labour (Regulation &amp; Abolition) Act, 1970 — Principal Employer Registration (Certificate of Registration) and Contractor Labour Licence. We handle Form I / IV / V drafting, department filing, security deposit and government fee coordination so your contract-labour engagement is legally compliant from day one. Our professional fee starts at ₹4,999 + GST. Government fees and security deposits are billed separately at actuals per the applicable state tariff.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for 20+ Contract Workmen</div>
            <div className="lt-feature-item">Principal Employer RC &amp; Contractor Licence</div>
            <div className="lt-feature-item">Form I / IV / V Filing &amp; Govt Fee Coordination</div>
            <div className="lt-feature-item">Renewal, Amendment &amp; Compliance Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Labour licences obtained</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="ll-consult-form">
          <ConsultationForm
            source="labour-license-clra"
            subtitle="Talk to our Labour Licence registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default LabourLicenseBreadcrum;
