import React from "react";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const OLWFBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            OLWF Registration
          </span>

          <h1 className="lt-public-title">
            Odisha Labour Welfare Fund Registration
            <br />
            <span className="lt-title-tagline">Contribution Towards Employee Welfare</span>
          </h1>

          <p className="lt-public-description">
            Odisha Labour Welfare Fund (OLWF) Registration is mandatory for eligible establishments operating in Odisha under the Odisha Labour Welfare Fund Act, 1996. Businesses operating in Odisha and employing the prescribed number of employees are required to register with the Odisha Labour Welfare Board and make periodic contributions towards employee welfare initiatives.
            <br /><br />
            We provide complete assistance for OLWF Registration in Odisha, including document preparation, application filing, Establishment Code registration, and compliance guidance for contribution filing and employee coverage. Our team ensures a smooth and hassle-free registration process with proper support for first-time employers and growing businesses.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">7-Day Filing</div>
            <div className="lt-feature-item">Odisha-Specific</div>
            <div className="lt-feature-item">Labour Compliance</div>
            <div className="lt-feature-item">Employee Welfare</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>220+</h3>
              <p>OLWF establishments registered</p>
            </div>
            <div>
              <h3>All 30 Districts</h3>
              <p>of Odisha covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="opc-consult-form">
          <ConsultationForm
            source="olwf-registration"
            subtitle="Talk to our OLWF registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default OLWFBreadcrum;
