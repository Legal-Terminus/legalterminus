import React from "react";
import "./LabourLicenseBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const LabourLicenseBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Labour Licence Registration
          </span>

          <h1 className="lt-public-title">
            Labour Licence Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Engaging contract labour? Get licensed first</span>
          </h1>

          <p className="lt-public-description">
            Labour License Registration in India is mandatory for contractors employing 50 or more contract workers under the OSH Code, 2020. The new labour law framework has simplified compliance by increasing the worker threshold, introducing a unified licensing system, and allowing longer license validity periods.
          </p>

          <p className="lt-public-description">
            We assist contractors, construction companies, manpower suppliers, factories, and service providers with complete Labour License Registration through the Shram Suvidha Portal and Labour Department. Our services include document preparation, application filing, department coordination, and compliance support for smooth approval.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Shram Suvidha Filed</div>
            <div className="lt-feature-item">5-Year Validity</div>
            <div className="lt-feature-item">Single License</div>
            <div className="lt-feature-item">PE + Contractor Bundled</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>950+</h3>
              <p>Labour licenses filed</p>
            </div>
            <div>
              <h3>All Major States</h3>
              <p>+ Central Sphere</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="ll-consult-form">
          <ConsultationForm
            source="labour-license-clra"
            subtitle="Talk to our Labour Licence registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default LabourLicenseBreadcrum;
