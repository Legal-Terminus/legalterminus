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
            Want the protection of limited liability without the heavier compliance of a Private Limited Company? A Partnership Firm to LLP Conversion allows your existing partnership firm to move into a Limited Liability Partnership (LLP) structure under the Limited Liability Partnership Act, 2008. Compared to company conversion routes, LLP conversion is faster, simpler, and more cost-effective. There is no newspaper advertisement, no 21-day objection window, and no complex corporate restructuring. The conversion is completed through Form 17 and FiLLiP filing on the MCA portal.
            <br /><br />
            We help you convert your Partnership Firm into an LLP by preparing the required documents, mapping partners' capital into LLP contribution, filing the conversion application, drafting the LLP Agreement, and completing post-conversion compliances including Form 14 and Form 3 filings.
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
