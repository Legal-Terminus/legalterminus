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
            <span className="lt-public-subtitle">Expand Globally with IEC Registration</span>
          </h1>

          <p className="lt-public-description">
            Planning to import or export from India? An IEC (Import Export Code) is a mandatory registration issued by DGFT for businesses involved in international trade of goods, services, or technology. The IEC is issued based on the PAN of the business, and the IEC number is generally the same as the PAN of the organization. We help you obtain your IEC quickly and hassle-free through the DGFT portal. Our team handles the complete filing process, documentation support, and annual IEC update compliance to keep your IEC active and valid.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">2-Day IEC</div>
            <div className="lt-feature-item">PAN-Based Code</div>
            <div className="lt-feature-item">1-Yr Free Updates</div>
            <div className="lt-feature-item">Lifetime Validity</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>400+</h3>
              <p>IEC registrations filed</p>
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
