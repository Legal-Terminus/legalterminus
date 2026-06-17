import React from "react";
import "./PubpvtBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PubpvtBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Public Limited to Private Limited Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Public Limited Company to Private Limited
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Lower Compliance, Tighter Control</span>
          </h1>

          <p className="lt-public-description">
            No longer raising from the public and want a leaner, closely held structure? Convert your Public Limited Company into a Private Limited Company to cut the heavier public-company compliance, cap membership, and restrict share transfers. Legal Terminus manages the entire conversion under Section 14 &amp; 18 of the Companies Act, 2013 — special resolution, MOA &amp; AOA alteration, MGT-14, the Regional Director application (Form RD-1), newspaper advertisement, and INC-28 — end to end on MCA21 V3. Our professional fee starts at ₹14,999 + GST. Government fees, advertisement &amp; stamp duty are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Section 14 Special Resolution</div>
            <div className="lt-feature-item">Regional Director Approval</div>
            <div className="lt-feature-item">MGT-14 + RD-1 + INC-28</div>
            <div className="lt-feature-item">Min 2 Directors &amp; 2 Members</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Conversions handled</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>RD-1 + INC-28 + Records Update</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="pubpvt-consult-form">
          <ConsultationForm
            source="public-to-private"
            subtitle="Talk to our Public-to-Pvt-Ltd conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PubpvtBreadcrum;
