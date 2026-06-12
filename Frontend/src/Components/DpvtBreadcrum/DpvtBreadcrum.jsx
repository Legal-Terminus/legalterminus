import React from "react";
import "./DpvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const DpvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Private Limited Company Closure
          </span>

          <h1 className="lt-public-title">
            Dissolve a Private Limited Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Strike Off the Easy Way, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Not running your company any more? Legal Terminus closes inactive private limited companies through voluntary strike-off under Section 248(2) of the Companies Act, 2013 — filing Form STK-2 with the ROC along with the indemnity bond, affidavit, and CA-certified statement of accounts. Striking off ends your annual filing burden and stops penalties from piling up. Our professional fee starts at ₹9,999 + GST. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Voluntary Strike-Off via Form STK-2</div>
            <div className="lt-feature-item">Stops ROC Penalties &amp; Compliance Load</div>
            <div className="lt-feature-item">Indemnity Bond, Affidavit &amp; Accounts Drafted</div>
            <div className="lt-feature-item">End-to-End ROC Coordination</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,000+</h3>
              <p>Companies closed</p>
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

        <div id="dpvt-consult-form">
          <ConsultationForm
            source="dissolve-private"
            subtitle="Talk to our company closure expert"
          />
        </div>

      </div>
    </section>
  );
};

export default DpvtBreadcrum;
