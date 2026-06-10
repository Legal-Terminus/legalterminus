import React from "react";
import "./TradeLicensebreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const TradeLicenseBreadcrum = () => {
  return (
    <section className="lt-trade-hero">
      <div className="lt-trade-container">

        {/* LEFT CONTENT */}
        <div className="lt-trade-content">

          <span className="lt-trade-tag">
            Trade License Registration
          </span>

          <h1 className="lt-trade-title">
            Trade License Registration In India
            <br></br>
            <span className="lt-trade-tagline">Get approved. Start operating legally</span>
          </h1>

          <p className="lt-trade-description">
            Trade License Registration in India is the permission issued by the local Municipal Corporation or Urban Local Body allowing a business to operate from a specific commercial premises. It is generally required for shops, restaurants, offices, factories, warehouses, clinics, salons, hotels, and other commercial establishments under the respective State Municipal laws.
          </p>

          <p className="lt-trade-description">
            We help you with complete Trade License Registration in India — from application drafting and document preparation to municipal portal filing, inspection coordination, and license approval support. Our team handles registrations across major municipal authorities such as MCD, BMC, BBMP, GHMC, KMC, and others.
          </p>

          <div className="lt-trade-features">
            <div className="lt-feature-item">City-Specific Filing</div>
            <div className="lt-feature-item">Municipal Approval</div>
            <div className="lt-feature-item">Renewal Calendar</div>
            <div className="lt-feature-item">Multi-Establishment</div>
          </div>

          <div className="lt-trade-highlights">
            <div>
              <h3>2,100+</h3>
              <p>Trade licenses filed</p>
            </div>
            <div>
              <h3>All Major Cities</h3>
              <p>MCD + BMC + BBMP + GCC + GHMC + KMC</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="trade-consult-form">
          <ConsultationForm
            source="trade-license"
            subtitle="Talk to our Trade License registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TradeLicenseBreadcrum;
