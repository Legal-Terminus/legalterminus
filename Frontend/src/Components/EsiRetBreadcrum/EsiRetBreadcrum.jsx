import React from "react";
import "./EsiRetBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const EsiRetBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            ESI Return Filing &amp; Monthly Compliance
          </span>

          <h1 className="lt-public-title">
            ESI Return Filing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">ESIC-Compliant, Monthly &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus manages your establishment's monthly ESI compliance with the Employees' State Insurance Corporation (ESIC) under the ESI Act, 1948 — monthly contribution filing, IP (Insured Person) registration, contribution computation, and challan payment before every due date. We handle employee (0.75%) and employer (3.25%) contributions so your workforce's health-insurance cover stays fully active. Our professional fee starts at ₹999 + GST per month. Statutory contributions are paid directly to ESIC at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Monthly Contribution Return &amp; Challan</div>
            <div className="lt-feature-item">IP Registration &amp; e-Pehchaan Cards</div>
            <div className="lt-feature-item">Employee 0.75% &amp; Employer 3.25%</div>
            <div className="lt-feature-item">Challan Payment by the 15th Due Date</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,000+</h3>
              <p>Returns filed monthly</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>ESIC portal filing</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="esiret-consult-form">
          <ConsultationForm
            source="esi-return"
            subtitle="Talk to our ESI compliance expert"
          />
        </div>

      </div>
    </section>
  );
};

export default EsiRetBreadcrum;
