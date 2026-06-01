import React from "react";
import "./GSTRegBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const GSTRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">GST Registration</span>

          <h1 className="lt-public-title">
            GST Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Quick, Easy &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Start your business the right way with hassle-free GST registration. Legal Terminus takes care of the entire process — from application filing to GSTIN approval — so you can focus on growing your business. Professional fees starting at ₹1499* (*Prices exclusive of 18% GST and applicable statutory charges.)
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for Eligible Businesses</div>
            <div className="lt-feature-item">PAN-Based Registration</div>
            <div className="lt-feature-item">Input Tax Credit Benefits</div>
            <div className="lt-feature-item">Nationwide Business Compliance</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,200+</h3>
              <p>GST registrations filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>Aadhaar e-KYC + DSC</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="gst-consult-form">
          <ConsultationForm
            source="gst-registration"
            subtitle="Talk to our GST Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default GSTRegBreadcrum;
