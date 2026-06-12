import React from "react";
import "./IacapBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const IacapBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Increase of Authorised Share Capital
          </span>

          <h1 className="lt-public-title">
            Increase Authorised Capital
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Make Room to Raise Funds, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Need to issue more shares or bring in investors? Legal Terminus increases your company's authorised share capital under Section 61 of the Companies Act, 2013 — checking the Articles permit it, passing the resolution at an EGM, altering the MOA capital clause, and filing Form SH-7 with the ROC along with the stamp duty on the increase. This gives your company the headroom to allot fresh shares and raise capital. Our professional fee starts at ₹3,999 + GST. Government fees &amp; stamp duty are billed separately at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Headroom to Issue More Shares</div>
            <div className="lt-feature-item">Ordinary Resolution &amp; Form SH-7 Filing</div>
            <div className="lt-feature-item">MOA Capital Clause Altered</div>
            <div className="lt-feature-item">AOA Check &amp; Allotment Guidance</div>
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

        <div id="iacap-consult-form">
          <ConsultationForm
            source="increase-authorised-capital"
            subtitle="Talk to our capital increase expert"
          />
        </div>

      </div>
    </section>
  );
};

export default IacapBreadcrum;
