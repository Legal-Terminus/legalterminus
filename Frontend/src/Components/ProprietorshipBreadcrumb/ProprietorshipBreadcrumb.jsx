import React from "react";
import "./ProprietorshipBreadcrumb.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Proprietorship Firm Registration
          </span>

          <h1 className="lt-public-title">
            Proprietorship Firm Registration
            <br>
            </br>
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you in Sole proprietorship firms registration in India, as and when required. We provide hassle-free services within a reasonable timeframe and competitive professional fees starting from Rs.999/-. Whether you need help with the proprietorship company registration process, we’ve got you covered.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Only 1 Directors Required</div>
            <div className="lt-feature-item"> Very Easy to Form</div>
            <div className="lt-feature-item"> Hassle Free</div>
            <div className="lt-feature-item"> High Business Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="proprietorship"
          subtitle="Talk to our Proprietorship Firms Registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
