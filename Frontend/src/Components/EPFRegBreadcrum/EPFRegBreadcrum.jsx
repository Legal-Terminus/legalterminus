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
            <span className="lt-public-subtitle">Fast, Secure &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Employee Provident Fund (EPF) Registration is mandatory for all establishments with 20 or more employees under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952. Governed by the EPFO, every eligible employer must register within one month of crossing the 20-employee threshold to avoid heavy penalties. The entire registration process is 100% online through the Unified Shram Suvidha Portal (USSP). Upon registration, every employee is issued a Universal Account Number (UAN) that stays with them throughout their career.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for 20+ Employees</div>
            <div className="lt-feature-item">Lifetime Valid Certificate</div>
            <div className="lt-feature-item">UAN for Every Employee</div>
            <div className="lt-feature-item">EPFO Compliance Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>EPF registrations completed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>EPFO USSP Portal Filing</p>
            </div>
            <div>
              <h3>10–15 Days</h3>
              <p>Average registration time</p>
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
