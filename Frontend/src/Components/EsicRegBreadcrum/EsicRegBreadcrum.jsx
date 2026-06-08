import React from "react";
import "../EPFRegBreadcrum/EPFRegBreadcrum.css";
import ConsultationForm from "../ConsultationForm/ConsultationForm";

const EsicRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            ESIC Registration Online
          </span>

          <h1 className="lt-public-title">
            ESIC Registration Online
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">ESI Reg — That Keeps Your Workforce Protected</span>
          </h1>

          <p className="lt-public-description">
            ESIC Registration is mandatory for establishments employing 10 or more employees (in most states) under the Employees' State Insurance Act, 1948. Once registered, every eligible employee gets access to comprehensive medical care, sickness benefits, maternity benefits, disability cover, and EDLI-style insurance — all funded through a combined employer (3.25%) + employee (0.75%) contribution on basic wages. Legal Terminus handles the entire ESIC registration process — from portal sign-up and Form-1 filing to 17-digit Employer Code allotment, employee IP number generation, and first contribution walkthrough.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for 10+ Employees</div>
            <div className="lt-feature-item">17-Digit Employer Code</div>
            <div className="lt-feature-item">Medical & Sickness Benefits</div>
            <div className="lt-feature-item">Monthly ESI Compliance Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>300+</h3>
              <p>ESIC establishments registered</p>
            </div>
            <div>
              <h3>Pan-India</h3>
              <p>ESIC regional offices covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="esic-consult-form">
          <ConsultationForm
            source="esic-registration"
            subtitle="Talk to our ESIC Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default EsicRegBreadcrum;
