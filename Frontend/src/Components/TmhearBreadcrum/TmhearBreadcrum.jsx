import React from "react";
import "./TmhearBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmhearBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Trademark Hearing
          </span>

          <h1 className="lt-public-title">
            Trademark Hearing
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Professional Representation When It Matters Most</span>
          </h1>

          <p className="lt-public-description">
            Trademark Hearings are conducted before the Trade Marks Registry when clarification, legal arguments, or final submissions are required in matters such as Show Cause Hearings, Opposition Hearings, Rectification matters, or Renewal/Restoration cases. Most hearings in India are now conducted online through video conference before the Registrar or Hearing Officer.
            <br /><br />
            Missing a hearing or failing to present proper arguments can negatively affect your trademark application or registration. Legal Terminus helps clients with hearing preparation, legal submissions, online representation, evidence coordination, adjournment handling, and post-hearing follow-up.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Online Hearings</div>
            <div className="lt-feature-item">Brief Drafting</div>
            <div className="lt-feature-item">Monthly Updates</div>
            <div className="lt-feature-item">All Hearing Types</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,500+</h3>
              <p>Trademark hearings attended</p>
            </div>
            <div>
              <h3>12 Years</h3>
              <p>of IP advocacy expertise</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmhear-consult-form">
          <ConsultationForm
            source="trademark-hearing"
            subtitle="Talk to our trademark hearing expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmhearBreadcrum;
