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
            EPF Return Filing &amp; Monthly Compliance
          </span>

          <h1 className="lt-public-title">
            EPF Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">EPFO-Compliant, Monthly &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your establishment's monthly EPF compliance with the Employees' Provident Fund Organisation (EPFO) — ECR (Electronic Challan-cum-Return) preparation, UAN generation, contribution computation, and challan payment before every due date. We handle employee and employer PF, EPS, and EDLI calculations so your workforce's provident fund stays fully compliant. Our professional fee starts at ₹999 + GST per month. Statutory contributions are paid directly to EPFO at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Monthly ECR Preparation &amp; Filing</div>
            <div className="lt-feature-item">UAN Generation &amp; KYC Seeding</div>
            <div className="lt-feature-item">PF, EPS &amp; EDLI Computation</div>
            <div className="lt-feature-item">Challan Payment by the 15th Due Date</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Returns filed monthly</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>EPFO portal filing</p>
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
