import React from "react";
import "./PtpubBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtpubBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Private Limited to Public Limited Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Private Limited Company to Public Limited
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Unlock Public Capital &amp; Listing Optionality</span>
          </h1>

          <p className="lt-public-description">
            Outgrown the 200-member cap and ready to raise from the public? Convert your Private Limited Company into a Public Limited Company and open the door to IPOs, public issues, and free share transferability. Legal Terminus manages the entire conversion under Section 14 &amp; 18 of the Companies Act, 2013 — special resolution, MOA &amp; AOA alteration, MGT-14 and INC-27 filing — end to end on MCA21 V3. Our professional fee starts at ₹19,999 + GST. Government fees &amp; stamp duty are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Minimum 3 Directors Required</div>
            <div className="lt-feature-item">Minimum 7 Shareholders Required</div>
            <div className="lt-feature-item">Special Resolution + MGT-14 &amp; INC-27</div>
            <div className="lt-feature-item">Free Share Transfer &amp; No Member Cap</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Conversions &amp; Registrations</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + DSC</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="ptpub-consult-form">
          <ConsultationForm
            source="private-to-public"
            subtitle="Talk to our Pvt-to-Public conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtpubBreadcrum;
