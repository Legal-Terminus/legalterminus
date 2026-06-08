import React from "react";
import "./IECBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const IECBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Importer Exporter Code (IEC) Registration
          </span>

          <h1 className="lt-public-title">
            Importer Exporter Code (IEC) Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">Fast, Simple &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            An Importer Exporter Code (IEC) is a 10-digit business identification number mandatory for any entity engaged in the import or export of goods and services from India. Issued by the Directorate General of Foreign Trade (DGFT) under the Ministry of Commerce, an IEC is a one-time registration with lifetime validity — no renewal required. The entire application process is 100% online through the DGFT portal. Government fee: ₹500 only.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Mandatory for Import/Export</div>
            <div className="lt-feature-item">Lifetime Validity</div>
            <div className="lt-feature-item">Online Application Process</div>
            <div className="lt-feature-item">Easy Renewal and Updates</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>IEC registrations completed</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>DGFT Portal Process</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="iec-consult-form">
          <ConsultationForm
            source="iec-registration"
            subtitle="Talk to our IEC Registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default IECBreadcrum;
