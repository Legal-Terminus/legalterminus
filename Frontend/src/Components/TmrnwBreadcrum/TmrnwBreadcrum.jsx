import React from "react";
import "./TmrnwBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmrnwBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Renewal
          </span>

          <h1 className="lt-public-title">
            Trademark Renewal
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Protect Your Brand Continuously</span>
          </h1>

          <p className="lt-public-description">
            A registered trademark in India is valid for 10 years and can be renewed indefinitely under the Trade Marks Act, 1999. Missing the renewal deadline may lead to additional late fees, restoration procedures, or even removal of the trademark from the register — which can result in loss of brand protection and years of brand value.
            <br /><br />
            At Legal Terminus, we handle the complete Trademark Renewal process professionally and on priority — from status verification and TM-R filing to acknowledgement delivery and renewal tracking. Whether you need a simple renewal, change of trademark agent, or ongoing trademark watch support, we have plans tailored to your needs.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">TM-R Filed</div>
            <div className="lt-feature-item">Lifelong Reminders</div>
            <div className="lt-feature-item">Attorney Can Change</div>
            <div className="lt-feature-item">TM Watch Services for 1 Year</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,800+</h3>
              <p>Trademark renewals filed</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Lifelong reminder coverage</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmrnw-consult-form">
          <ConsultationForm
            source="trademark-renewal"
            subtitle="Talk to our trademark renewal expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmrnwBreadcrum;
