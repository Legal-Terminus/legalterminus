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
            ESIC Registration
          </span>

          <h1 className="lt-public-title">
            ESIC Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">ESI Reg — That Keeps Your Workforce Protected</span>
          </h1>

          <p className="lt-public-description">
            ESIC Registration is mandatory for establishments employing 10 or more employees under the Employees' State Insurance Act, 1948. Employees earning up to ₹21,000 per month (₹25,000 for persons with disabilities) are covered and receive medical, sickness, maternity, disability, and dependent benefits. Contributions are shared between the employer (3.25%) and employee (0.75%).
            <br /><br />
            For companies incorporated through SPICe+, ESIC registration is issued automatically during incorporation. We provide end-to-end support for employer registration, employee IP registration, contribution filing, return filing, and ongoing ESIC compliance.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Medical Benefits for Employees</div>
            <div className="lt-feature-item">Family also Coverage Under ESIC</div>
            <div className="lt-feature-item">Fully Online</div>
            <div className="lt-feature-item">Contribution Walkthrough</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,100+</h3>
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
