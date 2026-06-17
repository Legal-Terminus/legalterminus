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
            Convert Private Limited into LLP
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Lighter compliance. Same shield</span>
          </h1>

          <p className="lt-public-description">
            A Private Limited Company to LLP Conversion allows businesses to move to a simpler structure while retaining limited liability, separate legal identity, and perpetual succession. LLPs have lower compliance requirements, with no mandatory AGM and fewer ROC filings.
            <br /><br />
            The conversion is completed under Section 56 and the Third Schedule of the LLP Act, 2008 through Form 18 and FiLLiP filings on the MCA portal. We provide end-to-end support, including eligibility review, documentation, MCA filings, LLP incorporation, LLP Agreement filing, and post-conversion compliances.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Form 18 + FiLLiP</div>
            <div className="lt-feature-item">Section 56 LLP Act</div>
            <div className="lt-feature-item">47(xiiib) Audit</div>
            <div className="lt-feature-item">No Newspaper Ad</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>500+</h3>
              <p>Company conversions handled</p>
            </div>
            <div>
              <h3>End-to-End Transition</h3>
              <p>Form 18 + GST + Bank + Form 3</p>
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
