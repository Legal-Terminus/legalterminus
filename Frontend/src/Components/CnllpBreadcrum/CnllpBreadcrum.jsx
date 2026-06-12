import React from "react";
import "./CnllpBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const CnllpBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Change of LLP Name
          </span>

          <h1 className="lt-public-title">
            Change the Name of an LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Rebrand Cleanly, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Rebranding your LLP or resolving a name conflict? Legal Terminus handles your LLP name change end-to-end under the LLP Act, 2008 — reserving the new name through RUN-LLP, filing Form 5 (notice of name change) and Form 3 (supplementary LLP agreement) with the ROC, and obtaining a fresh Certificate of Incorporation. We then help update your PAN, GST, bank, and licences so the new name flows everywhere. Our professional fee starts at ₹3,999 + GST. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Name Reservation via RUN-LLP</div>
            <div className="lt-feature-item">Form 5 &amp; Form 3 Filing with the ROC</div>
            <div className="lt-feature-item">Fresh Certificate of Incorporation</div>
            <div className="lt-feature-item">PAN, GST &amp; Bank Update Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Updations filed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>End-to-end MCA filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="cnllp-consult-form">
          <ConsultationForm
            source="change-name-llp"
            subtitle="Talk to our LLP name change expert"
          />
        </div>

      </div>
    </section>
  );
};

export default CnllpBreadcrum;
