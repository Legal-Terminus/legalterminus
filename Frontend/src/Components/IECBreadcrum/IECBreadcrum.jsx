import React from "react";
import "./IECBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const IECBreadcrum = () => {
  return (
    <section className="lt-iec-hero">
      <div className="lt-iec-container">

        {/* LEFT CONTENT */}
        <div className="lt-iec-content">

          <span className="lt-iec-tag">
            Importer Exporter Code (IEC) Registration
          </span>

          <h1 className="lt-iec-title">
            Importer Exporter Code (IEC) Registration
            <span> in India</span>
          </h1>

          <p className="lt-iec-description">
            Legal Terminus can help you with the Importer Exporter Code Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for competitive professional fee which starts from Rs. 1,999/-
          </p>

          <div className="lt-iec-features">
            <div className="lt-feature-item"> Mandatory for Import/Export</div>
            <div className="lt-feature-item"> Lifetime Validity</div>
            <div className="lt-feature-item"> Online Application Process</div>
            <div className="lt-feature-item"> Easy Renewal and Updates</div>
          </div>

          <div className="lt-iec-highlights">
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
          source="iec-registration"
          subtitle="Talk to our Importer Exporter Code registration expert"
        />

      </div>
    </section>
  );
};

export default IECBreadcrum;
