import React from "react";
import "./PvtllpBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PvtllpBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Private Limited to LLP Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Private Limited Company to LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Cut Compliance, Skip Mandatory Audit &amp; Save Tax</span>
          </h1>

          <p className="lt-public-description">
            Running a Private Limited Company but no longer need to raise equity? Convert it into a Limited Liability Partnership and dramatically reduce your compliance load — no mandatory annual audit below the threshold, only Form 8 and Form 11 to file, no board-meeting formalities, and no dividend distribution tax. Legal Terminus converts your company into an LLP under Section 56 and the Third Schedule of the LLP Act, 2008 — filing Form 18 with FiLLiP, then Form 14 with the ROC and the LLP agreement in Form 3. All shareholders become partners and the business continues seamlessly with limited liability intact. Our professional fee starts at ₹11,999 + GST. Government fees, stamp duty &amp; charge-clearance costs are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Section 56 / Third Schedule Conversion</div>
            <div className="lt-feature-item">No Mandatory Audit Below Threshold</div>
            <div className="lt-feature-item">Form 18 + FiLLiP &amp; Form 14 Filing</div>
            <div className="lt-feature-item">All Shareholders Become Partners</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>3,000+</h3>
              <p>Conversions handled</p>
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

        <div id="pvtllp-consult-form">
          <ConsultationForm
            source="private-to-llp"
            subtitle="Talk to our Pvt-Ltd-to-LLP conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PvtllpBreadcrum;
