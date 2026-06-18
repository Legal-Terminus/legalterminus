import React from "react";
import "./EpfRetBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const EpfRetBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            EPF Return Filing
          </span>

          <h1 className="lt-public-title">
            EPF Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Filed on Time, Every Month</span>
          </h1>

          <p className="lt-public-description">
            Every employer covered under the Employees&rsquo; Provident Funds and Miscellaneous Provisions Act, 1952 is required to complete monthly EPF Return Filing through the EPFO Unified Portal. The monthly ECR (Electronic Challan-cum-Return) must generally be filed on or before the 15th of the following month.
          </p>

          <p className="lt-public-description">
            At Legal Terminus, we manage the complete EPF monthly compliance cycle — from employee onboarding and UAN/KYC updates to ECR preparation, challan generation, portal filing, and acknowledgement support. Our team helps ensure accurate filings, timely submissions, and smooth coordination with your payroll process.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">ECR Filed by 15th</div>
            <div className="lt-feature-item">KYC Seeded</div>
            <div className="lt-feature-item">Form 5A Annual</div>
            <div className="lt-feature-item">Payment Coordinated</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Monthly ECRs filed</p>
            </div>
            <div>
              <h3>All Establishment Sizes</h3>
              <p>Up to 50 employees standard; 50+ custom</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="epfret-consult-form">
          <ConsultationForm
            source="epf-return"
            subtitle="Talk to our EPF compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default EpfRetBreadcrum;
