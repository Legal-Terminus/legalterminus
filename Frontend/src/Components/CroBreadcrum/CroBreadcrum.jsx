import React from "react";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const CroBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Company Registration Consultancy in Odisha
          </span>

          <h1 className="lt-public-title">
            Company Registration Consultancy
            <span className="lt-title-india"> in Odisha</span>
            <br />
            <span className="lt-title-tagline">Start Your Business the Right Way</span>
          </h1>

          <p className="lt-public-description">
            Setting up a company in Bhubaneswar or anywhere across Odisha? Legal Terminus gives you
            expert, end-to-end assistance with proper documentation and complete compliance support —
            from name approval, DSC and DIN to MOA &amp; AOA, PAN, TAN and the Certificate of
            Incorporation, all filed on MCA21 V3. Whether it's a Private Limited, One Person Company,
            LLP or Public Limited, we register the right structure for your business. Consultancy
            services start from <strong>₹3,999</strong> (excluding government fees) with transparent,
            no-hidden-charge pricing and a free consultation to understand your requirements.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">100% Online + Bhubaneswar Office</div>
            <div className="lt-feature-item">Free Expert Consultation</div>
            <div className="lt-feature-item">Transparent, No Hidden Charges</div>
            <div className="lt-feature-item">Incorporation in 10–15 Days</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>4.9/5</h3>
              <p>Google Happy Reviews</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="cro-consult-form">
          <ConsultationForm
            source="company-registration-odisha"
            subtitle="Talk to our company registration expert in Odisha"
          />
        </div>

      </div>
    </section>
  );
};

export default CroBreadcrum;
