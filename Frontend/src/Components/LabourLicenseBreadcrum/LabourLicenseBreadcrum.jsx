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
            Labour License Registration in India is mandatory for contractors employing 50 or more contract workers under the Occupational Safety, Health and Working Conditions (OSH) Code, 2020. The Principal Employer is also required to obtain registration for the establishment before engaging contract labour. The new labour law regime has simplified compliance by increasing the threshold from 20 workers to 50 workers, introducing a unified licensing system, and extending license validity up to 5 years in many cases. A single Labour License can now cover multiple establishments, making compliance easier for growing businesses and contractors.
          </p>

          <p className="lt-public-description">
            We help contractors, construction companies, manpower suppliers, factories, infrastructure businesses, and service providers complete Labour License Registration in India through the Shram Suvidha Portal and the respective Labour Department. Our support includes application drafting, document preparation, portal filing, department coordination, and compliance guidance.
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
