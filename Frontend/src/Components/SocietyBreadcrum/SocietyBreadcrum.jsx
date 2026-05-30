import React from "react";
import "./SocietyBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Society  Registration
          </span>

          <h1 className="lt-public-title">
            Society Registration
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with society registration in India, offering hassle-free services within a reasonable timeframe and for competitive professional fees starting from Rs. 14,999/-. We assist with society registration promptly and efficiently to meet your requirements.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Minimum 7 Members Required</div>
            <div className="lt-feature-item"> 7 to 10 Working Days</div>
            <div className="lt-feature-item"> 5 Simple Steps</div>
            <div className="lt-feature-item"> High Business Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Processess</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="society-registration"
          subtitle="Talk to our Society Registration expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
