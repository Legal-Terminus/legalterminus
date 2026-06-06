import React from "react";
import "./EPFRegBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const EPFRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            EPF Registration Online
          </span>

          <h1 className="lt-public-title">
            EPF Registration Online
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">EPF Reg - That Keeps Your Business Compliant</span>
          </h1>

          <p className="lt-public-description">
            EPF registration is a mandatory compliance for eligible establishments under the Employees' Provident Fund and Miscellaneous Provisions Act, 1952. Generally, it is mandatory the moment your employee strength touches 20 - and voluntary below that under Section 1(4) if you want to offer it as a benefit. The EPF scheme helps employees create long-term retirement savings through monthly contributions made by both the employer and employee. At the same time, it helps businesses stay legally compliant and employee-friendly. Legal Terminus simplifies the entire EPF registration process — from Form 5A filing and EPFO portal registration to Establishment Code generation, UAN activation, and ECR support. Free EPF-update support for 1 year - included in every plan.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Builds Employee Trust</div>
            <div className="lt-feature-item">Legally Compliant Workplace</div>
            <div className="lt-feature-item">Retirement Savings for Employees</div>
            <div className="lt-feature-item">Social Security &amp; Pension Benefits</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>400+</h3>
              <p>EPF establishments registered</p>
            </div>
            <div>
              <h3>Pan-India</h3>
              <p>EPFO regional offices covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="epf-consult-form">
          <ConsultationForm
            source="epf-registration"
            subtitle="Talk to our EPF Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default EPFRegBreadcrum;
