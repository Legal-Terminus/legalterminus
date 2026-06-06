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
            UDYAM Registration is the Government of India's official registration for Micro, Small, and Medium Enterprises (MSMEs). It helps businesses avail various government benefits, improve credibility, and strengthen their position while dealing with customers, vendors, banks, and government departments.
            <br /><br />
            An UDYAM Certificate enables businesses to avail MSME-specific benefits such as easier access to bank loans and credit facilities, priority sector lending, government tender preferences, protection against delayed payments under MSME provisions, and various subsidies and support schemes offered by Central and State Governments. MSMEs can also avail a 50% concession in the official government fee for Trademark Registration applications.
            <br /><br />
            The Government does not charge any fee for UDYAM Registration. Our professional assistance starts from ₹999 + GST, ensuring a smooth and error-free registration process.
            <br /><br />
            Need multiple registrations? You can combine UDYAM Registration with GST Registration, Trademark Registration, Startup Registration, or other business compliance services through a single point of coordination.
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
