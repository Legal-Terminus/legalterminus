import React from "react";
import "./PtollpBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const PtollpBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Partnership to LLP Conversion
          </span>

          <h1 className="lt-public-title">
            Convert Partnership Firm to LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Limited liability without heavy compliance</span>
          </h1>

          <p className="lt-public-description">
            A Partnership Firm to LLP Conversion allows your existing partnership firm to become a Limited Liability Partnership (LLP) under the LLP Act, 2008, offering limited liability with simpler compliance than a Private Limited Company. The process is faster and more cost-effective, with no newspaper advertisement, objection period, or complex restructuring, and is completed through Form 17 and FiLLiP filings on the MCA portal.
            <br /><br />
            We assist with document preparation, partner capital conversion, application filing, LLP Agreement drafting, and post-conversion compliances, including Form 14 and Form 3 filings.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Form 17 + FiLLiP</div>
            <div className="lt-feature-item">Section 55 LLP Act</div>
            <div className="lt-feature-item">Limited Liability</div>
            <div className="lt-feature-item">No Newspaper Ad</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>800+</h3>
              <p>LLP incorporations + conversions</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>Form 17 + GST + Bank + Form 3</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Compliance Expertise</p>
            </div>
          </div>

        </div>

        <div id="ptollp-consult-form">
          <ConsultationForm
            source="partnership-to-llp"
            subtitle="Talk to our LLP conversion expert"
          />
        </div>

      </div>
    </section>
  );
};

export default PtollpBreadcrum;
