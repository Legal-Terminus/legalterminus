import React from "react";
import "./CocomBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const CocomBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Change of Object Clause (MOA)
          </span>

          <h1 className="lt-public-title">
            Change a Company's Object Clause
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Add or Pivot Activities, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Expanding into a new business line? Legal Terminus alters your company's object clause in the Memorandum of Association under Section 13 of the Companies Act, 2013 — drafting the new objects, passing a special resolution at an EGM, and filing Form MGT-14 with the ROC to obtain an updated MOA. This lets your company legally carry on the new activities you've planned. Our professional fee starts at ₹4,999 + GST. Government fees are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Add, Modify or Replace Object Clauses</div>
            <div className="lt-feature-item">Special Resolution &amp; MGT-14 Filing</div>
            <div className="lt-feature-item">Updated MOA on the MCA Record</div>
            <div className="lt-feature-item">Licence &amp; GST Alignment Support</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Updations filed</p>
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

        <div id="cocom-consult-form">
          <ConsultationForm
            source="change-object-company"
            subtitle="Talk to our object clause change expert"
          />
        </div>

      </div>
    </section>
  );
};

export default CocomBreadcrum;
