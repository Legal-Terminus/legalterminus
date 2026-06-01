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
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Your Proprietorship business. Live in 3 days.</span>
          </h1>

          <p className="lt-public-description">
            The fastest, cheapest way to start a real business in India. No partners, no MCA, no MOA — just a few registrations stitched together (MSME, Shop &amp; Establishment, GST if needed) and you're invoicing. Our professional fee starts at ₹999 + GST. Government and licence fees are billed separately at actuals — itemised, transparent, no markup.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Single Owner Control</div>
            <div className="lt-feature-item">Easy &amp; Low-Cost Setup</div>
            <div className="lt-feature-item">Minimal Compliance</div>
            <div className="lt-feature-item">Quick Registration Process</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>800+</h3>
              <p>Proprietorships set up</p>
            </div>
            <div>
              <h3>All States</h3>
              <p>MSME, GST &amp; Shop &amp; Est</p>
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
