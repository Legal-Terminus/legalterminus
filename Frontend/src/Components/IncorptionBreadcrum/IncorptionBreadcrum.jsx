import React from "react";
import "./IncorptionBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const IncorptionBreadcrum = () => {
  return (
    <section className="lt-public-hero wos-hero">
      <div className="lt-public-container">
        {/* LEFT CONTENT */}
        <div className="lt-public-content">
          <span className="lt-public-tag">
            Incorporation Of Wholly Owned Subsidiary
          </span>

          <h1 className="lt-public-title">
            Incorporation Of Wholly Owned Subsidiary
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Build Your Global Presence</span>
          </h1>

          <p className="lt-public-description">
            A Wholly Owned Subsidiary (WOS) is a company in which 100% of the shares are held by a single parent company, whether Indian or foreign. It is one of the most preferred business structures for companies looking to expand operations, create separate business verticals, or establish a presence in India with complete ownership and control.
            <br /><br />
            We provide complete assistance for Wholly Owned Subsidiary registration in India, including company incorporation, document preparation, regulatory filings, and compliance support. For foreign parent companies, we also assist with FEMA-related compliance and incorporation requirements applicable under Indian law. Government fees, stamp duty, DSC charges, apostille/notarization expenses, and applicable FEMA or banking charges are billed separately on actuals with complete transparency.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Fully Online Registration Process</div>
            <div className="lt-feature-item">100% Parent Company Ownership</div>
            <div className="lt-feature-item">Indian &amp; Foreign Parent Support</div>
            <div className="lt-feature-item">Complete FEMA &amp; ROC Assistance</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>100+</h3>
              <p>WOS structures incorporated</p>
            </div>
            <div>
              <h3>Indian + Foreign</h3>
              <p>parent jurisdictions covered</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="incorporation"
          subtitle="Talk to our expert"
        />
      </div>
    </section>
  );
};

export default IncorptionBreadcrum;
