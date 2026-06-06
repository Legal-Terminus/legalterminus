import React from 'react';
import './UdyamRegBreadcrum.css';
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const UdyamRegBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Udyam / MSME Registration
          </span>

          <h1 className="lt-public-title">
            Udyam / MSME Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Save 50% Today on Professional Services</span>
          </h1>

          <p className="lt-public-description">
            UDYAM Registration is the official MSME registration issued by the Government of India, helping businesses access government benefits, enhance credibility, and improve opportunities with banks, customers, and government departments. An UDYAM Certificate offers benefits such as easier loan approvals, government tender preferences, MSME payment protection, subsidies, and a 50% concession on Trademark Registration government fees.
            <br /><br />
            The Government does not charge any fee for UDYAM Registration. Our professional assistance starts at ₹999 + GST for a hassle-free registration process.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Same-Day Filing</div>
            <div className="lt-feature-item">Right NIC Mapped</div>
            <div className="lt-feature-item">100% Online Process</div>
            <div className="lt-feature-item">Lifetime Validity</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>10,000+</h3>
              <p>Udyam registrations filed</p>
            </div>
            <div>
              <h3>All 28 States</h3>
              <p>+ 8 Union Territories</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="udyam-consult-form">
          <ConsultationForm
            source="udyam-registration"
            subtitle="Talk to our Udyam registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default UdyamRegBreadcrum;
