import React, { useState } from "react";
import "./PublicBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const PublicBreadcrum = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="pub-ltd-hero">
      <div className="pub-ltd-container">

        {/* LEFT CONTENT */}
        <div className="pub-ltd-content">

          <span className="pub-ltd-tag">
            Public Limited Company Registration
          </span>

          <h1 className="pub-ltd-title">
            Public Limited Company Registration
            <span className="pub-ltd-title-india"> in India</span>
            <br />
            <span className="pub-ltd-tagline">Fast, Compliant &amp; Built to Scale</span>
          </h1>

          <p className="pub-ltd-description">
            Legal Terminus can help you with Public Limited Company Registration in India, as and when required, in a hassle-free manner within a reasonable time span. We provide expert assistance to meet your business setup needs in India.
          </p>

          <div className="pub-ltd-features">
            <div className="pub-ltd-feature-item"> Minimum 7 Shareholders Required</div>
            <div className="pub-ltd-feature-item"> Minimum 3 Directors Required</div>
            <div className="pub-ltd-feature-item"> 15 to 20 Working Days</div>
            <div className="pub-ltd-feature-item"> High Business Credibility</div>
          </div>

          <div className="pub-ltd-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="public-limited-company"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default PublicBreadcrum;
